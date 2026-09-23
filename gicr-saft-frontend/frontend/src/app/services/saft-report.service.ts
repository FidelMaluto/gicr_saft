import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Sale } from '../models/sale.model';
import { ItemSale } from '../models/item-sale.model';
import { Customer } from '../models/customer.model';
import { Product } from '../models/product.model';

/** Estrutura agregada usada para montar o relatório */
export interface SaftReportData {
  periodoInicio: string;
  periodoFim: string;
  empresaNome: string;
  empresaNIF: string;
  vendas: Sale[];
  itens: ItemSale[];
  clientes: Customer[];
  produtos: Product[];
}

/**
 * Gera um Relatório SAF-T (simplificado) em PDF, a partir dos dados de
 * vendas do período selecionado.
 *
 * IMPORTANTE: este é um relatório de auditoria em PDF para consulta
 * humana (lista de faturas, totais e IVA), inspirado na estrutura do
 * SAF-T angolano — NÃO é o ficheiro XML oficial SAF-T-AO exigido pela
 * AGT para submissão eletrónica. Gerar o XML oficial exigiria mapear
 * o schema completo definido pela Administração Geral Tributária.
 */
@Injectable({ providedIn: 'root' })
export class SaftReportService {

  gerarRelatorio(data: SaftReportData): void {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    // ---------- Cabeçalho ----------
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(data.empresaNome, 14, 15);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`NIF: ${data.empresaNIF}`, 14, 21);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório SAF-T (Simplificado) — Vendas', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Período: ${data.periodoInicio} a ${data.periodoFim}`,
      pageWidth / 2, 21, { align: 'center' }
    );

    doc.text(`Emitido em: ${new Date().toLocaleString('pt-PT')}`, pageWidth - 14, 15, { align: 'right' });

    // ---------- Totais gerais ----------
    const totalBruto = data.vendas.reduce((sum, v) => sum + Number(v.totalVenda), 0);
    const totalIVA = data.vendas.reduce((sum, v) => sum + Number(v.valorIVA), 0);
    const totalLiquido = data.vendas.reduce((sum, v) => sum + Number(v.totalLiquido), 0);

    autoTable(doc, {
      startY: 28,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [33, 37, 41] },
      head: [['Nº de Vendas', 'Total Bruto (Kz)', 'IVA 14% (Kz)', 'Total Líquido (Kz)']],
      body: [[
        String(data.vendas.length),
        totalBruto.toFixed(2),
        totalIVA.toFixed(2),
        totalLiquido.toFixed(2)
      ]]
    });

    // ---------- Tabela detalhada de vendas ----------
    const finalY1 = (doc as any).lastAutoTable.finalY + 6;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhe das Vendas', 14, finalY1);

    const vendasBody = data.vendas.map((v) => {
      const cliente = data.clientes.find((c) => c.id === v.clienteID);
      return [
        String(v.id ?? ''),
        v.dataVenda ? new Date(v.dataVenda).toLocaleString('pt-PT') : '',
        cliente ? `${cliente.nome} (NIF: ${cliente.nif})` : `Cliente #${v.clienteID}`,
        v.formaPagamento,
        Number(v.totalVenda).toFixed(2),
        Number(v.valorIVA).toFixed(2),
        Number(v.totalLiquido).toFixed(2)
      ];
    });

    autoTable(doc, {
      startY: finalY1 + 3,
      theme: 'striped',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [13, 110, 253] },
      head: [['Nº', 'Data', 'Cliente', 'Forma Pagamento', 'Total Bruto', 'IVA (14%)', 'Total Líquido']],
      body: vendasBody
    });

    // ---------- Tabela detalhada de itens (linhas de fatura) ----------
    const finalY2 = (doc as any).lastAutoTable.finalY + 6;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');

    // Nova página se não houver espaço suficiente para o título + tabela
    if (finalY2 > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      doc.text('Detalhe dos Itens Vendidos', 14, 15);
    } else {
      doc.text('Detalhe dos Itens Vendidos', 14, finalY2);
    }
    const startYItens = finalY2 > doc.internal.pageSize.getHeight() - 40 ? 20 : finalY2 + 3;

    const itensBody = data.itens.map((it) => {
      const produto = data.produtos.find((p) => p.id === it.produtoID);
      const subtotal = Number(it.quantidade) * Number(it.precoUnitario);
      return [
        String(it.vendaID ?? ''),
        produto ? produto.nome : `Produto #${it.produtoID}`,
        String(it.quantidade),
        Number(it.precoUnitario).toFixed(2),
        subtotal.toFixed(2)
      ];
    });

    autoTable(doc, {
      startY: startYItens,
      theme: 'striped',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [25, 135, 84] },
      head: [['Nº Venda', 'Produto', 'Quantidade', 'Preço Unit. (Kz)', 'Subtotal (Kz)']],
      body: itensBody
    });

    // ---------- Rodapé com numeração de página ----------
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth - 14,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'right' }
      );
    }

    const nomeFicheiro = `SAFT_Relatorio_${data.periodoInicio}_a_${data.periodoFim}.pdf`;
    doc.save(nomeFicheiro);
  }
}
