import { Component, forwardRef, input, output, OnDestroy } from '@angular/core';
import {
    ControlValueAccessor,
    FormsModule,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
    selector: 'app-input-datalist',
    imports: [FormsModule],
    templateUrl: './input-datalist.html',
    styleUrl: './input-datalist.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputDatalist),
            multi: true,
        },
    ],
})
export class InputDatalist<T> implements ControlValueAccessor, OnDestroy {
    // Entrées (Inputs)
    inputId = input<string>('');
    items = input<T[]>([]);
    displayKey = input<keyof T>('' as keyof T);
    // Clé utilisée comme valeur interne (l'ID)
    idKey = input<keyof T>('' as keyof T);

    // Sortie (Output) pour déclencher la recherche (après debounce)
    readonly search = output<string>();
    id = output<string | number | null>();

    // 'value' stockera le NOM à afficher, pas l'ID.
    value: string = '';
    disabled = false;
    timeout: any;
    private readonly debounceTime = 400;

    // ... (resetTimer, ngOnDestroy, et ControlValueAccessor méthodes) ...
    resetTimer() {
        // 1. Annule le timer précédent s'il existe
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        // 2. Si l'input n'est pas vide, définit un nouveau timer
        if (this.value) {
            this.timeout = setTimeout(() => {
                // 3. Après le délai (400ms), émet la valeur de l'input
                // pour déclencher la recherche dans le composant parent.
                this.search.emit(this.value);
            }, this.debounceTime); // private readonly debounceTime = 400;
        }
    }

    ngOnDestroy(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    onChange = (value: any) => {};
    onTouched = () => {};

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Méthode appelée lorsque l'utilisateur sélectionne un élément
     * ou lorsque le CVA reçoit une valeur (qui sera l'ID).
     * @param identifier La valeur à rechercher, qui peut être l'ID ou le nom.
     */
    selectItem(identifier: string | number) {
        // Tente de trouver l'objet par l'ID OU par le NOM
        const selectedObject = this.items().find(
            (item) =>
                item[this.idKey()] == identifier ||
                item[this.displayKey()] == identifier,
        );

        if (selectedObject) {
            const displayValue = String(selectedObject[this.displayKey()]);

            let idValue: number | string | null = selectedObject[
                this.idKey()
            ] as number | string | null;

            this.id.emit(idValue);
            console.log('idvalue :' + idValue);
            // Tenter de convertir l'ID en nombre si c'est une chaîne
            if (typeof idValue === 'string') {
                const numericId = parseInt(idValue, 10);
                // Utiliser le nombre seulement si la conversion a réussi (n'est pas NaN)
                idValue = isNaN(numericId) ? idValue : numericId;
                console.log('numeric : ' + idValue);
            }

            // Si l'ID est null ou undefined, assurez-vous de le gérer
            if (idValue === null || idValue === undefined) {
                idValue = null;
            }
            // 1. Mettre à jour la valeur de l'input pour afficher le NOM
            this.value = displayValue;

            // 2. Émettre l'ID via le ControlValueAccessor
            this.onChange(idValue);

            // Évite le déclenchement immédiat de la recherche API après la sélection
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
        } else {
            // Si rien n'est trouvé, réinitialiser la valeur du Control
            this.onChange(null);
        }
    }

    // Modification de writeValue pour gérer le cas où l'ID est fourni par le FormControl
    writeValue(value: any): void {
        if (value) {
            // Si le CVA reçoit une valeur (l'ID), on l'utilise pour trouver et afficher le nom
            this.selectItem(value);
        } else {
            this.value = '';
            this.onChange(null);
        }
    }

    handleInput(event: any) {
        const val = event.target.value;
        this.value = val;

        // Lors de la frappe, on envoie la valeur textuelle pour permettre au parent de faire la recherche.
        // On n'appelle PAS this.onChange(val) ici, car cela enverrait le nom au lieu de l'ID.

        // On réinitialise la valeur du FormControl à null si l'utilisateur modifie la saisie
        const match = this.items().find(
            (item) => item[this.displayKey()] === val,
        );
        if (!match) {
            this.onChange(null);
        } else {
            // Si l'utilisateur tape le nom exact et qu'un match est trouvé,
            // on envoie l'ID via selectItem.
            this.selectItem(val);
        }

        this.resetTimer();
    }
}
