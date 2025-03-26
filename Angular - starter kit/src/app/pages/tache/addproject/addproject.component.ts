import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../data/project';
import { AuthenticationService } from '../../../core/services/auth.service';
import { User } from '../../../store/Authentication/auth.models';

@Component({
  selector: 'app-addproject',
  standalone: true,
  imports: [   CommonModule,
      FormsModule,
      NgxDatatableModule,
      LucideAngularModule,
      ReactiveFormsModule,],
  templateUrl: './addproject.component.html',
  styleUrl: './addproject.component.scss',
  providers: [
      { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }
    ]
})
export class AddprojectComponent {
  projectForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  currentUser: User | null = null;
  
  constructor( private fb: FormBuilder,
    private projectService: ProjectService,
        private authService: AuthenticationService,
        private router : Router
    )
    {
      this.projectForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', [Validators.required, Validators.minLength(10)]]
      });
    }
    get f() {
      return this.projectForm.controls;
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
        },
      });
    }
  
    getUserIdByUsername(username: string): void {
      this.authService.getUserByUsername(username).subscribe({
        next: (userDetails) => {
          if (userDetails && userDetails.id) {
            console.log(' ID utilisateur reçu :', userDetails.id);
            this.currentUser = userDetails;
          } else {
            console.error(' Données utilisateur invalides ou ID manquant');
          }
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des données utilisateur :', error);
        },
      });
    }


    onSubmit(): void {
      if (this.projectForm.invalid) {
        Object.keys(this.projectForm.controls).forEach(key => {
          const control = this.projectForm.get(key);
          control?.markAsTouched();
        });
        return;
      }
    
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';
    
      const chefId = this.currentUser?.id;
    
      if (!chefId) {
        this.isSubmitting = false;
        this.errorMessage = 'User ID is missing. Please log in again.';
        return;
      }
    
      const projectData: Project = {
        id: 0, 
        name: this.projectForm.value.name,
        description: this.projectForm.value.description,
        chefId: chefId 
      };
    
      this.projectService.addProject(projectData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage = 'Project created successfully!';
          this.projectForm.reset();
          this.router.navigate(['/listproject'])
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = 'Error creating project. Please try again.';
          console.error('Error adding project:', error);
        }
      });
    }
  
    resetForm(): void {
      this.projectForm.reset();
      this.errorMessage = '';
      this.successMessage = '';
    }
}
