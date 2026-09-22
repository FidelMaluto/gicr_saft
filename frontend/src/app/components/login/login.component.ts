import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

/**
 * Componente de Login.
 * Autentica o utilizador via UserService.login() e, em caso de sucesso,
 * guarda a sessão através do AuthService e redireciona para o PDV.
 */
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  senhaCifrada = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.email || !this.senhaCifrada) {
      this.errorMessage = 'Indique o email e a password.';
      return;
    }

    this.isLoading = true;
    this.userService.login(this.email, this.senhaCifrada).subscribe({
      next: (user) => {
        this.authService.setCurrentUser(user);
        this.isLoading = false;
        this.router.navigate(['/sales']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.errorMessage = 'Email ou password inválidos.';
        this.isLoading = false;
      }
    });
  }
}
