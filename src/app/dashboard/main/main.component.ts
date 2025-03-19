import { Component, OnInit } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TransactionsService } from '../transactions/transactions.service';
import { CourseService } from '../course/course.service';

@Component({
  selector: 'app-main',
  imports: [ListboxModule,
    ChartModule,
    TableModule,
    CommonModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  totalCompletedTransactions: number = 0;
  totalCancelledCourses: number = 0;
  totalRTBCStatus: number = 0;
  data: any;
  options: any;

  constructor(private transactionsService: TransactionsService,
    private courseService: CourseService) {}

  ngOnInit(): void {
    // Obtener el total de transacciones completadas
    this.transactionsService.getTotalCompletedTransactions().subscribe((total: number) => {
      this.totalCompletedTransactions = total;
    });

    // Obtener el total de cursos cancelados
    this.courseService.getCancelledCourses().subscribe((courses: any[]) => {
      this.totalCancelledCourses = courses.filter(course => course.status === 'cancelled').length;
    });
    
    this.transactionsService.getTransactions().subscribe((transactions: any[]) => {
      this.totalRTBCStatus = transactions.filter(tx => tx.status === 'Listo para ser verificado').length;
    });

  // Obtener las transacciones y agruparlas por mes
  this.transactionsService.getTransactions().subscribe((transactions: any[]) => {
    const currentYear = new Date().getFullYear(); // Obtén el año actual
    const transactionsByMonth = this.groupTransactionsByMonth(transactions, currentYear); // Pasa el año actual

    // Prepara los datos para el gráfico
    this.data = {
      labels: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      datasets: [
        {
          label: 'Volumen de Transacciones',
          backgroundColor: '#42A5F5',
          data: transactionsByMonth,
        },
      ],
    };

    // Configura las opciones del gráfico
    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  });
}
  // Agrupa las transacciones por mes
  private groupTransactionsByMonth(transactions: any[], year: number): number[] {
    const transactionsByMonth = new Array(12).fill(0); // Inicializa un arreglo para 12 meses
  
    transactions.forEach((tx) => {
      const txYear = new Date(tx.createdAt).getFullYear(); // Obtiene el año de la transacción
      if (txYear === year) { // Filtra por año
        const month = new Date(tx.createdAt).getMonth(); // Obtiene el mes (0 = Enero, 11 = Diciembre)
        transactionsByMonth[month] += tx.amount; // Suma el monto al mes correspondiente
      }
    });
  
    return transactionsByMonth;
}
teamMembers = [
  { name: 'Mahid Ahmed', role: 'Project Manager' },
  { name: 'Daniel Karl', role: 'HR Head' },
  { name: 'Elena Michel', role: 'Co-ordinator' },
  { name: 'Salina Mitso', role: 'Co-ordinator' }
];
}
