import { Component, forwardRef, Input, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-password-input',
  imports: [TranslatePipe],
  templateUrl: './password-input.html',
  styleUrl: './password-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInput),
      multi: true,
    },
  ],
})
export class PasswordInput implements ControlValueAccessor {
  inpuId = input<string>('');

  showPassword: boolean = false;

  value: string = '';
  disabled = false;

  // Callbacks
  onChange = (value: any) => {};
  onTouched = () => {};

  // Gestion visibilité password
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // ControlValueAccessor
  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Quand l'utilisateur tape
  handleInput(event: any) {
    const val = event.target.value;
    this.value = val;
    this.onChange(val);
  }
}
