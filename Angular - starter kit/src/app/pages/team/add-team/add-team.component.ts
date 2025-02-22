import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { TeamService } from '../../../core/services/team.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../../../store/Authentication/auth.models';

interface Collaborator {
  id: number;
  username: string;
}

@Component({
  selector: 'app-add-team',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {
  teamForm: FormGroup;
  currentUser: User | null = null;
  userId: number | null = null;
  collaborators$: Observable<Collaborator[]>;
  filteredCollaborators$: Observable<Collaborator[]>;
  searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isSubmitting = false;
  noCollaboratorsSelected = false;
  selectedCollaborators: number[] = [];
  allCollaborators: Collaborator[] = [];
  avatarColors: Map<string, string> = new Map();
  colorPalette = [
    '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b',
    '#6f42c1', '#fd7e14', '#20c9a6', '#5a5c69', '#858796'
  ];
  toastService: any;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private authService: AuthenticationService,
    private router: Router,
  ) {
    this.teamForm = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      collaboratorIds: [[], Validators.required]
    });
    
    this.collaborators$ = this.authService.getCollaboratorsUsernames().pipe(
      map(collaborators => {
        this.allCollaborators = collaborators;
        // Assigner couleurs par avateur
        collaborators.forEach(c => {
          if (!this.avatarColors.has(c.username)) {
            const randomColor = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
            this.avatarColors.set(c.username, randomColor);
          }
        });
        return collaborators;
      })
    );
    //filtrer recherche colla
    this.filteredCollaborators$ = this.searchTerm.pipe(
      switchMap(term => {
        return this.collaborators$.pipe(
          map(collaborators => {
            if (!term.trim()) return collaborators;
            
            const lowercaseTerm = term.toLowerCase();
            return collaborators.filter(c => 
              c.username.toLowerCase().includes(lowercaseTerm)
            );
          })
        );
      })
    );
  }

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
          this.toastService.error('Utilisateur non connecté ou username manquant.');
        }
      },
      error: (error) => {
        this.toastService.error('Erreur lors du chargement de l\'utilisateur');
        console.error('❌ Erreur détaillée :', error);
      },
    });
  }

  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails && userDetails.id) {
          this.userId = userDetails.id;
        } else {
          this.toastService.error('Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        this.toastService.error('Erreur lors de la récupération des données utilisateur');
        console.error('❌ Erreur détaillée :', error);
      },
    });
  }
  
  filterCollaborators(event: any): void {
    this.searchTerm.next(event.target.value);
  }
  
  getAvatarColor(username: string): string {
    return this.avatarColors.get(username) || '#4e73df';
  }
  
  getCollaboratorInitial(id: number): string {
    const collaborator = this.allCollaborators.find(c => c.id === id);
    return collaborator ? collaborator.username.charAt(0).toUpperCase() : '?';
  }

  onCollaboratorChange(event: any, collaboratorId: number): void {
    if (event.target.checked) {
      if (!this.selectedCollaborators.includes(collaboratorId)) {
        this.selectedCollaborators.push(collaboratorId);
      }
    } else {
      const index = this.selectedCollaborators.indexOf(collaboratorId);
      if (index !== -1) {
        this.selectedCollaborators.splice(index, 1);
      }
    }
    
    this.teamForm.patchValue({
      collaboratorIds: this.selectedCollaborators
    });
    
    this.noCollaboratorsSelected = this.selectedCollaborators.length === 0;
  }

  onSubmit(): void {
    if (this.selectedCollaborators.length === 0) {
      this.noCollaboratorsSelected = true;
      return;
    }
    
    if (this.teamForm.valid && this.userId) {
      this.isSubmitting = true;
      const { teamName } = this.teamForm.value;
      
      this.teamService.createTeam(this.userId, teamName, this.selectedCollaborators).subscribe({
        next: (response) => {
          this.toastService.success(`L'équipe "${teamName}" a été créée avec succès!`);
          setTimeout(() => this.router.navigate(['/teams']), 1000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.toastService.error('Erreur lors de la création de l\'équipe');
          console.error('❌ Erreur détaillée :', error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.teamForm.markAllAsTouched();
      this.toastService.error('Formulaire invalide ou ID utilisateur manquant.');
    }
  }
}