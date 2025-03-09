import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../settings/settings.service';
import { MessageService } from 'primeng/api';
import * as CryptoJS from 'crypto-js';
import { Toast } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  providers: [MessageService],
  imports: [Toast, PasswordModule, ReactiveFormsModule]
})
export class SettingsComponent {
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private messageService: MessageService
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      if (!this.passwordForm.value.oldPassword) {
        this.showToast('error', 'Error', 'La contraseña actual es obligatoria');
      }
      if (!this.passwordForm.value.newPassword) {
        this.showToast('error', 'Error', 'La nueva contraseña es obligatoria');
      }
      if (
        this.passwordForm.value.newPassword &&
        this.passwordForm.value.newPassword.length < 8
      ) {
        this.showToast(
          'error',
          'Error',
          'La nueva contraseña debe tener al menos 8 caracteres'
        );
      }
      return;
    }

    const userId = this.getUserId();
    if (!userId) {
      this.showToast('error', 'Error', 'No se pudo obtener el ID del usuario');
      return;
    }

    const oldPasswordHash = CryptoJS.SHA256(
      this.passwordForm.value.oldPassword
    ).toString();
    const newPasswordHash = CryptoJS.SHA256(
      this.passwordForm.value.newPassword
    ).toString();

    const data = {
      current_password: oldPasswordHash,
      new_password: newPasswordHash
    };

    this.settingsService.updatePassword(userId, data).subscribe({
      next: (response) => {
        this.showToast(
          'success',
          'Éxito',
          'Contraseña actualizada correctamente'
        );
        this.passwordForm.reset();
      },
      error: (err) => {
        this.showToast(
          'error',
          'Error',
          err.error.message || 'Error al actualizar la contraseña'
        );
      }
    });
  }

  getUserId(): number | null {
    const userData = localStorage.getItem('user');
    if (!userData) return null;

    const user = JSON.parse(userData);
    return user.id ?? null;
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }
}
