import { Component, OnInit } from '@angular/core';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  newCustomer: Customer = this.emptyCustomer();

  successMessage = '';
  errorMessage = '';

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (data) => (this.customers = data),
      error: (err) => console.error('Erro ao carregar clientes:', err)
    });
  }

  private emptyCustomer(): Customer {
    return { nome: '', nif: '', telefone: '', email: '' };
  }

  addCustomer(): void {
    this.errorMessage = '';

    if (!this.newCustomer.nome || !this.newCustomer.nif) {
      this.errorMessage = 'Nome e NIF são obrigatórios.';
      return;
    }

    this.customerService.create(this.newCustomer).subscribe({
      next: () => {
        this.successMessage = 'Cliente cadastrado com sucesso!';
        this.newCustomer = this.emptyCustomer();
        this.loadCustomers();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao cadastrar cliente.';
      }
    });
  }

  deleteCustomer(id?: number): void {
    if (!id) return;
    if (!confirm('Tem a certeza que deseja eliminar este cliente?')) return;

    this.customerService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Cliente eliminado com sucesso.';
        this.loadCustomers();
      },
      error: (err) => console.error(err)
    });
  }
}
