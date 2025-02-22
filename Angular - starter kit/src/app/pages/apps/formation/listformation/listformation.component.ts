import { Component } from '@angular/core';
import { Formation } from '../../../../data/Formation';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from '../../../../shared/page-title/page-title.component';
import { CountUpModule } from 'ngx-countup';
import { NgxDatatableModule, SelectionType } from '@siemens/ngx-datatable';
import { icons, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider } from 'lucide-angular';
import { NGXPagination } from '../../../../Component/pagination';
import { RouterModule } from '@angular/router';
import { FormationService } from '../../../../core/services/formation.service';
import { Competance } from '../../../../data/competance';
import { Certificat } from '../../../../data/certificat';
import { User } from '../../../../store/Authentication/auth.models';
import { AuthenticationService } from '../../../../core/services/auth.service';
interface TableColumn {
  prop: string;
  name: string;
}

@Component({
  selector: 'app-listformation',
  standalone: true,
  imports: [CommonModule,FormsModule, PageTitleComponent, CountUpModule, NgxDatatableModule, LucideAngularModule, NGXPagination, RouterModule],
  templateUrl: './listformation.component.html',
  styleUrl: './listformation.component.scss',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
  
})
export class ListformationComponent {
  public formations: Formation[] = [];
  public filteredFormations: Formation[] = [];
  public loading: boolean = true;
  public searchTerm: string = '';
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  currentUser: User | null = null;

  public columns: any[] = [
    { name: 'Formation', prop: 'nom' },
    { name: 'Description', prop: 'description' },
    { name: 'Certificats', prop: 'certificats' },
    { name: 'Compétences', prop: 'competances' },
    { name: 'Actions', prop: 'actions' }
  ];

  constructor(private formationService: FormationService ,    private authService: AuthenticationService
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
          this.loadFormations(userDetails.id); 
        } else {
          console.error('❌ Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors de la récupération des données utilisateur :', error);
      },
    });
  }

  private loadFormations(userId: number): void {
    this.formationService.getFormationByUserId(userId).subscribe({
      next: (data: Formation[]) => {
        this.formations = data;
        this.filteredFormations = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des formations:', err);
        this.loading = false;
      }
    });
  }

  public onSearch(): void {
    this.filteredFormations = this.formations.filter(formation =>
      formation.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      formation.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  public getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.formations.length);
  }

  public onPageChange(event: any): void {
    this.currentPage = event;
  }

  public getCertificateStatusClass(dateExpiration: Date): string {
    const status = this.getCertificateStatus(dateExpiration);
    const statusClasses: { [key: string]: string } = {
      'Expiré': 'bg-red-100 text-red-800',
      'Expire bientôt': 'bg-yellow-100 text-yellow-800',
      'Actif': 'bg-green-100 text-green-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }
  public getCertificateStatus(dateExpiration: Date): string {
    const expirationDate = new Date(dateExpiration);
    const today = new Date();
    const daysUntilExpiration = Math.floor(
      (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  
    if (daysUntilExpiration < 0) return 'Expiré';
    if (daysUntilExpiration <= 30) return 'Expire bientôt';
    return 'Actif';
  }

  public getCompetanceClass(niveauC: string): string {
    return {
      'Avancé': 'bg-blue-100 text-blue-800',
      'Intermédiaire': 'bg-yellow-100 text-yellow-800',
      'Débutant': 'bg-gray-100 text-gray-800'
    }[niveauC] || 'bg-gray-100 text-gray-800';
  }

  public editFormation(formation: Formation): void {
    console.log('Édition de la formation:', formation);
  }

  public deleteFormation(formation: Formation): void {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      console.log('Suppression de la formation:', formation);
    }
  }

  public get totalCertificates(): number {
    return this.formations.reduce((total, formation) =>
      total + (formation.certificats ? formation.certificats.length : 0), 0);
  }
  
  public get totalSkills(): number {
    return this.formations.reduce((total, formation) =>
      total + (formation.competances ? formation.competances.length : 0), 0);
  }
}
