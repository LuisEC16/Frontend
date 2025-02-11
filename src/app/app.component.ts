import { Component, OnInit } from '@angular/core';
import { RouterOutlet,Router,RouterModule } from '@angular/router';
import { RegisterRootService } from './auth/register-root/register-root.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private registerRootService: RegisterRootService, private router: Router) {}

  ngOnInit() {
    this.registerRootService.checkSetup().subscribe(response => {
      if (response.needsSetup) {
        this.router.navigate(['/setup']); // Si no hay root, ir a configuración inicial
      } else {
        this.router.navigate(['/login']); // Si ya hay root, ir a login
      }
    });
  }
}
