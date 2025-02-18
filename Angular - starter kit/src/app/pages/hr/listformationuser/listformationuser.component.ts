import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { CountUpModule } from 'ngx-countup';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { NGXPagination } from '../../../Component/pagination';
import { RouterModule } from '@angular/router';
import { Formation } from '../../../data/Formation';
import { FormationService } from '../../../core/services/formation.service';

@Component({
  selector: 'app-listformationuser',
  standalone: true,
  imports: [CommonModule,FormsModule, PageTitleComponent, CountUpModule, NgxDatatableModule, LucideAngularModule, NGXPagination, RouterModule],
  templateUrl: './listformationuser.component.html',
  styleUrl: './listformationuser.component.scss',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
  
})
export class ListformationuserComponent {
  formations: string[] = [];
  searchTerm: string = '';
  filteredFormations: string[] = [];
  page: number = 1;
  itemsPerPage: number = 10;

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.formationService.getAllFormationsWithUsernames().subscribe({
      next: (data) => {
        this.formations = data;
        this.filteredFormations = this.formations;
      },
      error: (err) => console.error('Failed to load formations', err),
    });
  }

  onSearch(): void {
    if (this.searchTerm) {
      this.filteredFormations = this.formations.filter((formation) =>
        formation.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredFormations = this.formations;
    }
  }


}
