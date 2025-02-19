import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from './settings.service';
import  CryptoJS from 'crypto-js';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  passwordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private settingsService: SettingsService) {}

  changePassword() {
    const userId = this.getUserId(); // Obtener el ID del usuario

    if (!userId) {
      alert("Error: No se pudo obtener el ID del usuario.");
      return;
    }

    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // 🔹 Asegurar que los valores sean `string`
    const oldPassword = this.passwordForm.value.oldPassword ?? '';
    const newPassword = this.passwordForm.value.newPassword ?? '';

    // 🔹 Hashear contraseñas en SHA-256 con CryptoJS
    const currentPasswordHash = CryptoJS.SHA256(oldPassword).toString();
    const newPasswordHash = CryptoJS.SHA256(newPassword).toString();

    const data = {
      current_password: currentPasswordHash,
      new_password: newPasswordHash
    };

    this.settingsService.updatePassword(userId, data).subscribe({
      next: response => {
        alert("Contraseña actualizada correctamente");
        this.passwordForm.reset();
      },
      error: (err: any) => {
        console.error("Error al actualizar la contraseña:", err);
        alert("Error al actualizar la contraseña");
      }
    });
  }

  getUserId(): number | null {
    const userData = localStorage.getItem('user');
    if (!userData) return null;

    const user = JSON.parse(userData);
    return user.id ?? null;
  }
}