import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  readonly cargos = ['Administrador', 'Gerente', 'Vendedor'];

  newUser: User = this.emptyUser();
  plainPassword = '';
  isEditing = false;
  editingId: number | null = null;
  currentSenhaCifrada = '';

  successMessage = '';
  errorMessage = '';
  isSaving = false;

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
    return { nome: '', email: '', cargo: 'Vendedor' };
  }

  openNewUserModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.newUser = this.emptyUser();
    this.plainPassword = '';
    this.currentSenhaCifrada = '';
  }

  editUser(user: User): void {
    this.isEditing = true;
    this.editingId = user.id ?? null;
    this.newUser = { ...user };
    this.currentSenhaCifrada = user.senhaCifrada ?? '';
    this.plainPassword = ''; // Nunca é pré-preenchida por segurança
  }

  async saveUser(): Promise<void> {
    this.errorMessage = '';

    if (!this.newUser.nome || !this.newUser.email) {
      this.errorMessage = 'Nome e email são obrigatórios.';
      return;
    }
    if (!this.isEditing && !this.plainPassword) {
      this.errorMessage = 'A password é obrigatória para novos utilizadores.';
      return;
    }

    this.isSaving = true;

    try {
      if (this.isEditing && this.editingId) {
        await this.userService.update(this.editingId, this.newUser, this.plainPassword || null, this.currentSenhaCifrada);
        this.successMessage = 'Utilizador atualizado com sucesso!';
      } else {
        await this.userService.create(this.newUser, this.plainPassword);
        this.successMessage = 'Utilizador criado com sucesso!';
      }
      this.loadUsers();
      this.resetForm();
    } catch (err) {
      console.error(err);
      this.errorMessage = 'Ocorreu um erro ao processar o pedido.';
    } finally {
      this.isSaving = false;
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
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Ocorreu um erro ao eliminar o utilizador.';
      }
    });
  }

  private resetForm(): void {
    this.newUser = this.emptyUser();
    this.plainPassword = '';
    this.currentSenhaCifrada = '';
    this.isEditing = false;
    this.editingId = null;
  }
}
