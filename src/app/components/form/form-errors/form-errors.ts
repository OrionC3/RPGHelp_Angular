import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-errors',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './form-errors.html',
  styleUrl: './form-errors.scss',
})
export class FormErrorsComponent {
  @Input({ required: true }) control!: AbstractControl;

  private readonly errorMessages: Record<string, string> = {
    required: 'components.common.form-errors.required',
    email: 'components.common.form-errors.email',
    minlength: 'components.common.form-errors.minlength',
    maxlength: 'components.common.form-errors.maxlength',
    lowerCase: 'components.common.form-errors.lowerCase',
    upperCase: 'components.common.form-errors.upperCase',
    number: 'components.common.form-errors.number',
    specialChar: 'components.common.form-errors.specialChar',
    tooShort: 'components.common.form-errors.minlength',
    pattern: 'components.common.form-errors.email',
  };

  get shouldDisplay(): boolean {
    return !!(
      this.control &&
      this.control.invalid &&
      (this.control.touched || this.control.dirty)
    );
  }

  get errors(): string[] {
    return this.control?.errors ? Object.keys(this.control.errors) : [];
  }

  getMessage(errorKey: string): string {
    return this.errorMessages[errorKey] ?? 'components.common.form-errors.unknown';
  }
}
