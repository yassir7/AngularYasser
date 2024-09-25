import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Service/user.service'; // Assurez-vous d'importer le service à partir du bon chemin
 // Assurez-vous que le modèle User est correctement importé
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable'


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  currentUser: User = { id: 0, name: '', email: '', address: '', phone: '' };
  users: User[] = [];
  userForm: FormGroup;
  isEditMode = false;
  selectedUserId: number | null = null;
  isModalOpen = false;
  

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Explicitly define the type of 'users' as 'User[]'
    this.userService.getUserList().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  saveUser(): void {
    const user: User = this.userForm.value;
    if (this.isEditMode && this.selectedUserId !== null) {
      user.id = this.selectedUserId;
      this.userService.updateUser(user);
    } else {
      this.userService.addUser(user);
    }
    this.clearForm();
  }

  editUser(user: User): void {
    this.isEditMode = true;
    this.selectedUserId = user.id;
    this.userForm.patchValue(user);
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id);
  }

  clearForm(): void {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.userForm.reset();
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    doc.text('User List', 14, 10); // Titre du PDF

    // Configuration des données pour autoTable
    const userRows = this.users.map(user => [user.name, user.email, user.address, user.phone]);
    
    // Utilisation d'autoTable pour créer le tableau
    autoTable(doc, {
        head: [['Name', 'Email', 'Address', 'Phone']], // En-têtes de colonnes
        body: userRows, // Corps du tableau avec les données des utilisateurs
        startY: 20, // Position Y de départ pour le tableau
    });

    doc.save('user-list.pdf'); // Sauvegarde du PDF
}
  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'user-list.xlsx');
  }

  showEditUserModal(user: User): void {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.currentUser = { ...user }; // Clone user data for editing
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  showAddUserModal(): void {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.currentUser = { id: 0, name: '', email: '', address: '', phone: '' }; // Reset form
  }
  
}

