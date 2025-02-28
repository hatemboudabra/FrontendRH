import { Component } from '@angular/core';
import { TeamService } from '../../../core/services/team.service';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { NGXPagination } from '../../../Component/pagination';
import { MDModalModule } from '../../../Component/modals';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { User } from '../../../store/Authentication/auth.models';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface Collaborator {
  id: number;
  username: string;
}

@Component({
  selector: 'app-listteam',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    NgxDatatableModule,
    LucideAngularModule,
    NGXPagination,
    MDModalModule,
    FlatpickrModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './listteam.component.html',
  styleUrl: './listteam.component.scss',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
  
})
export class ListteamComponent {
  allTeams: any[] = [];
  teams: any[] = []; 
  selectedTeam: any = {
    id: null,
    name: '',
    collaboratorUsernamesToAdd: [], 
    collaboratorUsernamesToRemove: []
  };
  collaboratorsToAddInput: string = ''; 
  collaboratorsToRemoveInput: string = '';
  isEditModalOpen: boolean = false; 
  isLoading: boolean = false;
  errorMessage: string | null = null;

  allCollaborators: Collaborator[] = [];
  availableCollaborators: Collaborator[] = [];
  collaborators$: Observable<Collaborator[]>;
  filteredCollaborators$: Observable<Collaborator[]>;
  searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedCollaboratorsToAdd: Collaborator[] = [];
  isSearchFocused: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  currentUser: User | null = null;

  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Team Name', prop: 'name' },
    { name: 'Chef', prop: 'chef.username' },
    { name: 'Collaborators', prop: 'collaborators' },
    { name: 'Action', prop: 'action' }
  ];

  constructor(private teamService: TeamService, 
              private authService: AuthenticationService,
              private evaluationService: EvaluationService) {
    this.collaborators$ = this.authService.getCollaboratorsUsernames().pipe(
      map(collaborators => {
        this.allCollaborators = collaborators;
        return collaborators;
      })
    );

    this.filteredCollaborators$ = this.searchTerm.pipe(
      switchMap(term => {
        return this.collaborators$.pipe(
          map(collaborators => {
            if (!term.trim()) return []; 
            
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
          console.error(' Utilisateur non connecté ou username manquant.');
        }
      },
      error: (error) => {
        console.error(' Erreur lors du chargement de l\'utilisateur :', error);
      }
    });
  }

  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails && userDetails.id) {
          console.log(' ID utilisateur reçu :', userDetails.id);
          this.fetchAllTeams(userDetails.id); 
        } else {
          console.error(' Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
      }
    });
  }

  fetchAllTeams(chefId: number): void {
    if (chefId <= 0) {
      this.errorMessage = 'Invalid chef ID.';
      this.isLoading = false;
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = null;
    this.teamService.getTeamsByChef(chefId).subscribe({
      next: (data) => {
        this.allTeams = data;
        this.totalItems = data.length;
        this.updatePagedTeams();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch teams. Please try again later.';
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updatePagedTeams();
  }

  getEndIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
  }

  updatePagedTeams(): void {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;
    this.teams = this.allTeams.slice(this.startIndex, this.endIndex);
  }

  openEditModal(team: any): void {
    this.selectedTeam = { ...team }; 
    this.selectedCollaboratorsToAdd = [];
    this.collaboratorsToRemoveInput = '';
    
    this.updateAvailableCollaborators();
    
    this.isEditModalOpen = true; 
  }
  
  updateAvailableCollaborators(): void {
    const existingCollaboratorUsernames = this.selectedTeam.collaborators
      .map((c: any) => c.username);
    
    this.availableCollaborators = this.allCollaborators.filter(
      collaborator => !existingCollaboratorUsernames.includes(collaborator.username)
    );
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedTeam = null;
    this.selectedCollaboratorsToAdd = [];
  }

  filterCollaborators(event: any): void {
    this.searchTerm.next(event.target.value);
  }

  onSearchFocus(): void {
    this.isSearchFocused = true;
  }

  onSearchBlur(): void {
    setTimeout(() => {
      this.isSearchFocused = false;
    }, 200);
  }

  onCollaboratorSelect(collaborator: Collaborator): void {
    // if colla exist
    const isAlreadySelected = this.selectedCollaboratorsToAdd
      .some(c => c.id === collaborator.id);
    
    if (!isAlreadySelected) {
      this.selectedCollaboratorsToAdd.push(collaborator);
    }
    
    this.searchTerm.next('');
  }

  removeSelectedCollaborator(collaborator: Collaborator): void {
    this.selectedCollaboratorsToAdd = this.selectedCollaboratorsToAdd
      .filter(c => c.id !== collaborator.id);
  }

  updateTeam(): void {
    if (this.selectedTeam && this.currentUser) {
      const chefId = this.currentUser.id || 0;
  // affiche username du colla
      const collaboratorUsernamesToAdd = this.selectedCollaboratorsToAdd
        .map(collaborator => collaborator.username);
  
      const collaboratorUsernamesToRemove = this.collaboratorsToRemoveInput
        .split(',')
        .map(username => username.trim())
        .filter(username => username.length > 0);
  
      this.teamService.updateTeam(
        this.selectedTeam.id,
        this.selectedTeam.name,
        collaboratorUsernamesToAdd,
        collaboratorUsernamesToRemove
      ).subscribe({
        next: (response) => {
          console.log('Team updated successfully', response);
          this.fetchAllTeams(chefId); 
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Failed to update team', error);
        }
      });
    } else {
      console.error('Current user or selected team is not defined.');
    }
  }

  removeCollaborator(username: string): void {
    this.selectedTeam.collaborators = this.selectedTeam.collaborators.filter((collaborator: any) => collaborator.username !== username);
    this.collaboratorsToRemoveInput = this.collaboratorsToRemoveInput ? `${this.collaboratorsToRemoveInput},${username}` : `${username}`;
  }

  evaluateCollaborator(collaboratorId: number): void {
    if (!this.currentUser || !this.currentUser.id) {
      console.error('Current user or user ID is not defined.');
      return;
    }

    const chefId = this.currentUser.id;

    this.evaluationService.evaluateUser(chefId, collaboratorId).subscribe({
      next: (response) => {
        console.log('Collaborator evaluated successfully', response);
        alert('Collaborator evaluated successfully!');
      },
      error: (error) => {
        console.error('Failed to evaluate collaborator', error);
        alert('Failed to evaluate collaborator. Please try again.');
      }
    });
  }
}