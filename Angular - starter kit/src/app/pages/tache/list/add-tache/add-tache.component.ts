import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { Tache } from '../../../../data/tache.model';
import { TacheService } from '../../../../core/services/tache.service';
import { AuthenticationService } from '../../../../core/services/auth.service';
import { User } from '../../../../store/Authentication/auth.models';
import { Project } from '../../../../data/project';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-add-tache',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    LucideAngularModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-tache.component.html',
  styleUrls: ['./add-tache.component.scss'],
  providers: [
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }
  ]
})
export class AddTacheComponent implements OnInit {
  taskForm: FormGroup;
  loading = false;
  error = '';
  tasks: Tache[] = [];
  complexityOptions = ['SIMPLE', 'INTERMEDIAIRE', 'AVANCEE'];
  statusOptions = ['NOT_ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];
  isAddTaskModalOpen: boolean = false;
  currentUser: User | null = null;
  projects: Project[] = []; 
  constructor(
    private router: Router,
    private tacheService: TacheService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private projectService: ProjectService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: ['', [Validators.required]],
      statusTache: ['NOT_ASSIGNED', [Validators.required]],
      complexite: ['AVANCEE', [Validators.required]],
      projectId: ['', [Validators.required]] ,
      projectName: [{ value: '', disabled: true }]
    });
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
          console.error('Utilisateur non connecté ou username manquant.');
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'utilisateur :', error);
      },
    });
  }
  
  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails && userDetails.id) {
          console.log('ID utilisateur reçu :', userDetails.id);
          this.currentUser = userDetails; 
          this.loadProjects(); 
        } else {
          console.error('Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
      },
    });
  }
  
  loadProjects(): void {
    if (this.currentUser && this.currentUser.id) {
      const chefId = this.currentUser.id;
      this.projectService.getProjectUserId(chefId).subscribe({
        next: (projects) => {
          this.projects = projects; 
        },
        error: (error) => {
          console.error('Erreur lors du chargement des projets :', error);
        }
      });
    } else {
      console.error('Utilisateur non connecté ou ID manquant.');
    }
  }
  onProjectIdChange(projectId: number): void {
    const selectedProject = this.projects.find(project => project.id === projectId);
    if (selectedProject) {
      this.taskForm.get('projectName')?.setValue(selectedProject.name);
    } else {
      this.taskForm.get('projectName')?.setValue('');
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid && this.currentUser && this.currentUser.id) {
      this.loading = true;
      const chefId = this.currentUser.id;

      const formValue = this.taskForm.value;
      const task: Tache = {
        ...formValue,
        userId: this.currentUser.id,
        projectId: formValue.projectId,
        dateDebut: new Date(formValue.dateDebut).toISOString(),
        dateFin: new Date(formValue.dateFin).toISOString()
      };

      this.tacheService.addTache(chefId, task).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/list-tache']);
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Échec de l\'ajout de la tâche. Veuillez réessayer.';
          console.error('Erreur lors de l\'ajout de la tâche :', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.taskForm);
      if (this.taskForm.hasError('dateInvalid')) {
        this.error = 'La date de début doit être antérieure à la date de fin.';
      } else {
        this.error = 'Veuillez remplir correctement le formulaire.';
      }
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}