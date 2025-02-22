import { Component } from '@angular/core';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../store/Authentication/auth.models';
import { AuthenticationService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-add-reclamation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageTitleComponent,
    FlatpickrModule
  ],  templateUrl: './add-reclamation.component.html',
  styleUrl: './add-reclamation.component.scss'
})
export class AddReclamationComponent {
  reclamation = {
    title: '',
    description: '',
    userId: 0,
  };

  currentUser: User | null = null; 

  constructor(
    private reclamationService: ReclamationService,
    private router: Router,
    private authService: AuthenticationService 
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user && user.username) {
          this.currentUser = user;
          this.getUserIdByUsername(user.username); 
        } else {
          console.error('❌ Utilisateur non connecté ou username manquant.');
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement de l\'utilisateur :', error);
      },
    });
  }

  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails && userDetails.id) {
          console.log('✅ ID utilisateur reçu :', userDetails.id);
          this.reclamation.userId = userDetails.id.toString(); 
        } else {
          console.error('❌ Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors de la récupération des données utilisateur :', error);
      },
    });
  }

  onSubmit() {
    if (!this.reclamation.userId) {
      console.error('❌ ID utilisateur manquant.');
      alert('Erreur : ID utilisateur manquant.');
      return;
    }

    this.reclamationService.addReclamation(this.reclamation).subscribe({
      next: (response) => {
        console.log('Reclamation added successfully', response);
        this.router.navigate(['listclaimsuser']);
      },
      error: (error) => {
        console.error('Error adding reclamation', error);
      },
    });
  }
}
