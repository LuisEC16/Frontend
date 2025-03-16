import { Component, OnInit } from '@angular/core';
import { TransactionsService } from './transactions.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';

type Severity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined;

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    TagModule ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  allTransactions: any[] = []; // Copia de todas las transacciones para restaurar después de filtrar

  // Opciones para el dropdown de estatus
  statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Completado', value: 'Completado' },
    { label: 'En proceso', value: 'En proceso' },
    { label: 'Rechazado', value: 'Rechazado' },
    { label: 'Listo para ser verificado', value: 'Listo para ser verificado' },
  ];

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionsService.getTransactions().subscribe((response: any[]) => {
      this.transactions = response;
      this.allTransactions = [...response]; // Guarda una copia de todas las transacciones
    });
  }

  getSeverity(status: string): Severity {
    switch (status) {
      case 'Completado':
        return 'success';
      case 'En proceso':
        return 'info';
      case 'Rechazado':
        return 'danger';
      case 'Listo para ser verificado':
        return 'warn';
      default:
        return 'secondary'; // Para 'Todos' o cualquier otro estado no definido
    }
  }

  // 1. Búsqueda por ID
  searchById(searchId: string): void {
    if (!searchId) {
      this.transactions = [...this.allTransactions]; // Restaura todas las transacciones
      return;
    }
    this.transactions = this.allTransactions.filter((tx: any) =>
      tx.id.includes(searchId) // Filtra las transacciones que contengan el ID
    );
  }

  // 2. Filtrar por estatus
  filterByStatus(status: string): void {
    if (!status) {
      this.transactions = [...this.allTransactions]; // Restaura todas las transacciones
      return;
    }
    this.transactions = this.allTransactions.filter(
      (tx: any) => tx.status === status // Filtra las transacciones por el estatus proporcionado
    );
  }

  // 3. Filtrar por monto
  filterByAmount(amount: number): void {
    if (!amount) {
      this.transactions = [...this.allTransactions]; // Restaura todas las transacciones
      return;
    }
    this.transactions = this.allTransactions.filter((tx: any) => {
      const txAmount = parseFloat(tx.amount.replace('$', '')); // Convierte el monto a número
      return txAmount === amount; // Filtra las transacciones con el monto exacto
    });
  }

  // 4. Filtrar por fecha
  filterByDate(startDate: Date, endDate: Date): void {
    if (!startDate || !endDate) {
      this.transactions = [...this.allTransactions]; // Restaura todas las transacciones
      return;
    }
    const start = startDate.getTime(); // Convierte la fecha de inicio a timestamp
    const end = endDate.getTime(); // Convierte la fecha de fin a timestamp

    this.transactions = this.allTransactions.filter((tx: any) => {
      const txDate = new Date(tx.createdAt.split(' ')[0]).getTime(); // Extrae la fecha de la transacción
      return txDate >= start && txDate <= end; // Filtra las transacciones dentro del rango
    });
  }
}