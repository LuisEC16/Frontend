import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageuserService } from '../manageuser/manageuser.service';
import { MessageService, ConfirmationService} from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-settings',
  templateUrl: './manageuser.component.html',
  styleUrl: './manageuser.component.css',
  providers: [MessageService, ManageuserService, ConfirmationService],
  imports: [TableModule,
    ButtonModule, 
    DialogModule, 
    Toast,
    ReactiveFormsModule,
    CommonModule,
    ConfirmDialogModule
    ]
})
export class ManageuserComponent implements OnInit {
  users: any[] = [];
  editDialog: boolean = false;
  createDialog: boolean = false;
  selectedUserId: number | null = null;

  editUserForm: FormGroup;
  createUserForm: FormGroup;

  constructor(
    private userService: ManageuserService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.editUserForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.createUserForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response.filter(user => user.is_root !== 1);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' });
      }
    });
  }

  editUser(user: any) {
    this.selectedUserId = user?.id; // ✅ Usar ?. para evitar errores de null
    this.editUserForm.reset();
    this.editDialog = true;
  }

  updateUser() {
    if (this.editUserForm.invalid) return;

    const password = this.editUserForm.value.password;

    this.userService.updateUserPassword(this.selectedUserId!, { password }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada' });
        this.editDialog = false;
        this.loadUsers();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la contraseña' });
      }
    });
  }

  confirmDeleteUser(user: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar al usuario <b>${user.name}</b>?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente' });
        this.loadUsers();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el usuario' });
      }
    });
  }

  showCreateDialog() {
    this.createUserForm.reset();
    this.createDialog = true;
  }

  createUser() {
    if (this.createUserForm.invalid) return;

    const newUser = this.createUserForm.value;

    this.userService.createUser(newUser).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente' });
        this.createDialog = false;
        this.loadUsers();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el usuario' });
      }
    });
  }
}