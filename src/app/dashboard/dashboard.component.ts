import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private router: Router) {}

  logout() {
    // Aquí se debería borrar el token de sesión en localStorage
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
