import { Component } from '@angular/core';
import { Formation } from '../../../../data/Formation';
import { FormationService } from '../../../../core/services/formation.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '../../../../shared/page-title/page-title.component';
import { FlatpickrModule } from '../../../../Component/flatpickr/flatpickr.module';
import { CompetanceService } from '../../../../core/services/competance.service';
import { CertificatService } from '../../../../core/services/certificat.service';
import { NiveauC } from '../../../../data/competance';

@Component({
  selector: 'app-addformation',
  standalone: true,
  imports: [CommonModule,PageTitleComponent,FlatpickrModule,ReactiveFormsModule, FormsModule],
  templateUrl: './addformation.component.html',
  styleUrl: './addformation.component.scss'
})
export class AddformationComponent {
  formationForm: FormGroup;
  competanceForm: FormGroup;
  certificatForm: FormGroup;
  formationId!: number;
  NiveauC = NiveauC;
  formations: Formation[] = [];
  constructor(
    private fb: FormBuilder, 
    private formationService: FormationService,
    private competanceService: CompetanceService,
    private certificatService: CertificatService
  ) {
    // Formulaire de formation
    this.formationForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required]
    });

    // Formulaire de compétence
    this.competanceForm = this.fb.group({
      nom: ['', Validators.required],
      niveauC: [NiveauC.BEGINNER, Validators.required]
    });

    // Formulaire de certificat
    this.certificatForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      url: ['', Validators.required],
      dateExpiration: ['', Validators.required]
    });
  }

  onSubmitFormation() {
    if (this.formationForm.valid) {
      const formation: Formation = {
        ...this.formationForm.value,
        userId: 10 
      };

      this.formationService.addFormation(formation).subscribe({
        next: (response) => {
          console.log('Formation ajoutée avec succès', response);
          this.formationId = response.id; // Récupération de l'ID
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de la formation', error);
        }
      });
    }
  }

  onSubmitCompetance() {
    if (this.formationId && this.competanceForm.valid) {
      const competance = {
        ...this.competanceForm.value,
        formationId: this.formationId
      };

      this.competanceService.addCompetance(competance).subscribe({
        next: (response) => console.log('Compétence ajoutée', response),
        error: (error) => console.error('Erreur lors de l\'ajout de la compétence', error)
      });
    } else {
      console.error('Ajoutez d\'abord une formation avant d\'ajouter une compétence.');
    }
  }

  onSubmitCertificat() {
    if (this.formationId && this.certificatForm.valid) {
      const certificat = {
        ...this.certificatForm.value,
        formationId: this.formationId
      };

      this.certificatService.addCertificat(certificat).subscribe({
        next: (response) => console.log('Certificat ajouté', response),
        error: (error) => console.error('Erreur lors de l\'ajout du certificat', error)
      });
    } else {
      console.error('Ajoutez d\'abord une formation avant d\'ajouter un certificat.');
    }
  }
}
