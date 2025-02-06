import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { MDModalModule } from '../../../Component/modals';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { Offers } from '../../../data/Offers';
import { OffersService } from '../../../core/services/offers.service';
import { Subscription } from 'rxjs';

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
    readonly STATIC_CREATED_BY_ID = 13;
      private subscriptions: Subscription = new Subscription();
    
     constructor(
        private offersService: OffersService,
        private fb: FormBuilder,
      ) {
        this.offerForm = this.fb.group({
          title: ['', Validators.required],
          description: ['', Validators.required],
          salary: ['', [Validators.required, Validators.min(0)]],
          contractType: ['', Validators.required],
          publicationDate: ['', Validators.required],
          expirationDate: ['', Validators.required]
        });
    


}
ngOnInit(): void {
  this.loadOffers();
}

ngOnDestroy(): void {
  this.subscriptions.unsubscribe();
}

loadOffers(): void {
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