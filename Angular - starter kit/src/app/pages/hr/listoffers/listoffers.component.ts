import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { MDModalModule } from '../../../Component/modals';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { Offers } from '../../../data/Offers';
import { OffersService } from '../../../core/services/offers.service';
import { Subscription } from 'rxjs';
import { User } from '../../../store/Authentication/auth.models';
import { AuthenticationService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-listoffers',
  standalone: true,
  imports: [
      CommonModule,
        ReactiveFormsModule,
        LucideAngularModule,
        MDModalModule,
        FlatpickrModule,
  ],
  templateUrl: './listoffers.component.html',
  styleUrl: './listoffers.component.scss',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
  
})
export class ListoffersComponent implements OnInit  {
  offers: Offers[] = [];
    offerForm: FormGroup;
    isAddingOffer = false;
    loading = true;
    error: string | null = null;
    //readonly STATIC_CREATED_BY_ID = 13;
    currentUser: User | null = null;
    
      private subscriptions: Subscription = new Subscription();
    
     constructor(
        private offersService: OffersService,
        private fb: FormBuilder,
        private authService:AuthenticationService
      ) {
        this.offerForm = this.fb.group({
          title: ['', Validators.required],
          description: ['', Validators.required],
          salary: ['', [Validators.required, Validators.min(0)]],
          contractType: ['', Validators.required],
          publicationDate: ['', Validators.required],
          educationLevel: ['', Validators.required],
          experience: ['', [Validators.required, Validators.min(0)]]
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
    },
  });
}

getUserIdByUsername(username: string): void {
  this.authService.getUserByUsername(username).subscribe({
    next: (userDetails) => {
      if (userDetails && userDetails.id) {
        console.log('✅ ID utilisateur reçu :', userDetails.id);
        this.currentUser = { ...this.currentUser, id: userDetails.id }; // Update currentUser with ID
        this.loadOffers(userDetails.id);
      } else {
        console.error('❌ Données utilisateur invalides ou ID manquant');
      }
    },
    error: (error) => {
      console.error('❌ Erreur lors de la récupération des données utilisateur :', error);
    },
  });
}

ngOnDestroy(): void {
  this.subscriptions.unsubscribe();
}

loadOffers(userId: number): void {
  this.loading = true;
  this.subscriptions.add(
    this.offersService.getAllOffers().subscribe({
      next: (data) => {
        this.offers = data;
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

onSubmit(): void {
  if (this.offerForm.valid && this.currentUser?.id) {
    const newOffer: Offers = {
      ...this.offerForm.value,
      createdById: this.currentUser.id
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
    console.error('Form is invalid or current user ID is missing');
    if (!this.offerForm.valid) {
      console.log('Form validation errors:', this.offerForm.errors);
      console.log('Form control errors:');
      Object.keys(this.offerForm.controls).forEach(key => {
        const controlErrors = this.offerForm.get(key)?.errors;
        if (controlErrors) {
          console.log(`Control: ${key}, Errors:`, controlErrors);
        }
      });
    }
    if (!this.currentUser?.id) {
      console.error('Current user ID is missing:', this.currentUser);
    }
  }
}

formatDate(date: Date): string {
  return new Date(date).toLocaleDateString();
}
deleteOffer(id: number): void {
  if (confirm('Are you sure you want to delete this offer?')) {
    this.loading = true;
    this.subscriptions.add(
      this.offersService.deleteOffer(id).subscribe({
        next: () => {
          this.offers = this.offers.filter(offer => offer.id !== id); 
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error deleting offer. Please try again later.';
          this.loading = false;
        }
      })
    );
  }
}

}