import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { CourseService } from './course.service';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-course',
  imports: [DropdownModule,
    InputNumberModule,
    CalendarModule,
    TableModule,
    CommonModule,
    TagModule 
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit {
  courses: any[] = [];
  allCourses: any[] = []; // Copia de todas las relaciones curso-usuario para restaurar después de filtrar

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCancelledCourses().subscribe((response: any[]) => {
      this.courses = response;
      this.allCourses = [...response]; // Guarda una copia de todas las relaciones
    });
  }

  // 1. Búsqueda por ID de la relación
  searchById(searchId: string): void {
    if (!searchId) {
      this.courses = [...this.allCourses]; // Restaura todas las relaciones
      return;
    }
    this.courses = this.allCourses.filter((course: any) =>
      course.id.includes(searchId) // Filtra las relaciones que contengan el ID
    );
  }

  // 2. Búsqueda por nombre del estudiante
  searchByStudent(studentName: string): void {
    if (!studentName) {
      this.courses = [...this.allCourses]; // Restaura todas las relaciones
      return;
    }
    this.courses = this.allCourses.filter((course: any) =>
      `${course.user.firstName} ${course.user.lastName}`.toLowerCase().includes(studentName.toLowerCase())
    );
  }

  // 3. Búsqueda por nombre del curso
  searchByCourse(courseName: string): void {
    if (!courseName) {
      this.courses = [...this.allCourses]; // Restaura todas las relaciones
      return;
    }
    this.courses = this.allCourses.filter((course: any) =>
      course.course.name.toLowerCase().includes(courseName.toLowerCase())
    );
  }
}