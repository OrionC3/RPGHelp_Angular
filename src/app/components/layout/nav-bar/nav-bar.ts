import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@core/enums';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EnumLanguage } from '@core/enums/language.enum';
import { interval, Subscription } from 'rxjs';

@Component({
    selector: 'app-nav-bar',
    imports: [RouterLink, TranslatePipe],
    templateUrl: './nav-bar.html',
    styleUrl: './nav-bar.scss',
})
export class NavBar {
    public currentLanguage: string = 'fr'; // Valeur par défaut
    private timerSubscription: Subscription | null = null;
    private readonly intervalTimeMs = 3000000; // Changer la langue toutes les 3 secondes
    // import de l'enum dans une propriété pour l'utiliser dans l'HTML
    UserRole = UserRole;

    // injection de dépendance
    private readonly _translate = inject(TranslateService);
    private readonly _authService = inject(AuthService);

    // liaisons aux signals du service
    isConnected = this._authService.isConnected;
    role = this._authService.role;

    // méthode de déconnexion
    onClickLogout() {
        this._authService.logout();
    }

    onChangeLanguage(lang: string) {
        this._translate.use(lang);
    }

    ngOnInit(): void {
        this.currentLanguage =
            this._translate.getCurrentLang() ||
            this._translate.getFallbackLang() ||
            'fr';
        // 1. Démarrer le timer
        this.startRandomLanguageTimer();

        this._translate.onLangChange.subscribe((event) => {
            this.currentLanguage = event.lang;
        });
    }

    ngOnDestroy(): void {
        // 2. Nettoyer l'abonnement pour éviter les fuites de mémoire
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }

    private setRandomLanguage(): void {
        const languages = Object.values(EnumLanguage);

        // Génère un index aléatoire dans le tableau des langues
        const randomIndex = Math.floor(Math.random() * languages.length);

        // Récupère le code de langue aléatoire
        const randomLangCode = languages[randomIndex];

        // Applique la nouvelle langue
        this._translate.use(randomLangCode).subscribe(() => {
            console.log(`Langue changée aléatoirement : ${randomLangCode}`);
        });
    }

    private startRandomLanguageTimer(): void {
        this.timerSubscription = interval(this.intervalTimeMs).subscribe(() => {
            this.setRandomLanguage();
        });
    }

    onClickSelf() {}
}
