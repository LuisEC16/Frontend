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
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  filters = { date: '', status: '', method: '' };

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionsService.getTransactions().subscribe({
      next: (data) => {
        console.log("📌 Respuesta completa del servidor:", data); // 🔥 Verifica la estructura real de la respuesta
  
        // Verifica si `data.transactions` es un array
        if (data && Array.isArray(data.transactions)) {
          this.transactions = data.transactions; // ✅ Extrae correctamente el array de transacciones
          this.filteredTransactions = [...this.transactions];
          console.log("📌 Transacciones extraídas:", this.transactions);
        } else {
          console.error("❌ La API no devolvió un array de transacciones. La respuesta fue:", data);
        }
      },
      error: (err) => {
        console.error("❌ Error al obtener transacciones:", err);
      }
    });
  }
  
  
  
  

  applyFilters() {
    this.filteredTransactions = this.transactions.filter(tx => {
      const matchDate = this.filters.date ? tx.createdAt.startsWith(this.filters.date) : true;
      const matchStatus = this.filters.status ? tx.status === this.filters.status : true;
      const matchMethod = this.filters.method ? tx.paymentMethod === this.filters.method : true;
      return matchDate && matchStatus && matchMethod;
    });
  }

  exportTransactions() {
    const csvContent = [
      ["ID", "Usuario", "Curso", "Monto", "Estado", "Método de Pago", "Fecha", "Validado Por"],
      ...this.filteredTransactions.map(tx => [
        tx.id,
        `${tx.user?.firstName} ${tx.user?.lastName}`,
        tx.course?.name || 'N/A',
        tx.amount,
        tx.status,
        tx.paymentMethod,
        tx.createdAt,
        tx.validatedBy ? `${tx.validatedBy.firstName} ${tx.validatedBy.lastName}` : 'No validado'
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "transacciones_auditoria.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}