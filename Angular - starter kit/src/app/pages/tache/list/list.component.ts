import { Component } from '@angular/core';
import { ComplexiteTache, StatusTache, Tache } from '../../../data/tache.model';
import { TacheService } from '../../../core/services/tache.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { NgxDatatableModule } from '@siemens/ngx-datatable';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule,FormsModule,    NgxDatatableModule,
      LucideAngularModule,],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
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
  columns = [
    { prop: 'title', name: 'Title' },
    { prop: 'description', name: 'Description' },
    { prop: 'statusTache', name: 'Status' },
    { prop: 'complexite', name: 'Complexity' },
    { prop: 'dateDebut', name: 'Start Date' },
    { prop: 'dateFin', name: 'End Date' },
    { name: 'Assigned Collaborator' }, 
    { name: 'Actions' }
  ];

  constructor(private tacheS: TacheService ) {}

  ngOnInit(): void {
    const chefId = 7;

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
    switch(status) {
      case StatusTache.ASSIGNED: return 'bg-orange-100 text-orange-500';
      case StatusTache.INPROGRESS: return 'bg-blue-100 text-blue-500';
      case StatusTache.COMPLETED: return 'bg-green-100 text-green-500';
      default: return '';
    }
  }

  getComplexityClass(complexity: ComplexiteTache): string {
    switch(complexity) {
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
      userId: 7 
    };
  }
  

  addTask(): void {
  }
  collaborateurs = [
    { id: 11, name: 'farhat' },
    { id: 10, name: 'youusef ' }
  ];
  
  selectedCollaborateurId: number | null = null;
  showAssignModal: boolean = false;
selectedTaskId: number | null = null;

openAssignModal(taskId: number): void {
  this.selectedTaskId = taskId;
  this.showAssignModal = true;
}

closeAssignModal(): void {
  this.showAssignModal = false;
  this.selectedTaskId = null;
}

assignTaskToCollaborator(tacheId: number): void {
  if (this.selectedCollaborateurId !== null) {
    this.tacheS.assignTacheToCollaborator(tacheId, 7, this.selectedCollaborateurId).subscribe({
      next: (assignedTache) => {
        console.log('Task successfully assigned:', assignedTache);
        this.closeAssignModal();
        this.ngOnInit(); 
      },
      error: (error) => {
        console.error('Error assigning task:', error);
        alert('Failed to assign task. Please try again.'); 
      },
    });
  } else {
    alert('Please select a collaborator.'); 
  }
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

}
