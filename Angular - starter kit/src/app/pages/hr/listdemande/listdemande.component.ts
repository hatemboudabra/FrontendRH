import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { CountUpModule } from 'ngx-countup';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { NGXPagination } from '../../../Component/pagination';
import { RouterModule } from '@angular/router';
import { Demande, Status, Type } from '../../../data/demande';
import { DemandeService } from '../../../core/services/demande.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listdemande',
  standalone: true,
  imports: [CommonModule,FormsModule, PageTitleComponent, CountUpModule, NgxDatatableModule, LucideAngularModule, NGXPagination, RouterModule],
  templateUrl: './listdemande.component.html',
  styleUrl: './listdemande.component.scss',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]

})
export class ListdemandeComponent implements OnInit {
  demandes: Demande[] = [];
  allDemandes: Demande[] = [];
  Type = Type;
  Status = Status;

  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: any;

  constructor(private demandeService: DemandeService) {}

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes(): void {
    this.demandeService.getDemandeHR().subscribe({
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
    this.demandeService.updateStatus(id, newStatus).subscribe({
      next: (updatedDemande) => {
        const index = this.allDemandes.findIndex(d => d.id === id);
        if (index !== -1) {
          this.allDemandes[index] = updatedDemande;
          this.updatePagedOrders();
        }
      },
      error: (error) => {
        console.error('Error updating status:', error);
      }
    });
  }
}
