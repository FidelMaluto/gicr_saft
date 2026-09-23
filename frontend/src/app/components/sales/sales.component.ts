import { Component, OnInit } from '@angular/core';
import { Customer } from '../../models/customer.model';
import { Product } from '../../models/product.model';
import { ItemSale } from '../../models/item-sale.model';
import { Sale } from '../../models/sale.model';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';
import { SaleService } from '../../services/sale.service';
import { ItemSaleService } from '../../services/item-sale.service';
import { AuthService } from '../../services/auth.service';

/**
 * Componente Ponto de Venda (PDV).
 *
 * Como o back-end separa a venda (tabela `vendas`) dos itens
 * (tabela `itens_venda`) em endpoints diferentes, finalizar uma venda
 * é uma operação em 3 passos, feita aqui em sequência:
 *   1. POST /Venda            -> cria o cabeçalho e devolve o `id`
 *   2. POST /ItensVenda (x N) -> cria uma linha por produto no carrinho
 *   3. PUT  /Produto/:id (xN) -> decrementa o stockAtual de cada produto
 *
 * Não há transação atómica no back-end atual — se um passo falhar a meio,
 * a venda pode ficar parcialmente registada. Fica assinalado no ecrã e
 * na consola quando isso acontece, para correção manual se necessário.
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
  quantity = 1;
  formaPagamento = 'Numerário';

  readonly formasPagamento = ['Numerário', 'Multicaixa', 'Transferência Bancária'];

  cart: ItemSale[] = [];

  readonly IVA_RATE = 0.14;

  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private saleService: SaleService,
    private itemSaleService: ItemSaleService,
    private authService: AuthService
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

  addToCart(): void {
    this.errorMessage = '';

    if (!this.selectedProductId || this.quantity <= 0) {
      this.errorMessage = 'Selecione um produto e indique uma quantidade válida.';
      return;
    }

    const product = this.products.find((p) => p.id === this.selectedProductId);
    if (!product) {
      this.errorMessage = 'Produto não encontrado.';
      return;
    }

    const existing = this.cart.find((i) => i.produtoID === product.id);
    const quantidadeJaNoCarrinho = existing ? existing.quantidade : 0;

    if (this.quantity + quantidadeJaNoCarrinho > (product.stockAtual ?? 0)) {
      this.errorMessage = `Stock insuficiente para "${product.nome}". Disponível: ${product.stockAtual}`;
      return;
    }

    if (existing) {
      existing.quantidade += this.quantity;
      existing.subtotal = existing.quantidade * existing.precoUnitario;
    } else {
      this.cart.push({
        produtoID: product.id!,
        productName: product.nome,
        quantidade: this.quantity,
        precoUnitario: product.precoVenda,
        subtotal: this.quantity * product.precoVenda
      });
    }

    this.selectedProductId = null;
    this.quantity = 1;
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
  }

  get totalBruto(): number {
    return this.cart.reduce((sum, item) => sum + (item.subtotal ?? 0), 0);
  }

  get iva(): number {
    return this.totalBruto * this.IVA_RATE;
  }

  get totalLiquido(): number {
    return this.totalBruto + this.iva;
  }

  async finalizarVenda(): Promise<void> {
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

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Sessão inválida. Inicia sessão novamente.';
      return;
    }

    this.isSaving = true;

    const sale: Sale = {
      formaPagamento: this.formaPagamento,
      clienteID: this.selectedCustomerId,
      totalVenda: this.totalBruto,
      valorIVA: this.iva,
      utilizadorID: currentUser.id,
      dataVenda: new Date().toISOString().slice(0, 19).replace('T', ' '),
      totalLiquido: this.totalLiquido
    };

    try {
      // 1) Cria o cabeçalho da venda
      const createdSale = await this.saleService.create(sale).toPromise();
      const vendaId = createdSale!.id!;

      // 2) Cria cada item da venda associado ao vendaID devolvido
      for (const item of this.cart) {
        await this.itemSaleService.create({
          vendaID: vendaId,
          produtoID: item.produtoID,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario
        }).toPromise();
      }

      // 3) Atualiza o stock de cada produto vendido
      for (const item of this.cart) {
        const product = this.products.find((p) => p.id === item.produtoID);
        if (!product) continue;

        const produtoAtualizado: Product = {
          ...product,
          stockAtual: product.stockAtual - item.quantidade
        };
        await this.productService.update(product.id!, produtoAtualizado).toPromise();
      }

      this.successMessage = `Venda #${vendaId} registada com sucesso!`;
      this.cart = [];
      this.selectedCustomerId = null;
      this.loadProducts(); // Atualiza o stock exibido
    } catch (err) {
      console.error('Erro ao finalizar venda:', err);
      this.errorMessage = 'Ocorreu um erro ao finalizar a venda. Verifica a consola — a venda pode ter ficado parcialmente registada.';
    } finally {
      this.isSaving = false;
    }
  }
}
