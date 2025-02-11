import { Routes, CanActivateFn } from '@angular/router';
import { RegisterRootComponent } from './auth/register-root/register-root.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterRootService } from './auth/register-root/register-root.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';  // ✅ Manejo seguro del Observable
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { authGuard } from './auth.guard';

// ✅ Función guard para controlar acceso a la ruta de setup
const setupGuard: CanActivateFn = async () => {
  const registerRootService = inject(RegisterRootService);

  try {
    const response = await firstValueFrom(registerRootService.checkSetup());
    console.log('📌 Verificación de setup:', response);
    return response?.needsSetup ?? false;
  } catch (error) {
    console.error('❌ Error en setupGuard:', error);
    return false; // ❌ Si hay error, permite el acceso en vez de bloquearlo
  }
};


// 🔹 Definición de rutas con protección de setup y autenticación
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // 🔹 Redirige a /login por defecto
  { path: 'setup', component: RegisterRootComponent, canActivate: [setupGuard] }, // 🟢 Protegido por setupGuard
  { path: 'login', component: LoginComponent }, // 🔹 Página de inicio de sesión
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }, // 🔐 Protegido con authGuard
  { path: 'transactions', component: TransactionsComponent, canActivate: [authGuard] } // 🔐 Protegido con authGuard
];


export const routerProviders = [
  provideRouter(routes, withComponentInputBinding())
];
