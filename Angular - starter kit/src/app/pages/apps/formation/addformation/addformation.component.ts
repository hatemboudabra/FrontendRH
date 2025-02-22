import { Component, OnInit } from '@angular/core';
import { Formation } from '../../../../data/Formation';
import { FormationService } from '../../../../core/services/formation.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '../../../../shared/page-title/page-title.component';
import { FlatpickrModule } from '../../../../Component/flatpickr/flatpickr.module';
import { CompetanceService } from '../../../../core/services/competance.service';
import { CertificatService } from '../../../../core/services/certificat.service';
import { NiveauC } from '../../../../data/competance';
import { User } from '../../../../store/Authentication/auth.models';
import { AuthenticationService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-addformation',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, FlatpickrModule, ReactiveFormsModule, FormsModule],
  templateUrl: './addformation.component.html',
  styleUrls: ['./addformation.component.scss']
})
export class AddformationComponent implements OnInit {
  formationForm: FormGroup;
  competanceForm: FormGroup;
  certificatForm: FormGroup;
  formationId!: number;
  NiveauC = NiveauC;
  formations: Formation[] = [];
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private formationService: FormationService,
    private competanceService: CompetanceService,
    private certificatService: CertificatService,
    private authService: AuthenticationService
  ) {
    this.formationForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.competanceForm = this.fb.group({
      nom: ['', Validators.required],
      niveauC: [NiveauC.BEGINNER, Validators.required]
    });

    this.certificatForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      url: ['', Validators.required],
      dateExpiration: ['', Validators.required]
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
          console.error('❌ Utilisateur non connecté ou username manquant.');
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement de l\'utilisateur :', error);
      }
    });
  }
  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails && userDetails.id) {
          console.log('✅ ID utilisateur reçu :', userDetails.id);
          this.currentUser = { ...this.currentUser, id: userDetails.id };
        } else {
          console.error('❌ Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors de la récupération des données utilisateur :', error);
      }
    });
  }
  onSubmitFormation(): void {
    if (this.formationForm.valid && this.currentUser?.id) {
      const formation: Formation = {
        ...this.formationForm.value,
        userId: this.currentUser.id
      };
  
      this.formationService.addFormation(formation).subscribe({
        next: (response) => {
          console.log('✅ Formation ajoutée avec succès', response);
          this.formationId = response.id;
        },
        error: (error) => {
          console.error('❌ Erreur lors de l\'ajout de la formation', error);
        }
      });
    } else {
      console.error('❌ Formulaire de formation invalide ou utilisateur non connecté.');
    }
  }

  onSubmitCompetance(): void {
    if (this.formationId && this.competanceForm.valid) {
      const competance = {
        ...this.competanceForm.value,
        formationId: this.formationId
      };

      this.competanceService.addCompetance(competance).subscribe({
        next: (response) => {
          console.log('✅ Compétence ajoutée', response);
          this.competanceForm.reset();
        },
        error: (error) => {
          console.error('❌ Erreur lors de l\'ajout de la compétence', error);
        }
      });
    } else {
      console.error('❌ Ajoutez d\'abord une formation avant d\'ajouter une compétence.');
    }
  }

  onSubmitCertificat(): void {
    if (this.formationId && this.certificatForm.valid) {
      const certificat = {
        ...this.certificatForm.value,
        formationId: this.formationId
      };

      this.certificatService.addCertificat(certificat).subscribe({
        next: (response) => {
          console.log('✅ Certificat ajouté', response);
          this.certificatForm.reset(); 
        },
        error: (error) => {
          console.error('❌ Erreur lors de l\'ajout du certificat', error);
        }
      });
    } else {
      console.error('❌ Ajoutez d\'abord une formation avant d\'ajouter un certificat.');
    }
  }
}