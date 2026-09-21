import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

/**
 * Componente de Gestão de Utilizadores.
 * Lista os utilizadores numa tabela Bootstrap e permite criar/editar/eliminar
 * através de um modal. Por segurança, a password nunca é pré-preenchida ao
 * editar, e só é enviada ao back-end se o campo for explicitamente alterado.
 */
@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  newUser: User = this.emptyUser();
  isEditing = false;
  editingId: number | null = null;

  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Erro ao carregar utilizadores:', err)
    });
  }

  private emptyUser(): User {
    return { name: '', email: '', password: '', role: 'vendedor' };
  }

  openNewUserModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.newUser = this.emptyUser();
  }

  editUser(user: User): void {
    this.isEditing = true;
    this.editingId = user.id ?? null;
    // Não pré-preenchemos a password por segurança — fica vazia até o utilizador decidir alterá-la
    this.newUser = { ...user, password: '' };
  }

  saveUser(): void {
    this.errorMessage = '';

    if (!this.newUser.name || !this.newUser.email) {
      this.errorMessage = 'Nome e email são obrigatórios.';
      return;
    }
    if (!this.isEditing && !this.newUser.password) {
      this.errorMessage = 'A password é obrigatória para novos utilizadores.';
      return;
    }

    if (this.isEditing && this.editingId) {
      // Se a password ficou vazia durante a edição, não a enviamos (mantém a atual no back-end)
      const payload: User = { ...this.newUser };
      if (!payload.password) {
        delete payload.password;
      }

      this.userService.update(this.editingId, payload).subscribe({
        next: () => {
          this.successMessage = 'Utilizador atualizado com sucesso!';
          this.loadUsers();
          this.resetForm();
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.userService.create(this.newUser).subscribe({
        next: () => {
          this.successMessage = 'Utilizador criado com sucesso!';
          this.loadUsers();
          this.resetForm();
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  deleteUser(id?: number): void {
    if (!id) return;
    if (!confirm('Tem a certeza que deseja eliminar este utilizador?')) return;

    this.userService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Utilizador eliminado com sucesso.';
        this.loadUsers();
      },
      error: (err) => this.handleError(err)
    });
  }

  private resetForm(): void {
    this.newUser = this.emptyUser();
    this.isEditing = false;
    this.editingId = null;
  }

  private handleError(err: any): void {
    console.error(err);
    this.errorMessage = 'Ocorreu um erro ao processar o pedido.';
  }
}
