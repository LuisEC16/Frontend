import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  providers: [LoginService],
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = {
    User: '',
    Password: ''
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit() {
    // Hashear la contraseña antes de enviarla
    const hashedPassword = CryptoJS.SHA256(this.user.Password).toString();

    this.loginService.login({ User: this.user.User, Password: hashedPassword }).subscribe({
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