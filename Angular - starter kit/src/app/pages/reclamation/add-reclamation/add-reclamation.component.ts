import { Component } from '@angular/core';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-reclamation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageTitleComponent,
    FlatpickrModule
  ],  templateUrl: './add-reclamation.component.html',
  styleUrl: './add-reclamation.component.scss'
})
export class AddReclamationComponent {
  reclamation = {
    title: '',
    description: '',
    userId: 10 
  };

  constructor(private reclamationService: ReclamationService , private router:Router) {}

  onSubmit() {
    this.reclamationService.addReclamation(this.reclamation).subscribe({
      next: (response) => {
        console.log('Reclamation added successfully', response);
        this.router.navigate(['listclaimsuser'])
      },
      error: (error) => {
        console.error('Error adding reclamation', error);
      }
    });
  }
}
