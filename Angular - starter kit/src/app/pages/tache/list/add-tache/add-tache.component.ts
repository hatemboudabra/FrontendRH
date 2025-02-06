import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { Tache } from '../../../../data/tache.model';
import { TacheService } from '../../../../core/services/tache.service';

@Component({
  selector: 'app-add-tache',
  standalone: true,
  imports: [CommonModule,FormsModule,    NgxDatatableModule,
        LucideAngularModule,     ReactiveFormsModule
      ],
  templateUrl: './add-tache.component.html',
  styleUrl: './add-tache.component.scss',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
})
export class AddTacheComponent {
    taskForm: FormGroup;
    loading = false;
    error = '';
    tasks: Tache[] = []; 
    complexityOptions = ['SIMPLE', 'INTERMEDIAIRE', 'AVANCEE'];
    statusOptions = ['NOT_ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];
    isAddTaskModalOpen: boolean = false; 
    constructor(private router: Router, private tacheService: TacheService, private fb: FormBuilder) {
      this.taskForm = this.fb.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        dateDebut: ['', [Validators.required]],
        dateFin: ['', [Validators.required]],
        statusTache: ['NOT_ASSIGNED', [Validators.required]],
        complexite: ['AVANCEE', [Validators.required]]
      });
    }
  
    onSubmit(): void {
      if (this.taskForm.valid) {
        this.loading = true;
        const chefId = 7; 
  
        const formValue = this.taskForm.value;
        const task: Tache = {
          ...formValue,
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
            this.error = 'Failed to add task. Please try again.';
            console.error('Error adding task:', error);
          }
        });
      } else {
        this.markFormGroupTouched(this.taskForm);
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
