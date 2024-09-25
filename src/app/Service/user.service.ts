import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
 // Assurez-vous que le modèle User est correctement importé

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Liste des utilisateurs initialisés avec des données d'exemple
  private userList = new BehaviorSubject<User[]>([
    { id: 1, name: 'Thomas Hardy', email: 'thomashardy@mail.com', address: '89 Chiaroscuro Rd, Portland, USA', phone: '(171) 555-2222' },
    { id: 2, name: 'Dominique Perrier', email: 'dominiqueperrier@mail.com', address: 'Obere Str. 57, Berlin, Germany', phone: '(313) 555-5735' },
    { id: 3, name: 'Maria Anders', email: 'mariaanders@mail.com', address: '25, rue Lauriston, Paris, France', phone: '(503) 555-9931' },
    { id: 4, name: 'Fran Wilson', email: 'franwilson@mail.com', address: 'C/ Araquil, 67, Madrid, Spain', phone: '(204) 619-5731' },
    { id: 5, name: 'Martin Blank', email: 'martinblank@mail.com', address: 'Via Monte Bianco 34, Turin, Italy', phone: '(480) 631-2097' }
  ]);

  // Récupérer la liste des utilisateurs en tant qu'Observable
  getUserList(): Observable<User[]> {
    return this.userList.asObservable();
  }

  // Ajouter un utilisateur à la liste
  addUser(user: User): void {
    const currentUsers = this.userList.getValue(); // Récupère la liste actuelle des utilisateurs
    user.id = this.generateId(); // Générer un nouvel ID pour l'utilisateur
    this.userList.next([...currentUsers, user]); // Met à jour la liste avec le nouvel utilisateur
  }

  // Mettre à jour un utilisateur existant
  updateUser(updatedUser: User): void {
    const currentUsers = this.userList.getValue();
    const updatedUsers = currentUsers.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );
    this.userList.next(updatedUsers); // Met à jour la liste avec l'utilisateur modifié
  }

  // Supprimer un utilisateur par son ID
  deleteUser(id: number): void {
    const currentUsers = this.userList.getValue();
    const filteredUsers = currentUsers.filter(user => user.id !== id);
    this.userList.next(filteredUsers); // Met à jour la liste sans l'utilisateur supprimé
  }

  // Récupérer un utilisateur par son ID
  getUserById(id: number): User | undefined {
    const currentUsers = this.userList.getValue();
    return currentUsers.find(user => user.id === id);
  }

  // Générer un nouvel ID basé sur l'ID le plus élevé dans la liste actuelle
  private generateId(): number {
    const currentUsers = this.userList.getValue();
    const maxId = currentUsers.length > 0 ? Math.max(...currentUsers.map(user => user.id)) : 0;
    return maxId + 1;
  }
}
