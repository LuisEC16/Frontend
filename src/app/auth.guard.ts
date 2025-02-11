import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken'); // Obtener el token

  if (!token) {
    router.navigate(['/login']); // Redirigir si no hay token
    return false;
  }

  return true; // Permitir acceso si hay token
};
