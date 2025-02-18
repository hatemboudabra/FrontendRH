import { Component } from '@angular/core';
import { TeamService } from '../../../core/services/team.service';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { NGXPagination } from '../../../Component/pagination';
import { MDModalModule } from '../../../Component/modals';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listteam',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    NgxDatatableModule,
    LucideAngularModule,
    NGXPagination,
    MDModalModule,
    FlatpickrModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './listteam.component.html',
  styleUrl: './listteam.component.scss',
    providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
  
})
export class ListteamComponent {
  allTeams: any[] = [];
  teams: any[] = []; 
  selectedTeam: any = {
    id: null,
    name: '',
    collaboratorIdsToAdd: [],
    collaboratorIdsToRemove: []
  };
  collaboratorsToAddInput: string = ''; 
  collaboratorsToRemoveInput: string = ''; 
  isEditModalOpen: boolean = false; 
  isLoading: boolean = false;
  errorMessage: string | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;

  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Team Name', prop: 'name' },
    { name: 'Chef', prop: 'chef.username' },
    { name: 'Collaborators', prop: 'collaborators' },
    { name: 'Action', prop: 'action' }
  ];

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.fetchAllTeams();
  }

  fetchAllTeams(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.teamService.getTeamsByChef(7).subscribe({
      next: (data) => {
        this.allTeams = data;
        this.totalItems = data.length;
        this.updatePagedTeams();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch teams. Please try again later.';
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updatePagedTeams();
  }

  getEndIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
  }

  updatePagedTeams(): void {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;
    this.teams = this.allTeams.slice(this.startIndex, this.endIndex);
  }
  // ouvrir le formulaire de mise à jour

  openEditModal(team: any): void {
    this.selectedTeam = { ...team }; 
    this.isEditModalOpen = true; 
  }
  // fermer le formulaire de mise à jour
  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedTeam = null;
  }

 
 

  updateTeam(): void {
    if (this.selectedTeam) {
      // Convertir les chaînes de collaborateurs en tableaux
      const collaboratorIdsToAdd = this.collaboratorsToAddInput.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
      const collaboratorIdsToRemove = this.collaboratorsToRemoveInput.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));

      this.teamService.updateTeam(
        this.selectedTeam.id,
        this.selectedTeam.name,
        collaboratorIdsToAdd, 
        collaboratorIdsToRemove 
      ).subscribe({
        next: (response) => {
          console.log('Team updated successfully', response);
          this.fetchAllTeams(); 
          this.closeEditModal(); 
        },
        error: (error) => {
          console.error('Failed to update team', error);
        }
      });
    }
  }

  removeCollaborator(collaboratorId: number): void {
    this.selectedTeam.collaborators = this.selectedTeam.collaborators.filter((collaborator: any) => collaborator.id !== collaboratorId);
    this.collaboratorsToRemoveInput = this.collaboratorsToRemoveInput ? `${this.collaboratorsToRemoveInput},${collaboratorId}` : `${collaboratorId}`;
  }
}
