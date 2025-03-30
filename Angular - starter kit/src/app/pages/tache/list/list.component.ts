import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider, icons } from 'lucide-angular';
import { TacheService } from '../../../core/services/tache.service';
import { TeamService } from '../../../core/services/team.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { User } from '../../../store/Authentication/auth.models';
import { ComplexiteTache, StatusTache, Tache } from '../../../data/tache.model';
import { NotificationService } from '../../../core/services/notification.service';
import { Notifications } from '../../../data/notif';

export interface Collaborator {
  id: number;
  name: string;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxDatatableModule, LucideAngularModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
})
export class ListComponent {
  selectedTaskDetails?: Tache;
  showDetailsModal = false;
  taches: Tache[] = [];
  isLoading = true;
  errorMessage = '';
  StatusTache = StatusTache;
  ComplexiteTache = ComplexiteTache;
  showTaskForm = false;
  newTask: Tache = this.initNewTask();
  currentUser: User | null = null;
  selectedCollaborateurId: number = 0;  
  showAssignModal = false;
  selectedTaskId: number | null = null;
  showDescModal = false;
  selectedRowDescription = '';
  collaborateurs: Collaborator[] = [];
  teamId: number | null = null;

  columns = [
    { prop: 'title', name: 'Title' },
    { prop: 'description', name: 'Description' },
    { prop: 'statusTache', name: 'Status' },
    { prop: 'complexite', name: 'Complexity' },
    { prop: 'dateDebut', name: 'Start Date' },
    { prop: 'dateFin', name: 'End Date' },
    { name: 'Assigned Collaborator ' },
    { prop: 'projet.name', name: 'Project Name' },
    { name: 'Actions' }
  ];

  constructor(
    private tacheS: TacheService,
    private teamService: TeamService,
    private authService: AuthenticationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user && user.username) {
          this.authService.getUserByUsername(user.username).subscribe({
            next: (userDetails) => {
              if (userDetails && userDetails.id) {
                this.currentUser = { ...user, id: userDetails.id };
                console.log('Current user loaded:', this.currentUser);
                this.loadTache(userDetails.id);
                this.loadTeamsByChef(userDetails.id);
              } else {
                console.error('User details invalid or ID missing.');
              }
            },
            error: (error) => {
              console.error('Error fetching user details:', error);
            }
          });
        } else {
          console.error('User not logged in or username missing.');
        }
      },
      error: (error) => {
        console.error('Error loading current user:', error);
      }
    });
  }

  loadTache(chefId: number): void {
    this.tacheS.getTachesByChef(chefId).subscribe({
      next: (data) => {
        this.taches = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load tasks. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: StatusTache): string {
    switch (status) {
      case StatusTache.ASSIGNED: return 'bg-orange-100 text-orange-500';
      case StatusTache.INPROGRESS: return 'bg-blue-100 text-blue-500';
      case StatusTache.COMPLETED: return 'bg-green-100 text-green-500';
      default: return '';
    }
  }

  getComplexityClass(complexity: ComplexiteTache): string {
    switch (complexity) {
      case ComplexiteTache.SIMPLE: return 'bg-green-100 text-green-500';
      case ComplexiteTache.INTERMEDIAIRE: return 'bg-yellow-100 text-yellow-500';
      case ComplexiteTache.AVANCEE: return 'bg-red-100 text-red-500';
      default: return '';
    }
  }

  getStatusLabel(status: StatusTache): string {
    return StatusTache[status];
  }

  getComplexityLabel(complexity: ComplexiteTache): string {
    return ComplexiteTache[complexity];
  }

  toggleTaskForm(): void {
    this.showTaskForm = !this.showTaskForm;
  }

  initNewTask(): Tache {
    return {
      title: '',
      description: '',
      statusTache: StatusTache.ASSIGNED,
      complexite: ComplexiteTache.SIMPLE,
      dateDebut: new Date(),
      dateFin: new Date(),
      userId: 0,
      projectId:0
    };
  }

  addTask(): void {
  }

  openAssignModal(taskId: number): void {
    this.selectedTaskId = taskId;
    this.showAssignModal = true;

    if (this.teamId !== null) {
      this.loadCollaborators(this.teamId);
    } else {
      console.error('Aucune équipe sélectionnée.');
    }
  }

  assignTaskToCollaborator(tacheId: number): void {
    if (!this.currentUser || !this.currentUser.id) {
      console.error('Current user ID is not available.');
      alert('Current user information is not available. Please try again.');
      return;
    }
      console.log('Selected Collaborateur ID before assignment:', this.selectedCollaborateurId);
  
    if (this.selectedCollaborateurId === 0) {
      alert('Veuillez sélectionner un collaborateur.');
      return;
    }
  
    const chefId = this.currentUser.id;
  
    this.tacheS.assignTacheToCollaborator(tacheId, chefId, this.selectedCollaborateurId).subscribe({
      next: (assignedTache) => {
        console.log('Task successfully assigned:', assignedTache);
        console.log('Selected Collaborateur ID:', this.selectedCollaborateurId); 
        const notification: Notifications = {
          message: 'Une nouvelle tâche vous a été assignée',
          type: 'info',
          userId: this.selectedCollaborateurId, 
          createdAt: new Date(Date.now())
        };
        console.log('Notification created:', notification);
        this.notificationService.addNotification(notification);
        this.closeAssignModal();
        this.selectedCollaborateurId = 0; 
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error assigning task:', error);
        alert('Failed to assign task. Please try again.');
      },
    });
  }
  
  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedTaskId = null;
  }

  openDetailsModal(taskId: number): void {
    this.isLoading = true;
    this.tacheS.getTacheById(taskId).subscribe({
      next: (task: Tache) => {
        this.selectedTaskDetails = task;
        this.showDetailsModal = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading task details:', error);
        this.errorMessage = 'Failed to load task details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedTaskDetails = undefined;
  }

  openDescriptionModal(row: any): void {
    this.selectedRowDescription = row.description;
    this.showDescModal = true;
  }

  closeDescriptionModal(): void {
    this.showDescModal = false;
  }

  loadTeamsByChef(chefId: number): void {
    this.teamService.getTeamsByChef(chefId).subscribe({
      next: (teams) => {
        if (teams && teams.length > 0) {
          this.teamId = teams[0].id;
          if (this.teamId !== null) {
            this.loadCollaborators(this.teamId);
          } else {
            console.error('ID d\'équipe invalide.');
          }
        } else {
          console.error('Aucune équipe trouvée pour ce chef.');
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des équipes :', error);
      }
    });
  }

  loadCollaborators(teamId: number): void {
    this.teamService.getCollaboratorsByTeam(teamId).subscribe({
      next: (collaborators) => {
        this.collaborateurs = collaborators.map(collaborator => ({
          id: collaborator.id,
          name: collaborator.username
        }));
      },
      error: (error) => {
        console.error('Erreur lors du chargement des collaborateurs :', error);
      }
    });
  }
}