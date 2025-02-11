import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http'; // ✅ Agregar esto
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // ✅ Define las rutas
    provideHttpClient(),    // ✅ Agregar el HttpClient
    importProvidersFrom(CommonModule, FormsModule) // ✅ Importa módulos si es necesario
  ]
}).catch((err) => console.error(err));
