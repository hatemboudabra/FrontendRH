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
  // statusOptions: string[] = Object.values(StatusTache); 
  columns = [
    { name: 'Title', prop: 'title' },
    { name: 'Status', prop: 'statusTache' },
    { name: 'Complexity', prop: 'complexite' },
    { name: 'Start Date', prop: 'dateDebut' },
    { name: 'End Date', prop: 'dateFin' },
    { name: 'Actions' }
  ];
  constructor(private tacheservice:TacheService){}
  ngOnInit(): void {
    this.loadTaches(27, 26);
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





  // onUpdateStatus(tacheId: number, newStatus: string): void {
  //   this.tacheservice.updateTacheStatus(tacheId, newStatus).subscribe({
  //     next: (updatedTache: Tache) => {
  //       const index = this.taches.findIndex((t) => t.id === tacheId);
  //       if (index !== -1) {
  //         this.taches[index] = updatedTache;
  //       }
  //       console.log('Statut mis à jour avec succès:', updatedTache);
  //     },
  //     error: (err: any) => {
  //       console.error('Erreur lors de la mise à jour du statut', err);
  //     },
  //   });
  // }



  
}
