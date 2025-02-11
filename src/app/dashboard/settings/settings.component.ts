import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // 🔥 Importando módulos necesarios para Standalone
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  changePasswordForm: FormGroup;
  createUserForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Formulario para cambiar contraseña
    this.changePasswordForm = this.fb.nonNullable.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    // Formulario para crear usuario
    this.createUserForm = this.fb.nonNullable.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

      if (newPassword !== confirmPassword) {
        alert('❌ Las contraseñas no coinciden.');
        return;
      }

      console.log('🔄 Cambiando contraseña...', { currentPassword, newPassword });
      // 🔥 Aquí puedes hacer la petición al backend para actualizar la contraseña
    }
  }

  createUser() {
    if (this.createUserForm.valid) {
      const { username, password } = this.createUserForm.value;

      console.log('🆕 Creando nuevo usuario...', { username, password });
      // 🔥 Aquí puedes hacer la petición al backend para registrar un nuevo usuario
    }
  }
}
