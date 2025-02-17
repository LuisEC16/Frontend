import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { ManageuserService } from './manageuser.service';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  templateUrl: './manageuser.component.html',
  styleUrls: ['./manageuser.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class ManageUserComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  showAddUserForm = false;
  searchText = '';
  selectedUser: any = null;

  addUserForm = new FormGroup({
    user: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private manageuserService: ManageuserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Cargar lista de usuarios
  loadUsers() {
    this.manageuserService.getUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  // Filtrar usuarios en la búsqueda
  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Abrir el formulario de añadir usuario
  openAddUserForm() {
    this.selectedUser = null;
    this.showAddUserForm = true;
    this.addUserForm.reset();
  }

  // Abrir el formulario de edición de usuario
  openEditUserForm(user: any) {
    this.selectedUser = user;
    this.showAddUserForm = true;
    this.addUserForm.patchValue({ user: user.name, password: '' }); // 🔹 Carga el usuario sin contraseña
  }

  // Cerrar el formulario de añadir usuario
  closeAddUserForm() {
    this.showAddUserForm = false;
  }

  // Guardar usuario
  saveUser() {
    const rawPassword = this.addUserForm.value.password ?? '';
    const hashedPassword = CryptoJS.SHA256(rawPassword).toString(); // 🔹 Cifrar en SHA-256

    const newUser = {
      user: this.addUserForm.value.user,
      password: hashedPassword
    };

    if (this.selectedUser) {
      // 🔹 Si es edición, actualizar usuario
      this.manageuserService.updateUser(this.selectedUser.id, newUser).subscribe(() => {
        this.loadUsers();
        this.closeAddUserForm();
      });
    } else {
      // 🔹 Si es nuevo, crear usuario
      this.manageuserService.addUser(newUser).subscribe(() => {
        this.loadUsers();
        this.closeAddUserForm();
      });
    }
  }
}
