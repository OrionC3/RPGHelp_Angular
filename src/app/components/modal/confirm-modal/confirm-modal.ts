import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss',
})
export class ConfirmModal {
  message = input<string>();
  confirmed = output<boolean>();

  onConfirm() {
    this.confirmed.emit(true); // Émet 'true' si l'utilisateur confirme
  }

  onCancel() {
    this.confirmed.emit(false); // Émet 'false' si l'utilisateur annule
  }
}
