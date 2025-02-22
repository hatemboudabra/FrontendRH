import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { CountUpModule } from 'ngx-countup';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { NGXPagination } from '../../../Component/pagination';
import { RouterModule } from '@angular/router';
import { Demande, Status,Type } from '../../../data/demande';
import { DemandeService } from '../../../core/services/demande.service';
import { User } from '../../../store/Authentication/auth.models';
import { AuthenticationService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-demande-manager',
  standalone: true,
  imports: [CommonModule,FormsModule, PageTitleComponent, CountUpModule, NgxDatatableModule, LucideAngularModule, NGXPagination, RouterModule],
  templateUrl: './demande-manager.component.html',
  styleUrl: './demande-manager.component.scss',
    providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
  
})
export class DemandeManagerComponent {
 demandes: Demande[] = [];
  allDemandes: Demande[] = [];
  Type = Type;
  Status = Status;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: any;
  currentUser: User | null = null;
  constructor(private demandeService: DemandeService,
    private authService: AuthenticationService
  ) {}

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
          this.loadDemandes(userDetails.id); // Charger les demandes avec l'ID de l'utilisateur
        } else {
          console.error('❌ Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors de la récupération des données utilisateur :', error);
      },
    });
  }

  loadDemandes(userId: number): void {
    this.demandeService.getDemandeChef().subscribe({
      next: (data) => {
        this.demandes = data;
        this.allDemandes = data;
        this.totalItems = this.demandes.length;
        this.updatePagedOrders();
      },
      error: (error) => {
        console.error('Error loading demandes:', error);
      }
    });
  }

  getStatusCount(status: Status): number {
    return this.allDemandes.filter(d => d.status === status).length;
  }

  getStatusClass(status: Status): string {
    switch (status) {
      case Status.APPROVED:
        return 'bg-green-100 text-green-500 dark:bg-green-500/20';
      case Status.REJECTED:
        return 'bg-red-100 text-red-500 dark:bg-red-500/20';
      case Status.PENDING:
        return 'bg-yellow-100 text-yellow-500 dark:bg-yellow-500/20';
      default:
        return '';
    }
  }

  getTypeName(type: Type): string {
    return Type[type];
  }
  
  getStatusName(status: Status): string {
    return Status[status]; 
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updatePagedOrders();
  }

  getEndIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
  }

  updatePagedOrders(): void {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;
    this.demandes = this.allDemandes.slice(this.startIndex, this.endIndex);
  }

  columns = [
  //  { name: '#', prop: 'id' },
    { name: 'Title', prop: 'title' },
    { name: 'Description', prop: 'description' },
    { name: 'Type', prop: 'type' },
    { name: 'Date', prop: 'date' },
    { name: 'Status', prop: 'status' },
    { name: 'Action', prop: 'actions' }
  ];
  updateStatus(id: number, newStatus: Status): void {
    this.demandeService.updateStatusChef(id, newStatus).subscribe({
      next: (updatedDemande) => {
        const index = this.allDemandes.findIndex(d => d.id === id);
        if (index !== -1) {
          this.allDemandes[index] = { ...updatedDemande }; 
          this.updatePagedOrders();
          this.ngOnInit()
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
      }
    });
  }
}
