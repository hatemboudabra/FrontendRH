import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { CountUpModule } from 'ngx-countup';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { TacheService } from '../../../core/services/tache.service';
import { StatusTache, Tache } from '../../../data/tache.model';
import { User } from '../../../store/Authentication/auth.models';
import { AuthenticationService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-update-status',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxDatatableModule, CountUpModule, LucideAngularModule],
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss'],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }],
})
export class UpdateStatusComponent implements OnInit {
  taches: Tache[] = [];
  isLoading: boolean = true;
  selectedTaskDetails?: Tache;
  showDetailsModal = false;
  StatusTache = StatusTache;
  public Object = Object;
  public statuses = Object.values(StatusTache);
  currentUser: User | null = null;

  columns = [
    { name: 'Title', prop: 'title' },
    { name: 'Status', prop: 'statusTache' },
    { name: 'Complexity', prop: 'complexite' },
    { name: 'Start Date', prop: 'dateDebut' },
    { name: 'End Date', prop: 'dateFin' },
    { name: 'Actions' },
  ];

  constructor(private tacheService: TacheService, private authService: AuthenticationService,
    private cdr: ChangeDetectorRef
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
          this.loadTaches(userDetails.id);
        } else {
          console.error('❌ Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors de la récupération des données utilisateur :', error);
      },
    });
  }

  loadTaches(collaboratorId: number): void {
    this.isLoading = true;
    this.tacheService.getTachesByCollaboratorId(collaboratorId).subscribe({
      next: (data: Tache[]) => {
        this.taches = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des tâches', err);
        this.isLoading = false;
      },
    });
  }

  getStatusCount(status: string): number {
    return this.taches.filter((t) => t.statusTache === status).length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    return status;
  }

  getComplexityClass(complexity: string): string {
    switch (complexity) {
      case 'Facile':
        return 'bg-green-100 text-green-800';
      case 'Moyen':
        return 'bg-yellow-100 text-yellow-800';
      case 'Difficile':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getComplexityLabel(complexity: string): string {
    return complexity;
  }

  openDetailsModal(taskId: number): void {
    this.isLoading = true;
    this.tacheService.getTacheById(taskId).subscribe({
      next: (task: Tache) => {
        this.selectedTaskDetails = task;
        this.showDetailsModal = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading task details:', error);
        this.isLoading = false;
      },
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedTaskDetails = undefined;
  }

  updateTaskStatus(taskId: number, newStatus: string): void {
    this.tacheService.updateTacheStatus(taskId, newStatus).subscribe({
      next: (updatedTask: Tache) => {
        const index = this.taches.findIndex((t) => t.id === taskId);
        if (index !== -1) {
          this.taches[index] = updatedTask;
        }
  
        this.cdr.detectChanges(); 
        console.log('Task status updated successfully', updatedTask);
      },
      error: (error) => {
        console.error('Failed to update task status', error);
      },
    });
  }
  
}