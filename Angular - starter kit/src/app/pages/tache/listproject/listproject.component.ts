import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { User } from '../../../store/Authentication/auth.models';
import { Project } from '../../../data/project';
import { AuthenticationService } from '../../../core/services/auth.service';
import { ProjectService } from '../../../core/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listproject',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxDatatableModule, LucideAngularModule],
  templateUrl: './listproject.component.html',
  styleUrl: './listproject.component.scss',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
  
})
export class ListprojectComponent {
  currentUser: User | null = null;
  projects:Project[]=[]
  isLoading: boolean = false; 
  showDescModal: boolean = false;
  selectedRowDescription: string = '';

  showEditModal: boolean = false;
  selectedProject: Project = {
    id: 0,
    name: '',
    description: '',
    chefId: 0
  };

  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Name', prop: 'name' },
    { name: 'Description', prop: 'description' },
    { name: 'Actions' },
  ];
constructor( private authService: AuthenticationService,private projectService:ProjectService){}



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
    },
  });
}

getUserIdByUsername(username: string): void {
  this.authService.getUserByUsername(username).subscribe({
    next: (userDetails) => {
      if (userDetails && userDetails.id) {
        console.log(' ID utilisateur reçu :', userDetails.id);
        this.getProjectsByUserId(userDetails.id);
      } else {
        console.error(' Données utilisateur invalides ou ID manquant');
      }
    },
    error: (error) => {
      console.error(' Erreur lors de la récupération des données utilisateur :', error);
    },
  });
}
getProjectsByUserId(userId: number): void {
  this.projectService.getProjectUserId(userId).subscribe({
    next: (projects) => {
      this.projects = projects;
      console.log('Projets récupérés :', this.projects);
    },
    error: (error) => {
      console.error('Erreur lors de la récupération des projets :', error);
    },
  });
}
openAddProjectModal(): void {
  console.log('Ouvrir la modale d\'ajout de projet');
}

openDescriptionModal(row: Project): void {
  this.selectedRowDescription = row.description; 
  this.showDescModal = true; 
}
closeDescriptionModal(): void {
  this.showDescModal = false; 
  this.selectedRowDescription = ''; 
}



openDetailsModal(projectId: number): void {
  console.log('Ouvrir la modale de détails du projet', projectId);
}

deleteProject(id: number): void {
  Swal.fire({
    title: 'Êtes-vous sûr?',
    text: 'Vous ne pourrez pas revenir en arrière après cette action!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer!',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.projects = this.projects.filter(project => project.id !== id);
          Swal.fire(
            'Supprimé!',
            'Le projet a été supprimé avec succès.',
            'success'
          );
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            console.error(`HTTP Error: ${error.status} - ${error.message}`);
            console.error('Full error:', error.error);
            Swal.fire(
              'Erreur!',
              `La suppression a échoué: ${error.status}`,
              'error'
            );
          } else {
            console.error('Unknown Error:', error);
            Swal.fire(
              'Erreur!',
              'Une erreur inconnue est survenue',
              'error'
            );
          }
        }
      });
    }
  });
}

openEditModal(project: Project): void {
  this.selectedProject = { ...project };
  this.showEditModal = true;
}

closeEditModal(): void {
  this.showEditModal = false;
//this.selectedProject = { id: 0, name: '', description: '' };
}
updateProject(): void {
  if (!this.selectedProject?.id) {
    alert('Sélectionnez un projet valide');
    return;
  }
  if (!this.currentUser?.username) {
    this.loadCurrentUser();
    alert('Vérification de vos permissions...');
    return;
  }
  this.isLoading = true;
  this.authService.getUserByUsername(this.currentUser.username).subscribe({
    next: (userDetails) => {
      if (!userDetails?.id) {
        this.handleUpdateError('Profil utilisateur incomplet');
        return;
      }
      const payload = {
        ...this.selectedProject,
        chefId: userDetails.id
      };
      this.projectService.updateProject(payload.id, payload).subscribe({
        next: (response) => {
          this.handleUpdateSuccess(response, payload.id);
        },
        error: (error) => this.handleUpdateError(error.message)
      });
    },
    error: (error) => this.handleUpdateError(error.message)
  });
}
private handleUpdateSuccess(response: any, projectId: number): void {
  const updatedProject = response?.id ? response : this.selectedProject;
  
  this.projects = this.projects.map(p => 
    p.id === projectId ? { ...p, ...updatedProject } : p
  );

  this.closeEditModal();
  this.isLoading = false;
  this.ngOnInit(); 
}

private handleUpdateError(message: string): void {
  console.error('Erreur:', message);
  alert('Échec de la mise à jour: ' + message);
  this.isLoading = false;
  

}

}
