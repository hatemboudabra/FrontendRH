import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, icons } from 'lucide-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { MDModalModule } from '../../../Component/modals';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { NGXPagination } from '../../../Component/pagination';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    NgxDatatableModule,
    LucideAngularModule,
    NGXPagination,
    MDModalModule,
    FlatpickrModule,
    RouterLink
  ],
  templateUrl: './employees.component.html',
  styles: ``,
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
})

export class EmployeesComponent implements OnInit {
  allemployee: any[] = [];
  employes: any[] = [];
  
  isLoading: boolean = false;
  errorMessage: string | null = null;
  //currentUser: User | null = null;
   selectedEmployeeId: number | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;

  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Username', prop: 'username' },
    { name: 'Email', prop: 'email' },
    {name: 'Roles', prop:'roles'},
    { name: 'Action', prop: 'action' }
  ];

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  fetchAllUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.authService.getByRole().subscribe({
      next: (data) => {
        this.allemployee = data;
        this.totalItems = data.length;
        this.updatePagedOrders();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch users. Please try again later.';
        console.error(error);
        this.isLoading = false;
      }
    });
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
    this.employes = this.allemployee.slice(this.startIndex, this.endIndex);
  }
  exportToJasper() {
    this.authService.exportJasper().subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'employee_report.pdf'; 
        link.click();
      },
      error: (error) => {
        this.errorMessage = 'Failed to export report. Please try again later.';
        console.error(error);
      }
    });
  }

  prepareDelete(employeeId: number): void {
    this.selectedEmployeeId = employeeId;
  }
  
  deleteEmployee(): void {
    if (!this.selectedEmployeeId) {
      return;
    }
  
    this.isLoading = true;
  
    this.authService.deleteCollCHE(this.selectedEmployeeId).subscribe({
      next: () => {
        this.allemployee = this.allemployee.filter(employee => employee.id !== this.selectedEmployeeId);
        this.totalItems = this.allemployee.length;
        this.updatePagedOrders();
        
        this.selectedEmployeeId = null;
        this.isLoading = false;
        
        const modalCloseButton = document.getElementById('deleteRecord-close');
        if (modalCloseButton) {
          modalCloseButton.click();
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete employee. Please try again later.';
        console.error(error);
        this.isLoading = false;
      }
    });
  }
  
}