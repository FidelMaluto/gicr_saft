import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sistema de Gestão de Inventário e Vendas';

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
