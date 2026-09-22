import { Component, OnInit } from '@angular/core';
import { Customer } from '../../models/customer.model';
import { Product } from '../../models/product.model';
import { ItemSale } from '../../models/item-sale.model';
import { Sale } from '../../models/sale.model';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';
import { SaleService } from '../../services/sale.service';

/**
 * Componente Ponto de Venda (PDV).
 *
 * Fluxo:
 *  1. Utilizador seleciona um cliente.
 *  2. Utilizador seleciona um produto + quantidade e adiciona ao carrinho.
 *  3. Os totais (Bruto, IVA 14%, Líquido) são recalculados automaticamente
 *     através dos getters totalBruto / iva / totalLiquido.
 *  4. Ao clicar em "Finalizar Venda", envia-se o objeto Sale completo
 *     (customer_id, totais e items[]) para a API /sales.
 */
@Component({
  selector: 'app-sales',
  standalone: false,
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  customers: Customer[] = [];
  products: Product[] = [];

  selectedCustomerId: number | null = null;
  selectedProductId: number | null = null;
  quantidade = 1;

  cart: ItemSale[] = [];

  /** Taxa de IVA aplicada em Angola */
  readonly IVA_RATE = 0.14;

  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private saleService: SaleService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadProducts();
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (data) => (this.customers = data),
      error: (err) => console.error('Erro ao carregar clientes:', err)
    });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }

  /** Adiciona o produto selecionado ao carrinho, validando stock disponível */
  addToCart(): void {
    this.errorMessage = '';

    if (!this.selectedProductId || this.quantidade <= 0) {
      this.errorMessage = 'Selecione um produto e indique uma quantidade válida.';
      return;
    }

    const product = this.products.find((p) => p.id === this.selectedProductId);
    if (!product) {
      this.errorMessage = 'Produto não encontrado.';
      return;
    }

    // Quantidade já existente no carrinho para este produto (evita ultrapassar o stock)
    const existing = this.cart.find((i) => i.product_id === product.id);
    const quantidadeJaNoCarrinho = existing ? existing.quantidade : 0;

    if (this.quantidade + quantidadeJaNoCarrinho > (product.stock ?? 0)) {
      this.errorMessage = `Stock insuficiente para "${product.name}". Disponível: ${product.stock}`;
      return;
    }

    if (existing) {
      existing.quantidade += this.quantidade;
      existing.subtotal = existing.quantidade * existing.unit_price;
    } else {
      this.cart.push({
        product_id: product.id!,
        product_name: product.name,
        quantidade: this.quantidade,
        unit_price: product.price,
        subtotal: this.quantidade * product.price
      });
    }

    // Repõe os campos de seleção
    this.selectedProductId = null;
    this.quantidade = 1;
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
  }

  /** Total Bruto = soma das quantidades × preço unitário */
  get totalBruto(): number {
    return this.cart.reduce((sum, item) => sum + item.subtotal, 0);
  }

  /** IVA (14%) sobre o Total Bruto */
  get iva(): number {
    return this.totalBruto * this.IVA_RATE;
  }

  /** Total Líquido = Total Bruto + IVA */
  get totalLiquido(): number {
    return this.totalBruto + this.iva;
  }

  /** Envia a venda estruturada para a API */
  finalizarVenda(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedCustomerId) {
      this.errorMessage = 'Selecione um cliente antes de finalizar a venda.';
      return;
    }
    if (this.cart.length === 0) {
      this.errorMessage = 'Adicione pelo menos um produto ao carrinho.';
      return;
    }

    const sale: Sale = {
      customer_id: this.selectedCustomerId,
      total_bruto: this.totalBruto,
      iva: this.iva,
      total_liquido: this.totalLiquido,
      items: this.cart
    };

    this.isSaving = true;
    this.saleService.create(sale).subscribe({
      next: () => {
        this.successMessage = 'Venda registada com sucesso!';
        this.cart = [];
        this.selectedCustomerId = null;
        this.isSaving = false;
        this.loadProducts(); // Atualiza o stock exibido após a venda
      },
      error: (err) => {
        console.error('Erro ao finalizar venda:', err);
        this.errorMessage = 'Ocorreu um erro ao finalizar a venda. Tente novamente.';
        this.isSaving = false;
      }
    });
  }
}
