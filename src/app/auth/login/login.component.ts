import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  providers: [LoginService],
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  users = {
    user: '',
    password: ''
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit() {
    // Hashear la contraseña antes de enviarla
    const hashedPassword = CryptoJS.SHA256(this.users.password).toString();

    this.loginService.login({ user: this.users.user, password: hashedPassword }).subscribe({
      next: (response) => {
        this.successMessage = 'Inicio exitoso.';
        this.errorMessage = null;
        this.router.navigate(['/dashboard']); 
      },
      error: (error) => {
        this.errorMessage = 'Usuario o contraseña inválida. Intenta de nuevo.';
        this.successMessage = null;
        console.error('Error:', error);
      }
    });
  }
}