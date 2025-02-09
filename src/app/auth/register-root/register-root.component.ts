import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterRootService } from './register-root.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-setup',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-root.component.html',
  styleUrls: ['./register-root.component.css']
})
export class RegisterRootComponent {
  users = { user: '', password: '' };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private registerRootService: RegisterRootService, private router: Router) {}

  createRootUser() {
    if (!this.users.user || !this.users.password) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    // Hasheando la contraseña antes de enviarla
    const hashedPassword = CryptoJS.SHA256(this.users.password).toString();

    this.registerRootService.createRootUser(this.users.user, hashedPassword).subscribe({
      next: () => {
        this.successMessage = 'Usuario root creado con éxito.';
        this.errorMessage = null;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Ocurrió un error.';
        this.successMessage = null;
      }
    });
  }
}
