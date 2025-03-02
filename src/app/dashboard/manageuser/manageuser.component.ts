import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ManageuserService } from './manageuser.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

/* Importar módulos de PrimeNG */
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  templateUrl: './manageuser.component.html',
  styleUrls: ['./manageuser.component.css'],
  providers: [MessageService], // ✅ Importar el servicio de notificaciones
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    PasswordModule,
    ConfirmDialogModule
  ]
})
export class ManageUserComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  showAddUserForm = false;
  showDeleteConfirm = false;
  selectedUser: any = null;
  deleteConfirmation = '';
  searchText = '';

  // ✅ Usar FormGroup con nonNullable para evitar errores con null
  addUserForm = new FormGroup({
    user: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
});


  constructor(private manageuserService: ManageuserService, private messageService: MessageService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.manageuserService.getUsers().subscribe(users => {
      this.users = (users || []).filter(user => user.user !== 'admin'); // ✅ Evitar errores con null
      this.filteredUsers = [...this.users];
    });
  }

  filterUsers() {
    this.filteredUsers = this.searchText
      ? this.users.filter(user => user.user.toLowerCase().includes(this.searchText.toLowerCase()))
      : [...this.users];
  }

  openAddUserForm() {
    this.showAddUserForm = true;
    this.addUserForm.reset();
  }

  closeAddUserForm() {
    this.showAddUserForm = false;
  }

  saveUser() {
    if (this.addUserForm.invalid) return;

    const rawPassword = this.addUserForm.value.password ?? ''; // ✅ Evitar null
    const hashedPassword = CryptoJS.SHA256(rawPassword).toString();
    const newUser = {
      user: this.addUserForm.value.user,
      password: hashedPassword,
    };

    this.manageuserService.addUser(newUser).subscribe(() => {
      this.loadUsers();
      this.showAddUserForm = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User added successfully!' });
    });
  }

  confirmDeleteUser(user: any) {
    this.selectedUser = user;
    this.showDeleteConfirm = true;
    this.deleteConfirmation = '';
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
  }

  deleteUser() {
    if (this.deleteConfirmation !== 'ELIMINAR') return;

    this.manageuserService.deleteUser(this.selectedUser.id).subscribe(() => {
      this.loadUsers();
      this.showDeleteConfirm = false;
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'User deleted successfully!' });
    });
  }
}
