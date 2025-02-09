import { Component } from '@angular/core';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { CommonModule } from '@angular/common';
import { DemandeService } from '../../../core/services/demande.service';
import { Demande } from '../../../data/demande';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adddemande',
  standalone: true,
  imports: [CommonModule,PageTitleComponent,FlatpickrModule,ReactiveFormsModule, FormsModule],
  templateUrl: './adddemande.component.html',
  styleUrl: './adddemande.component.scss'
})
export class AdddemandeComponent {
demande:Demande[]=[]
demandeForm: FormGroup;
constructor(private demandeservice:DemandeService, private fb:FormBuilder,private router:Router){
  this.demandeForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required],
    type: ['', Validators.required],
    status: ['PENDING'],
    userId: [10] 
  });
}
onSubmit() {
  if (this.demandeForm.valid) {
    const demande: Demande = this.demandeForm.value;
    this.demandeservice.addDemande(demande).subscribe({
      next: (response) => {
        console.log('Demande ajoutée avec succès', response);
        alert('Demande ajoutée avec succès !');
        this.router.navigate(['userdemande'])
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la demande', err);
        alert('Erreur lors de l\'ajout de la demande.');
      }
    });
  } else {
    alert('Veuillez remplir tous les champs obligatoires.');
  }
}
}
