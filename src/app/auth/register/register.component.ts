import { Component,OnInit, inject } from '@angular/core';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-auth',
  providers: [RegisterService],
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    User: '',
    Password: ''
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private registerService: RegisterService, private router: Router) {}

  onSubmit() {
    // Hashear la contraseña con SHA-256 antes de enviarla
    const hashedPassword = CryptoJS.SHA256(this.user.Password).toString();
    
    // Enviar los datos al backend
    this.registerService.register({ User: this.user.User, Password: hashedPassword }).subscribe({
      next: () => {
        this.successMessage = 'Usuario creado exitosamente.';
        this.errorMessage = null;
        this.router.navigate(['/login']); // Redirigir al login
      },
      error: (error) => {
        this.errorMessage = 'Error al crear el usuario. Intenta de nuevo.';
        this.successMessage = null;
        console.error('Error:', error);
      }
    });
  }
}
