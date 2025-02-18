import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Reclamation } from '../../../data/reclamation';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { NGXPagination } from '../../../Component/pagination';
import { MDModalModule } from '../../../Component/modals';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-reclamation',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, NgxDatatableModule, LucideAngularModule, NGXPagination, MDModalModule, FlatpickrModule, RouterLink],
  templateUrl: './list-reclamation.component.html',
  styleUrl: './list-reclamation.component.scss',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]

})
export class ListReclamationComponent {
  reclamations:Reclamation[]=[];
  allReclamations: Reclamation[] = [];
  
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: any;
  constructor(private reclamationService: ReclamationService) {}

  ngOnInit() {
    this.loadReclamations();
  }
  
  loadReclamations() {
    this.reclamationService.getAllClaims().subscribe({
      next: (data) => {
        this.reclamations = data;
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
    this.endIndex = this.startIndex + this.itemsPerPage;
    this.reclamations = this.allReclamations.slice(this.startIndex, this.endIndex);
  }
  
  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Title', prop: 'title' },
    { name: 'Description', prop: 'description' },
    { name: 'Action', prop: 'action' }
  ];
}
