import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { LucideAngularModule } from 'lucide-angular';
import { NGXPagination } from '../../../Component/pagination';
import { MDModalModule } from '../../../Component/modals';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../../store/Authentication/auth.models';
import { TeamService } from '../../../core/services/team.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { EvaluationService } from '../../../core/services/evaluation.service';

@Component({
  selector: 'app-listtemcollaboeateur',
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
  templateUrl: './listtemcollaboeateur.component.html',
  styleUrls: ['./listtemcollaboeateur.component.scss'],
})
export class ListtemcollaboeateurComponent implements OnInit {
  allTeams: any[] = [];
  teams: any[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalItems: number = 0;
  currentUser: User | null = null;
  collaboratorNote: number | null = null;
  currentUserId: number | null = null;
  columns = [
    { name: 'ID', prop: 'teamId' },
    { name: 'Nom', prop: 'teamName' },
    { name: 'TeamManager', prop: 'chefUsername' },
    { name: 'Note', prop: 'note' },
    { name: 'Action', prop: 'action' }
  ];

  constructor(
    private teamService: TeamService,
    private authService: AuthenticationService,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user?.username) {
          this.currentUser = user;
          this.getUserIdByUsername(user.username);
        } else {
          console.error('Utilisateur non connecté ou username manquant.');
          this.errorMessage = 'Utilisateur non connecté.';
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'utilisateur :', error);
        this.errorMessage = 'Erreur lors du chargement de l\'utilisateur.';
      }
    });
  }

  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails?.id) {
          console.log('ID utilisateur reçu :', userDetails.id);
          this.currentUserId = userDetails.id;
          this.fetchTeams(userDetails.id); 
        } else {
          this.errorMessage = 'Données utilisateur invalides.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des données utilisateur.';
      }
    });
  }

  fetchTeams(collaboratorId: number): void {
    this.isLoading = true;
    this.teamService.getTeamByCollaboratorId(collaboratorId).subscribe({
        next: (data) => {
            console.log("Données reçues :", data);
            if (Array.isArray(data)) {
                this.allTeams = data;
                if (this.allTeams.length === 0) {
                    this.errorMessage = "Vous ne faites partie d'aucune équipe.";
                } else {
                    this.errorMessage = null;
                }
            } else if (typeof data === 'object' && data !== null) {
                this.allTeams = [data];
                this.errorMessage = null;
            } else {
                console.error("Données invalides :", data);
                this.errorMessage = "Les données reçues ne sont pas valides.";
                this.allTeams = [];
            }
            this.evaluationService.getCollaboratorEvaluationNote(collaboratorId).subscribe({
                next: (note) => {
                    this.collaboratorNote = parseInt(note, 10);
                },
                error: (error) => {
                    console.error('Erreur lors de la récupération de la note :', error);
                    this.collaboratorNote = null;
                },
            });
            this.totalItems = this.allTeams.length;
            this.teams = this.allTeams.slice(0, this.itemsPerPage);
            this.isLoading = false;
        },
        error: (error) => {
            this.errorMessage = "Impossible de charger les équipes.";
            console.error("Erreur :", error);
            this.isLoading = false;
        }
    });
}

  onPageChange(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    this.teams = this.allTeams.slice(startIndex, startIndex + this.itemsPerPage);
  }

  leaveTeam(teamId: number): void {
    console.log('leaveTeam called with teamId:', teamId);
    console.log('currentUserId:', this.currentUserId);

    if (!this.currentUserId) {
      console.error('Utilisateur non connecté ou ID manquant.');
      this.errorMessage = 'Utilisateur non connecté.';
      return;
    }

    const confirmation = window.confirm('Êtes-vous sûr de vouloir quitter cette équipe ?');
    if (!confirmation) {
      return;
    }

    const collaboratorId = this.currentUserId;
    console.log('collaboratorId:', collaboratorId);

    this.isLoading = true;
    this.teamService.leaveTeam(teamId, collaboratorId).subscribe({
      next: (response) => {
        console.log('Vous avez quitté l\'équipe avec succès:', response);
        this.errorMessage = null;
        this.fetchTeams(collaboratorId);
      },
      error: (error) => {
        console.error('Erreur lors de la tentative de quitter l\'équipe:', error.message);
        this.errorMessage = error.message || 'Erreur lors de la tentative de quitter l\'équipe.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}