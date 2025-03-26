import { Component } from '@angular/core';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, icons } from 'lucide-angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import { MDModalModule } from '../../../Component/modals';
import { mailbox } from '../../../data';
import { MnDropdownComponent } from '../../../Component/dropdown';
import { CandidatService } from '../../../core/services/candidat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Offers } from '../../../data/Offers';
@Component({
  selector: 'app-email',
  standalone: true,
  imports: [PageTitleComponent, LucideAngularModule, SimplebarAngularModule, MDModalModule, MnDropdownComponent,FormsModule,CommonModule],
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
})
export class EmailComponent {
  mailbox: any[] = [];
  paginatedMailbox: any[] = [];
  currentPage: number = 1; 
  itemsPerPage: number = 5; 
  totalPages: number = 0; 
  emaillist: boolean = true;
  showEmailList: boolean = true; 
  showComposeEmail: boolean = false; 
  selectedCandidate: any = null;
  offer !: Offers;
  showDeletedCandidatesList: boolean = false; 
  deletedCandidates: any[] = []
  constructor(private candidatService: CandidatService) {}

  ngOnInit(): void {
    this.loadCandidatures();
  }

  loadCandidatures(): void {
    this.candidatService.getCandidatures().subscribe((data) => {
      console.log('Données reçues :', data);
  
      this.mailbox = data.sort((a, b) => {
        const dateA = new Date(a.datepostule).getTime();
        const dateB = new Date(b.datepostule).getTime();
        return dateB - dateA; 
      });
  
      this.totalPages = Math.ceil(this.mailbox.length / this.itemsPerPage);
      this.updatePaginatedMailbox();
    });
  }

  updatePaginatedMailbox(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMailbox = this.mailbox.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedMailbox();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedMailbox();
    }
  }
  showCandidateDetails(candidat: any): void {
    this.selectedCandidate = candidat;
    this.showEmailList = false;
    this.showComposeEmail = false;
  }

  closeCandidateDetails(): void {
    this.selectedCandidate = null;
    this.showEmailList = true;
    this.showComposeEmail = false;
  }



formatDateLikeGmail(dateString: string): string {
  if (!dateString) return 'Date inconnue'; 
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Date inconnue'; 

  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short', 
    day: 'numeric',   
    month: 'long',    
    hour: '2-digit',  
    minute: '2-digit' 
  };

  const formattedDate = date.toLocaleDateString('fr-FR', options);

  if (diffInMinutes < 60) {
    return `${formattedDate} (il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''})`;
  } else if (diffInHours < 24) {
    return `${formattedDate} (il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''})`;
  } else if (diffInDays === 1) {
    return `${formattedDate} (hier)`;
  } else if (diffInDays < 7) {
    return `${formattedDate} (il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''})`;
  } else {
    return formattedDate; 
  }
}
  showDeletedCandidates(): void {
    this.showDeletedCandidatesList = true;
    this.showEmailList = false;
    this.showComposeEmail = false;
  }

  deleteCandidate(candidat: any): void {
    this.deletedCandidates.push(candidat); 
    this.mailbox = this.mailbox.filter((c) => c !== candidat);
    this.updatePaginatedMailbox();
  }

  restoreCandidate(candidat: any): void {
    this.mailbox.push(candidat); 
    this.deletedCandidates = this.deletedCandidates.filter((c) => c !== candidat);
  }

  permanentlyDeleteCandidate(candidat: any): void {
    this.deletedCandidates = this.deletedCandidates.filter((c) => c !== candidat); 
  }


  showInbox(): void {
    this.showEmailList = true;
    this.showDeletedCandidatesList = false;
    this.selectedCandidate = null;
  }
}
