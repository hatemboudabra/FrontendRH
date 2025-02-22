import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandeService } from '../../../core/services/demande.service';
import { Demande } from '../../../data/demande';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../store/Authentication/auth.models';
import { AuthenticationService } from '../../../core/services/auth.service';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';

@Component({
  selector: 'app-adddemande',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, FlatpickrModule, ReactiveFormsModule, FormsModule],
  templateUrl: './adddemande.component.html',
  styleUrls: ['./adddemande.component.scss']
})
export class AdddemandeComponent implements OnInit {
  demandeForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private demandeService: DemandeService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.demandeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      type: ['', Validators.required],
      status: ['PENDING'],
      userId: [''],
      // Champs dynamiques
      documentType: [''], // document
      nbrejour: [''], // congé
      amount: [''], // pret, avance
      loanType: [''] //pret
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      user => {
        if (user) {
          console.log("✅ Utilisateur récupéré ADD :", user);
          this.currentUser = user;

          if (user.username) {
            this.authService.getUserByUsername(user.username).subscribe(
              userDetails => {
                if (userDetails && userDetails.id) {
                  console.log("✅ ID utilisateur récupéré :", userDetails.id);
                  this.demandeForm.patchValue({ userId: userDetails.id });
                } else {
                  console.error("❌ ID utilisateur manquant dans les détails.");
                }
              },
              error => {
                console.error("❌ Erreur lors de la récupération des détails de l'utilisateur :", error);
              }
            );
          } else {
            console.warn("⚠️ Le nom d'utilisateur est manquant.");
          }
        }
      },
      error => {
        console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
      }
    );

    this.demandeForm.get('type')?.valueChanges.subscribe((type) => {
      this.updateFormControls(type);
    });
  }

  updateFormControls(type: string) {
    if (type === 'DOCUMENT') {
      this.demandeForm.get('documentType')?.setValidators([Validators.required]);
      this.demandeForm.get('nbrejour')?.clearValidators();
      this.demandeForm.get('amount')?.clearValidators();
      this.demandeForm.get('loanType')?.clearValidators();
    } else if (type === 'LEAVE') {
      this.demandeForm.get('nbrejour')?.setValidators([Validators.required]);
      this.demandeForm.get('documentType')?.clearValidators();
      this.demandeForm.get('amount')?.clearValidators();
      this.demandeForm.get('loanType')?.clearValidators();
    } else if (type === 'LOAN') {
      this.demandeForm.get('amount')?.setValidators([Validators.required]);
      this.demandeForm.get('loanType')?.setValidators([Validators.required]);
      this.demandeForm.get('documentType')?.clearValidators();
      this.demandeForm.get('nbrejour')?.clearValidators();
    } else if (type === 'ADVANCE') {
      this.demandeForm.get('amount')?.setValidators([Validators.required]);
      this.demandeForm.get('documentType')?.clearValidators();
      this.demandeForm.get('nbrejour')?.clearValidators();
      this.demandeForm.get('loanType')?.clearValidators();
    } else {
      this.demandeForm.get('documentType')?.clearValidators();
      this.demandeForm.get('nbrejour')?.clearValidators();
      this.demandeForm.get('amount')?.clearValidators();
      this.demandeForm.get('loanType')?.clearValidators();
    }

    // Mettre à jour les contrôles
    this.demandeForm.get('documentType')?.updateValueAndValidity();
    this.demandeForm.get('nbrejour')?.updateValueAndValidity();
    this.demandeForm.get('amount')?.updateValueAndValidity();
    this.demandeForm.get('loanType')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.demandeForm.valid) {
      const demande: Demande = this.demandeForm.value;

      if (!demande.userId) {
        console.error("❌ L'ID de l'utilisateur est manquant.");
        alert("Erreur : ID de l'utilisateur manquant.");
        return;
      }

      this.demandeService.addDemande(demande).subscribe({
        next: (response) => {
          console.log('Demande ajoutée avec succès', response);
          alert('Demande ajoutée avec succès !');
          this.router.navigate(['userdemande']);
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