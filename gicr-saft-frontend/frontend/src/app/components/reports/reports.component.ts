import { Component, OnInit } from '@angular/core';
import { Sale } from '../../models/sale.model';
import { ItemSale } from '../../models/item-sale.model';
import { Customer } from '../../models/customer.model';
import { Product } from '../../models/product.model';
import { SaleService } from '../../services/sale.service';
import { ItemSaleService } from '../../services/item-sale.service';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';
import { SaftReportService } from '../../services/saft-report.service';

/**
 * Componente de Relatórios — gera o Relatório SAF-T (simplificado) em PDF
 * para um intervalo de datas, cruzando Vendas + Itens de Venda + Clientes
 * + Produtos.
 *
 * O back-end não tem um endpoint de relatório dedicado, por isso o
 * filtro por período é feito aqui no front-end, depois de carregar
 * /Vendas e /ItensVenda por completo. Para grandes volumes de dados,
 * o ideal seria criar um endpoint GET /Vendas?inicio=&fim= no back-end.
 */
@Component({
  selector: 'app-reports',
  standalone: false,
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  empresaNome = 'A Minha Empresa, Lda.';
  empresaNIF = '5000000000';

  dataInicio = '';
  dataFim = '';

  allSales: Sale[] = [];
  allItems: ItemSale[] = [];
  customers: Customer[] = [];
  products: Product[] = [];

  filteredSales: Sale[] = [];

  isLoading = false;
  errorMessage = '';

  constructor(
    private saleService: SaleService,
    private itemSaleService: ItemSaleService,
    private customerService: CustomerService,
    private productService: ProductService,
    private saftReportService: SaftReportService
  ) {}

  ngOnInit(): void {
    // Por omissão, filtra o mês corrente
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    this.dataInicio = primeiroDia.toISOString().slice(0, 10);
    this.dataFim = hoje.toISOString().slice(0, 10);

    this.carregarDados();
  }

  carregarDados(): void {
    this.isLoading = true;
    this.errorMessage = '';

    Promise.all([
      this.saleService.getAll().toPromise(),
      this.itemSaleService.getAll().toPromise(),
      this.customerService.getAll().toPromise(),
      this.productService.getAll().toPromise()
    ]).then(([vendas, itens, clientes, produtos]) => {
      this.allSales = vendas ?? [];
      this.allItems = itens ?? [];
      this.customers = clientes ?? [];
      this.products = produtos ?? [];
      this.aplicarFiltro();
      this.isLoading = false;
    }).catch((err) => {
      console.error('Erro ao carregar dados para o relatório:', err);
      this.errorMessage = 'Erro ao carregar os dados. Verifica se o back-end está a correr.';
      this.isLoading = false;
    });
  }

  aplicarFiltro(): void {
    if (!this.dataInicio || !this.dataFim) {
      this.filteredSales = [...this.allSales];
      return;
    }

    const inicio = new Date(this.dataInicio + 'T00:00:00');
    const fim = new Date(this.dataFim + 'T23:59:59');

    this.filteredSales = this.allSales.filter((v) => {
      const data = new Date(v.dataVenda);
      return data >= inicio && data <= fim;
    });
  }

  get totalBruto(): number {
    return this.filteredSales.reduce((sum, v) => sum + Number(v.totalVenda), 0);
  }

  get totalIVA(): number {
    return this.filteredSales.reduce((sum, v) => sum + Number(v.valorIVA), 0);
  }

  get totalLiquido(): number {
    return this.filteredSales.reduce((sum, v) => sum + Number(v.totalLiquido), 0);
  }

  getCustomerName(clienteID: number): string {
    const c = this.customers.find((cl) => cl.id === clienteID);
    return c ? `${c.nome} (NIF: ${c.nif})` : `Cliente #${clienteID}`;
  }

  gerarPDF(): void {
    if (this.filteredSales.length === 0) {
      this.errorMessage = 'Não existem vendas no período selecionado.';
      return;
    }

    const vendaIds = new Set(this.filteredSales.map((v) => v.id));
    const itensDoPeriodo = this.allItems.filter((it) => vendaIds.has(it.vendaID));

    this.saftReportService.gerarRelatorio({
      periodoInicio: this.dataInicio,
      periodoFim: this.dataFim,
      empresaNome: this.empresaNome,
      empresaNIF: this.empresaNIF,
      vendas: this.filteredSales,
      itens: itensDoPeriodo,
      clientes: this.customers,
      produtos: this.products
    });
  }
}
