import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { TacheService } from '../../../core/services/tache.service';
import { StatusTache, Tache } from '../../../data/tache.model';

@Component({
  selector: 'app-update-status',
  standalone: true,
  imports: [CommonModule,FormsModule,    NgxDatatableModule,
        LucideAngularModule],
  templateUrl: './update-status.component.html',
  styleUrl: './update-status.component.scss',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
  
})
export class UpdateStatusComponent implements OnInit {
  taches: Tache[] = [];
  isLoading: boolean = true;
  selectedTaskDetails?: Tache;
  showDetailsModal = false;
  StatusTache = StatusTache;
  public Object = Object; 
  public statuses = Object.values(StatusTache); 
  // statusOptions: string[] = Object.values(StatusTache); 
  columns = [
    { name: 'Title', prop: 'title' },
    { name: 'Status', prop: 'statusTache' },
    { name: 'Complexity', prop: 'complexite' },
    { name: 'Start Date', prop: 'dateDebut' },
    { name: 'End Date', prop: 'dateFin' },
    { name: 'Actions' }
  ];
  updatingTaskId: number | null = null;
  isUpdating: boolean = false; 
  constructor(private tacheservice:TacheService){}
  ngOnInit(): void {
    this.loadTaches(7, 11);
     }
    loadTaches(chefId: number, collaboratorId: number): void {
      this.isLoading = true;
      this.tacheservice.getAssignedTachesByChef(chefId, collaboratorId).subscribe({
        next: (data: Tache[]) => {
          this.taches = data;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Erreur lors du chargement des tâches', err);
          this.isLoading = false;
        }
      });
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
  this.tacheservice.getTacheById(taskId).subscribe({
    next: (task: Tache) => {
      this.selectedTaskDetails = task;
      this.showDetailsModal = true;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error loading task details:', error);
      this.isLoading = false;
    }
  });
}


closeDetailsModal(): void {
  this.showDetailsModal = false;
  this.selectedTaskDetails = undefined;
}
  
updateTaskStatus(taskId: number, newStatus: string): void {
  this.isUpdating = true;
  this.updatingTaskId = taskId;

  this.tacheservice.updateTacheStatus(taskId, newStatus).subscribe({
    next: (updatedTask: Tache) => {
      // Mettre à jour la tâche dans la liste locale
      const index = this.taches.findIndex(t => t.id === taskId);
      if (index !== -1) {
        this.taches[index] = updatedTask;
      }

      // Recharger la liste des tâches
      this.loadTaches(7, 11); // Rechargez les tâches avec les mêmes paramètres

      this.isUpdating = false;
      this.updatingTaskId = null;
      console.log('Task status updated successfully', updatedTask);
    },
    error: (error) => {
      this.isUpdating = false;
      this.updatingTaskId = null;
      console.error('Failed to update task status', error);
    }
  });
}
  
}
