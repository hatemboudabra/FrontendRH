import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { NGXPagination } from '../../../Component/pagination';
import { RouterLink, RouterModule } from '@angular/router';
import { FormationService } from '../../../core/services/formation.service';
import { User } from '../../../store/Authentication/auth.models';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MDModalModule } from '../../../Component/modals';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { Formation } from '../../../data/Formation';
import { Competance, NiveauC } from '../../../data/competance';

@Component({
  selector: 'app-listformationuser',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, NgxDatatableModule, LucideAngularModule, NGXPagination, MDModalModule, FlatpickrModule,FormsModule],
  templateUrl: './listformationuser.component.html',
  styleUrl: './listformationuser.component.scss',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
})
export class ListformationuserComponent {
  formations: Formation[] = []; 
  filteredFormations: Formation[] = []; 
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalItems: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
 currentUser: User | null = null;
 showModal: boolean = false;
 selectedFormation: any = null;
 competenceScore: number = 0;
  columns = [
  //  { name: 'ID', prop: 'id' },
  { name: 'Username', prop: 'username' },
    { name: 'Nom', prop: 'nom' },
    { name: 'Description', prop: 'description' },
    
    {name : 'Action' , prop:'action'}
  ];

  constructor(private formationService: FormationService,
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
          console.error(' Utilisateur non connecté ou username manquant.');
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'utilisateur :', error);
      },
    });
  }

  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails && userDetails.id) {
          console.log(' ID utilisateur reçu :', userDetails.id);
          this.loadFormations(userDetails.id); 
        } else {
          console.error(' Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
      },
    });
  }

  loadFormations(userId:number): void {
    this.formationService.getAllFormatons().subscribe({
      next: (data) => {
        this.formations = data;
        this.totalItems = data.length; 
        this.updatePagedFormations(); 
      },
      error: (err) => console.error('Failed to load formations', err),
    });
  }
  calculateCompetenceScore(competences: Competance[]): number {
    let score = 0;
    competences.forEach(competence => {
      switch (competence.niveauC) {
        case NiveauC.BEGINNER:
          score += 1;
          break;
        case NiveauC.INTERMEDIATE:
          score += 2;
          break;
        case NiveauC.EXPERT:
          score += 3;
          break;
        default:
          break;
      }
    });
    return score;
  }
  openCompetenceModal(formation: Formation): void {
    console.log('Formation sélectionnée :', formation);
    console.log('Compétences de la formation :', formation.competances);
    if (formation.competances) {
      const score = this.calculateCompetenceScore(formation.competances);
      this.selectedFormation = formation;
      this.competenceScore = score;
      this.showModal = true; 
    } else {
      console.error('Aucune compétence trouvée pour cette formation.');
    }
  }
  truncateDescription(description: string, maxLength: number = 20): string {
    if (description && description.length > maxLength) {
      return description.slice(0, maxLength) + '...'; 
    }
    return description || ''; 
  }

  onSearch(): void {
    if (this.searchTerm) {
      this.filteredFormations = this.formations.filter((formation) =>
        formation.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredFormations = this.formations;
    }
    this.totalItems = this.filteredFormations.length; 
    this.updatePagedFormations();
  }

  updatePagedFormations(): void {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
    this.filteredFormations = this.formations.slice(this.startIndex, this.endIndex);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updatePagedFormations();
  }

  getEndIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
  }
  
}