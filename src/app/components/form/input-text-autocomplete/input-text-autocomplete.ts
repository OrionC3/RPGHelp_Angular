import { Component, forwardRef, input, output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-input-text-autocomplete',
    imports: [FormsModule],
    templateUrl: './input-text-autocomplete.html',
    styleUrl: './input-text-autocomplete.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputTextAutocomplete),
            multi: true,
        },
    ],
})
export class InputTextAutocomplete {
    // Utilisation de input() pour déclarer les propriétés entrantes.
    // La valeur entre parenthèses est la valeur par défaut.
    inputId = input<string>('');
    placeholder = input('Rechercher...');
    suggestions = input<any[]>([]); // Spécifiez le type générique si vous n'avez pas de valeur par défaut simple.
    displayKey = input('name');

    // Utilisation de output() pour déclarer les propriétés sortantes.
    // La valeur entre parenthèses est le type de l'événement émis (équivalent à EventEmitter<Type>).
    search = output<string>();
    itemSelected = output<any>();

    // Propriétés internes
    public searchTerm: string = '';
    public showSuggestions: boolean = false;
    value: string = '';
    disabled = false;
    timeout: any;

    // 3. Méthodes
    onInputChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        if (value !== null && value !== '') {
            if (this.timeout) [clearTimeout(this.timeout)];
            this.timeout = setTimeout(() => {
                this.searchTerm = value;
                this.showSuggestions = value.length > 0;

                // Émettre la valeur en utilisant la méthode .emit() du nouvel output
                this.search.emit(value);
            }, 400);
        }
    }

    selectSuggestion(item: any) {
        // Note : Pour accéder aux valeurs des inputs, on appelle simplement la fonction (ex: this.displayKey())
        this.searchTerm = item[this.displayKey()];
        this.showSuggestions = false;

        // Émettre l'objet complet sélectionné
        this.itemSelected.emit(item[this.displayKey()]);
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

    writeValue(value: any): void {
        this.value = value || '';
    }

    handleInput(event: any) {
        const val = event.target.value;
        this.value = val;
        this.onChange(val);
    }
}
