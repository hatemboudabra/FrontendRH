import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { MDModalModule } from '../../../Component/modals';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { Offers } from '../../../data/Offers';
import { OffersService } from '../../../core/services/offers.service';
import { Subscription } from 'rxjs';
import { User } from '../../../store/Authentication/auth.models';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MatchingService } from '../../../core/services/matching.service';
import { CandidatService } from '../../../core/services/candidat.service';

@Component({
    selector: 'app-listoffers',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LucideAngularModule,
        MDModalModule,
        FlatpickrModule,
        FormsModule
    ],
    templateUrl: './listoffers.component.html',
    styleUrl: './listoffers.component.scss',
    providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
})
export class ListoffersComponent implements OnInit {
    offers: Offers[] = [];
    offerForm: FormGroup;
    isAddingOffer = false;
    loading = true;
    error: string | null = null;
    currentUser: User | null = null;
    
    // Match modal properties
    showMatchModal = false;
    matchResults: string = '';
    currentOfferId: number | null = null;
    isMatchLoading = false;
    matchError: string | null = null;
    allCandidates: any[] = [];
    
    // Interview modal properties
    showInterviewModal = false;
    selectedCandidate: any = null;
    interviewDate: string = '';
    interviewTime: string = '';
    meetingLink: string = '';
    isSendingEmail = false;
    emailSent = false;
    emailError: string | null = null;
    
    private subscriptions: Subscription = new Subscription();

    constructor(
        private offersService: OffersService,
        private fb: FormBuilder,
        private authService: AuthenticationService,
        private matching: MatchingService,
        private candidatService: CandidatService
    ) {
        this.offerForm = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            salary: ['', [Validators.required, Validators.min(0)]],
            contractType: ['', Validators.required],
            publicationDate: ['', Validators.required],
            expirationDate: ['', Validators.required],
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
                    console.error('User not logged in or username missing.');
                }
            },
            error: (error) => {
                console.error('Error loading user:', error);
            },
        });
    }

    getUserIdByUsername(username: string): void {
        this.authService.getUserByUsername(username).subscribe({
            next: (userDetails) => {
                if (userDetails && userDetails.id) {
                    this.currentUser = { ...this.currentUser, id: userDetails.id }; 
                    this.loadOffers(userDetails.id);
                } else {
                    console.error('Invalid user data or missing ID');
                }
            },
            error: (error) => {
                console.error('Error fetching user data:', error);
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
                    const currentDate = new Date();
                    this.offers = data.filter(offer => new Date(offer.expirationDate) > currentDate);
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
            if (new Date(newOffer.expirationDate) < new Date()) {
                this.error = 'Expiration date must be in the future.';
                return;
            }
            this.subscriptions.add(
                this.offersService.addOffer(newOffer).subscribe({
                    next: (response) => {
                        this.offers.unshift(response);
                        this.toggleAddOffer();
                    },
                    error: (err) => {
                        console.error('Error adding offer:', err);
                        this.error = 'Error adding offer. Please try again.';
                    }
                })
            );
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

    showMatchResults(offerId: number): void {
        this.currentOfferId = offerId;
        this.isMatchLoading = true;
        this.matchError = null;
        this.showMatchModal = true;
        this.allCandidates = [];

        this.matching.getFormattedMatchResults(offerId).subscribe({
            next: (results) => {
                this.matchResults = results;
                this.allCandidates = this.extractSimpleCandidates(results);
                this.isMatchLoading = false;
            },
            error: (err) => {
                this.matchError = 'Error loading match results';
                this.isMatchLoading = false;
                console.error(err);
            }
        });
    }

    closeMatchModal(): void {
        this.showMatchModal = false;
        this.matchResults = '';
        this.currentOfferId = null;
    }

private extractSimpleCandidates(results: string): any[] {
    const candidates: any[] = [];
    if (!results) return candidates;

    const pattern = /(\d+)\.\s+(.+?)\s+\(ID:\s*(\d+)\)[\s\S]*?Score global:\s*([\d.]+)%[\s\S]*?Email:\s*(.+?)\n[\s\S]*?Téléphone:\s*(\d+)/g;
    
    let match;
    while ((match = pattern.exec(results)) !== null) {
        candidates.push({
            id: parseInt(match[3]),  
            name: match[2].trim(),
            globalScore: match[4],
            email: match[5].trim(),
            phone: match[6].trim()
        });
    }

    console.log('Extracted candidates:', candidates);
    return candidates;
}



    selectCandidateForInterview(candidate: any): void {
        this.selectedCandidate = candidate;
        const today = new Date();
        this.interviewDate = today.toISOString().split('T')[0];
        this.interviewTime = '10:00';
        this.showInterviewModal = true;
    }

    closeInterviewModal(): void {
        this.showInterviewModal = false;
        this.selectedCandidate = null;
        this.interviewDate = '';
        this.interviewTime = '';
        this.meetingLink = '';
        this.emailSent = false;
        this.emailError = null;
    }

scheduleInterview(): void {
    if (!this.selectedCandidate?.id || isNaN(this.selectedCandidate.id)) {
        this.emailError = 'Invalid candidate selection - ID missing or invalid';
        return;
    }

    if (this.selectedCandidate.id === 0) {
        this.emailError = 'Cannot schedule interview - candidate ID is 0';
        return;
    }

    console.log('Scheduling interview with valid ID:', this.selectedCandidate.id);

    this.isSendingEmail = true;
    this.emailSent = false;
    this.emailError = null;

    this.candidatService.scheduleInterview(
        this.selectedCandidate.id,
        this.interviewDate,
        this.interviewTime,
        this.meetingLink
    ).subscribe({
        next: () => {
            this.isSendingEmail = false;
            this.emailSent = true;
            setTimeout(() => {
                this.closeInterviewModal();
                this.closeMatchModal();
            }, 2000);
        },
        error: (err) => {
            this.isSendingEmail = false;
            this.emailError = this.getErrorMessage(err);
            console.error('Scheduling error:', {
                error: err,
                candidate: this.selectedCandidate,
                request: {
                    date: this.interviewDate,
                    time: this.interviewTime,
                    link: this.meetingLink
                }
            });
        }
    });
}

private getErrorMessage(err: any): string {
    if (err.status === 404) {
        return 'Candidate not found. Please verify the candidate ID.';
    }
    return err.error?.message || err.message || 'Unknown error occurred during scheduling';
}
}