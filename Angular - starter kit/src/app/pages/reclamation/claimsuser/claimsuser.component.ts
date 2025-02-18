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
  
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: any;
  constructor(private reclamationService:ReclamationService){}

  ngOnInit() {
    this.loadReclamations();
  }
  
  loadReclamations() {
    this.reclamationService.getReclamationUserId(10).subscribe({
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
