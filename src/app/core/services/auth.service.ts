import { HttpClient } from '@angular/common/http';
import {
    computed,
    effect,
    inject,
    Injectable,
    Signal,
    signal,
} from '@angular/core';
import { UserRole } from '@core/enums';
import { LoginResponse } from '@core/models/login-response.model.ts';
import { Token } from '@core/models/token.model';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { UserRegisterForm } from '@core/models/user-register-form.model';
import { environment } from '@env';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    // Injection du HttpClient
    private readonly _httpClient = inject(HttpClient);

    // signal pour savoir si l'utilisateur est connecté (calculé à partir du token)
    isConnected: Signal<boolean> = computed(() => !!this.token()); // !! convertit en booléen

    // signal pour le role de l'utilisateur (null si non connecté)
    private _role = signal<UserRole[] | null>(null);
    role = this._role.asReadonly();

    // signal pour le token JWT
    private _token = signal<string | null>(null);
    token = this._token.asReadonly();

    constructor() {
        // Récupération du token depuis le localstorage
        const tokenStr = localStorage.getItem('token');

        if (tokenStr) {
            // S'il y a un token, on le met dans le signal
            this._token.set(tokenStr);
        }

        // Effet qui réagit aux changements du signal "token"
        effect(() => {
            // Récupération de la valeur du token
            const token = this._token();

            if (token == null) {
                // S'il n'y a pas de token, on supprime le token du localstorage et on met le role à null
                // (utilisateur déconnecté)
                localStorage.removeItem('token');
                this._role.set(null);
            } else {
                // S'il y a un token, on le stocke dans le localstorage et on met à jour le role
                // (utilisateur connecté)
                localStorage.setItem('token', token);
                const tokenProp = jwtDecode<Token>(token);
                console.log(tokenProp);
                const rolesFromToken =
                    tokenProp[
                        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                    ];

                // Initialisation d'une variable pour le tableau de rôles final
                let finalRoles: UserRole[];

                // 1. Vérifier si ce qui est retourné est déjà un tableau
                if (Array.isArray(rolesFromToken)) {
                    // Si c'est déjà un tableau, on l'utilise directement
                    finalRoles = rolesFromToken as UserRole[];
                } else if (rolesFromToken) {
                    // Si ce n'est PAS un tableau, mais qu'il y a une valeur (un rôle unique),
                    // on l'encapsule dans un nouveau tableau.
                    finalRoles = [rolesFromToken as UserRole];
                } else {
                    // S'il n'y a pas de rôle du tout
                    finalRoles = [];
                }

                // Maintenant, 'finalRoles' est garanti d'être de type 'UserRole[]'
                this._role.set(finalRoles);
            }
        });
    }

    async login(email: string, password: string): Promise<void> {
        // Appel API pour se connecter
        const response = await firstValueFrom(
            this._httpClient.post<LoginResponse>(
                environment.apiUrl + 'api/user/login',
                {
                    email: email,
                    password,
                },
            ),
        );

        // Stockage du token dans le signal (ce qui déclenche l'effet)
        this._token.set(response.token);
    }

    register(form: UserRegisterForm): Promise<void> {
        // Appel API pour s'enregistrer
        return firstValueFrom(
            this._httpClient.post<void>(
                environment.apiUrl + 'api/user/register',
                form,
            ),
        );
    }

    logout() {
        // Déconnexion : on met le token à null (ce qui déclenche l'effet)
        this._token.set(null);
    }
}
