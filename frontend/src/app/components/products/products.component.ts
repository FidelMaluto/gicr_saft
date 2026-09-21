import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

/**
 * Componente de Gestão de Produtos (Inventário).
 * Lista os produtos numa tabela Bootstrap e permite criar/editar/eliminar
 * através de um modal Bootstrap com formulário controlado por ngModel.
 */
@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  newProduct: Product = this.emptyProduct();
  isEditing = false;
  editingId: number | null = null;

  successMessage = '';
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }

  private emptyProduct(): Product {
    return { name: '', price: 0, stock: 0, description: '' };
  }

  /** Prepara o modal para criação de um novo produto */
  openNewProductModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.newProduct = this.emptyProduct();
  }

  /** Prepara o modal com os dados do produto a editar */
  editProduct(product: Product): void {
    this.isEditing = true;
    this.editingId = product.id ?? null;
    this.newProduct = { ...product };
  }

  /** Cria ou atualiza o produto, conforme o modo atual do formulário */
  saveProduct(): void {
    this.errorMessage = '';

    if (!this.newProduct.name || this.newProduct.price < 0 || this.newProduct.stock < 0) {
      this.errorMessage = 'Preencha corretamente o nome, preço e stock do produto.';
      return;
    }

    if (this.isEditing && this.editingId) {
      this.productService.update(this.editingId, this.newProduct).subscribe({
        next: () => {
          this.successMessage = 'Produto atualizado com sucesso!';
          this.loadProducts();
          this.resetForm();
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.productService.create(this.newProduct).subscribe({
        next: () => {
          this.successMessage = 'Produto adicionado com sucesso!';
          this.loadProducts();
          this.resetForm();
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  deleteProduct(id?: number): void {
    if (!id) return;
    if (!confirm('Tem a certeza que deseja eliminar este produto?')) return;

    this.productService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Produto eliminado com sucesso.';
        this.loadProducts();
      },
      error: (err) => this.handleError(err)
    });
  }

  private resetForm(): void {
    this.newProduct = this.emptyProduct();
    this.isEditing = false;
    this.editingId = null;
  }

  private handleError(err: any): void {
    console.error(err);
    this.errorMessage = 'Ocorreu um erro ao processar o pedido.';
  }
}
