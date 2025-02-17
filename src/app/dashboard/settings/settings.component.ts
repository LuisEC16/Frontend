import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from './settings.service';


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

  userForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    userPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private settingsService: SettingsService) {}

  changePassword() {
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    this.settingsService.updatePassword(this.passwordForm.value).subscribe({
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
}
