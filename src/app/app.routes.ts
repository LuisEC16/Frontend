import { Routes, CanActivateFn } from '@angular/router';
import { RegisterRootComponent } from './auth/register-root/register-root.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterRootService } from './auth/register-root/register-root.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';  // ✅ Manejo seguro del Observable
import { DashboardComponent } from './dashboard/dashboard.component';

// 👇 Función guard para controlar acceso a la ruta de setup
const setupGuard: CanActivateFn = async () => {
  const registerRootService = inject(RegisterRootService);

  try {
    const response = await firstValueFrom(registerRootService.checkSetup());
    return response?.needsSetup ?? false; // ✅ Permite acceso solo si no hay root user
  } catch (error) {
    console.error('Error verificando setup:', error);
    return false; // Si hay error en la API, NO permite el acceso
  }
};

// 👇 Definición de rutas con protección de setup
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'setup', component: RegisterRootComponent, canActivate: [setupGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent}
];
