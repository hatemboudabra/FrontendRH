import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Offers } from '../../../data/Offers';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OffersService } from '../../../core/services/offers.service';
import { CandidatService } from '../../../core/services/candidat.service';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { MDModalModule } from '../../../Component/modals';
import { NGXPagination } from '../../../Component/pagination';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Events } from '../../../data/event';
import { EventService } from '../../../core/services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    MDModalModule,
    FlatpickrModule,
    RouterModule

  ],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
})
export class OffersComponent implements OnInit {
  offers: Offers[] = [];
  events:Events[]= [];
  offerForm: FormGroup;
  isAddingOffer = false;
  loading = true;
  error: string | null = null;
 // readonly STATIC_CREATED_BY_ID = 13;
 activeTab: string = 'offers'; 
 isMobileMenuOpen: boolean = false;
  selectedOfferId: number | null = null;
  isPostulerModalOpen = false;
  postulerForm: FormGroup;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private offersService: OffersService,
    private fb: FormBuilder,
    private candidatService: CandidatService,
    private eventService:EventService
  ) {
    this.offerForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      contractType: ['', Validators.required],
      publicationDate: ['', Validators.required],
      expirationDate: ['', Validators.required]
    });

    this.postulerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      cv: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadOffers();
    this.loadEvents();
  }
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  loadEvents(): void {
    this.loading = true;
    this.subscriptions.add(
      this.eventService.getAllEvent().subscribe({
        next: (data) => {
          console.log('Événements reçus:', data);
          
          data.forEach((event, index) => {
            console.log(`Événement ${index} - endDate:`, event.endDate, 
                       'Parsed:', new Date(event.endDate));
          });
  
          const now = new Date();
          this.events = data.filter(event => {
            try {
              const endDate = new Date(event.endDate);
              const isValid = !isNaN(endDate.getTime()); //vérification si date est valide
              const isFuture = endDate >= now;
              
              if (!isValid) {
                console.warn('Date invalide pour l\'événement:', event);
              }
              
              return isValid && isFuture;
            } catch (e) {
              console.error('Erreur de traitement de l\'événement:', event, e);
              return false;
            }
          });
          
          console.log('Événements filtrés:', this.events);
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.error = 'Erreur lors du chargement des événements';
          this.loading = false;
        }
      })
    );
  }
  loadOffers(): void {
    this.loading = true;
    this.subscriptions.add(
      this.offersService.getAllOffers().subscribe({
        next: (data) => {
          const now = new Date();
          this.offers = data.filter(offer => new Date(offer.expirationDate) >= now);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error loading offers. Please try again later.';
          this.loading = false;
        }
      })
    );
  }
  

  toggleAddOffer(): void {
    this.isAddingOffer = !this.isAddingOffer;
    if (!this.isAddingOffer) {
      this.offerForm.reset();
    }
  }

 /* onSubmit(): void {
    if (this.offerForm.valid) {
      const newOffer: Offers = {
        ...this.offerForm.value,
        createdById: this.STATIC_CREATED_BY_ID
      };
  
      console.log('New Offer:', newOffer); 
      this.subscriptions.add(
        this.offersService.addOffer(newOffer).subscribe({
          next: (response) => {
            console.log('Offer added successfully:', response); 
            this.offers.unshift(response);
            this.toggleAddOffer();
          },
          error: (err) => {
            console.error('Error adding offer:', err); 
            this.error = 'Error adding offer. Please try again.';
          }
        })
      );
    } else {
      console.error('Form is invalid');
    }
  }*/

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  onPostuler(offerId: number): void {
    console.log('Offer ID selected:', offerId);
    this.selectedOfferId = offerId;
    this.isPostulerModalOpen = true;
  }

  closePostulerModal(): void {
    console.log('Fermeture du modal déclenchée');
    this.isPostulerModalOpen = false;
    this.postulerForm.reset(); 
    this.selectedOfferId = null
    
  }
  onPostulerSubmit(): void {
    if (this.postulerForm.valid) {
      if (this.selectedOfferId === null) {
        console.error('No offer selected');
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Veuillez sélectionner une offre avant de soumettre votre candidature.'
        });
        return;
      }
  
      const formData = new FormData();
      formData.append('file', this.postulerForm.get('cv')?.value);
      formData.append('nom', this.postulerForm.get('nom')?.value);
      formData.append('prenom', this.postulerForm.get('prenom')?.value);
      formData.append('email', this.postulerForm.get('email')?.value);
      formData.append('telephone', this.postulerForm.get('telephone')?.value);
      formData.append('offersId', this.selectedOfferId.toString());
  
      console.log('Form Data:', formData);
  
      this.subscriptions.add(
        this.candidatService.postuler(formData).subscribe({
          next: (response) => {
            console.log('Application submitted successfully:', response);
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Candidature enregistrée avec succès !'
            }).then(() => {
              this.closePostulerModal();
            });
          },
          error: (err) => {
            console.error('Error submitting application:', err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Erreur lors de la candidature. Veuillez réessayer.'
            });
          }
        })
      );
    } else {
      console.error('Form is invalid');
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs requis.'
      });
    }
  }
  
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.postulerForm.get('cv')?.setValue(file);
    }
  }
  
}