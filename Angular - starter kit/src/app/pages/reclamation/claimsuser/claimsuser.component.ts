import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { MDModalModule } from '../../../Component/modals';
import { NGXPagination } from '../../../Component/pagination';
import { RouterLink } from '@angular/router';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { Reclamation } from '../../../data/reclamation';
import { AuthenticationService } from '../../../core/services/auth.service';
import { User } from '../../../store/Authentication/auth.models';

@Component({
  selector: 'app-claimsuser',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, NgxDatatableModule, LucideAngularModule, NGXPagination, MDModalModule, FlatpickrModule, RouterLink],
  templateUrl: './claimsuser.component.html',
  styleUrl: './claimsuser.component.scss',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
  
})
export class ClaimsuserComponent {
  reclamations:Reclamation[]=[];
  allReclamations: Reclamation[] = [];
  currentUser: User | null = null;
  
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: any;
  constructor(private reclamationService:ReclamationService,
    private authService: AuthenticationService
  ){}

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
          console.error(' Utilisateur non connecté ou username manquant.');
        }
      },
      error: (error) => {
        console.error(' Erreur lors du chargement de l\'utilisateur :', error);
      },
    });
  }

  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails && userDetails.id) {
          console.log(' ID utilisateur reçu :', userDetails.id);
          this.loadReclamations(userDetails.id); 
        } else {
          console.error(' Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error(' Erreur lors de la récupération des données utilisateur :', error);
      },
    });
  }

  
  loadReclamations(userId: number) {
    this.reclamationService.getReclamationUserId(userId).subscribe({
      next: (data) => {
        this.allReclamations = data; 
        this.totalItems = data.length; 
        this.updatePagedReclamations(); 
      },
      error: (error) => {
        console.error('Error loading reclamations:', error);
      }
    });
  }
  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updatePagedReclamations();
  }
  
  getEndIndex() {
    return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
  }
  
  updatePagedReclamations(): void {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
    this.reclamations = this.allReclamations.slice(this.startIndex, this.endIndex);
  }
  
  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Title', prop: 'title' },
    { name: 'Description', prop: 'description' },
    { name: 'Action', prop: 'action' }
  ];
}
