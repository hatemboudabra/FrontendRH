import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../store/Authentication/auth.models';
import { AuthenticationService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
})
export class UpdateProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm!: FormGroup; 
  userId: number | null = null;

  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder 
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.initializeForm(); 
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required], 
      post: [''],
    });
  }

  loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user && user.username) {
          this.currentUser = user;
          this.getUserIdByUsername(user.username);
        } else {
          console.error('Utilisateur non connecté ou username manquant.');
        }
      },
      error: (error) => {
        console.error(' Erreur lors du chargement de l\'utilisateur :', error);
      },
    });
  }

  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails && userDetails.id) {
          console.log(' ID utilisateur reçu :', userDetails.id);
          this.userId = userDetails.id; 
          this.loadProfile(userDetails.id);
        } else {
          console.error(' Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error(' Erreur lors de la récupération des données utilisateur :', error);
      },
    });
  }

  loadProfile(userId: number): void {
    if (!this.currentUser || !this.currentUser.username) {
      console.error(' Utilisateur non défini ou username manquant.');
      return;
    }
  
    this.authService.getUserByUsername(this.currentUser.username).subscribe({
      next: (userDetails) => {
        if (userDetails) {
          this.profileForm.patchValue({
            username: userDetails.username,
            email: userDetails.email,
            post: userDetails.post,
          });
        }
      },
      error: (error) => {
        console.error(' Erreur lors du chargement du profil :', error);
      },
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.userId) {
      console.error(' Formulaire invalide ou ID utilisateur manquant.');
      return;
    }

    const userDTO = this.profileForm.value;
    this.authService.updateProfile(this.userId, userDTO).subscribe({
      next: (updatedUser) => {
        console.log('Profil mis à jour avec succès :', updatedUser);
        alert('Profil mis à jour avec succès !');
      },
      error: (error) => {
        console.error(' Erreur lors de la mise à jour du profil :', error);
        alert('Erreur lors de la mise à jour du profil.');
      },
    });
  }
}