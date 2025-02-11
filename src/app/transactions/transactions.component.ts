import { Component, OnInit } from '@angular/core';
import { TransactionsService } from './transactions.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  filters = { date: '', status: '', method: '' };
  transactions: any[] = [];
  selectedTransaction: any = null;
  operadorId: number = 0;

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.getTransactions();
  }

  // ✅ Obtener todas las transacciones
  getTransactions() {
    this.transactionsService.getFilteredTransactions(this.filters).subscribe(data => {
      this.transactions = data;
    });
  }

  // ✅ Aplicar filtros a la lista de transacciones
  applyFilters() {
    this.getTransactions();
  }

  // ✅ Obtener detalles de una transacción específica
  getTransactionDetails(id: number) {
    this.transactionsService.getTransactionById(id).subscribe(data => {
      this.selectedTransaction = data;
    });
  }

  // ✅ Validar transacción (marcarla como revisada)
  validateTransaction(id: number, operatorId: number) {
    this.transactionsService.validateTransaction(id, operatorId).subscribe(response => {
      console.log('Transacción validada:', response);
      this.getTransactions(); // Recargar lista después de validar
    });
  }

  // ✅ Eliminar transacción (solo para auditores)
  deleteTransaction(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta transacción?')) {
      this.transactionsService.deleteTransaction(id).subscribe(response => {
        console.log('Transacción eliminada:', response);
        this.getTransactions(); // Recargar lista después de eliminar
      });
    }
  }

  // ✅ Exportar transacciones a CSV
  exportTransactions() {
    const csvContent = this.transactions.map(t =>
      `${t.id},${t.type},${t.amount},${t.status},${t.payment_method},${t.created_at}`
    ).join("\n");

    const blob = new Blob(["ID,Tipo,Monto,Estado,Método de Pago,Fecha\n" + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transacciones.csv';
    a.click();
  }
}
