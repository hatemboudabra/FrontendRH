import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AuthenticationService } from '../../../core/services/auth.service';
import { User } from '../../../store/Authentication/auth.models';
import { TeamService } from '../../../core/services/team.service';
import { DemandeService } from '../../../core/services/demande.service';

@Component({
  selector: 'app-statistique',
  standalone: true,
  imports: [CommonModule, PageTitleComponent, NgApexchartsModule],
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.scss'],
})
export class StatistiqueComponent implements OnInit {
  currentUser: User | null = null;
  roleChartOptions: any;
  teamChartOptions: any;
  demandeChartOptions: any;

  constructor(
    private authService: AuthenticationService,
    private teamService: TeamService,
    private demandeService: DemandeService
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
          console.error('Utilisateur non connecté ou username manquant.');
        }
      },
      error: (error) => {
        console.error("Erreur lors du chargement de l'utilisateur :", error);
      },
    });
  }

  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails && userDetails.id) {
          console.log('ID utilisateur reçu :', userDetails.id);
          this.loadStats(userDetails.id);
        } else {
          console.error('Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
      },
    });
  }

  loadStats(userId: number): void {
    this.authService.getRoleCounts().subscribe(
      (data) => {
        const roleCounts = data instanceof Map ? Object.fromEntries(data.entries()) : data;
        this.initRoleChart(roleCounts);
      },
      (error) => console.error('Erreur lors de la récupération des stats par rôle', error)
    );

    this.teamService.getTeamsWithUserCount().subscribe(
      (teams) => {
        this.initTeamChart(teams);
      },
      (error) => console.error('Erreur lors de la récupération des stats des équipes', error)
    );
    
    this.demandeService.getDemandecountsbystatusavancepret().subscribe(
      (data) => {
        const arrayData = Object.entries(data).map(([status, count]) => ({ status, count }));
        this.initDemandeChart(arrayData);
      },
      (error) => console.error('Erreur lors de la récupération des stats des demandes', error)
    );
  }

  initRoleChart(roleCounts: Record<string, number>): void {
    const roles = Object.keys(roleCounts);
    const counts = Object.values(roleCounts);
    
    // Données principales
    const primaryData = counts;
    // Données secondaires (simulées pour l'effet visuel comme dans l'image)
    const secondaryData = counts.map(count => count * 1.5);
    
    this.roleChartOptions = {
      series: [
        {
          name: 'Utilisateurs',
          type: 'area',
          data: primaryData,
        },
        {
          name: 'Total',
          type: 'area',
          data: secondaryData,
        }
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true
        }
      },
      colors: ['#10b981', '#3b82f6'], // Vert et bleu comme dans l'image
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: roles,
        labels: {
          style: {
            colors: '#9ca3af',
            fontSize: '12px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9ca3af',
            fontSize: '12px'
          }
        },
        min: 0,
        max: Math.max(...secondaryData) * 1.2,
        tickAmount: 4
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (val: number) {
            return val.toString();
          }
        }
      }
    };
  }

  initTeamChart(teams: { teamName: string, userCount: number }[]): void {
    const teamNames = teams.map(team => team.teamName);
    const userCounts = teams.map(team => team.userCount);
    
    // Données principales
    const primaryData = userCounts;
    // Données secondaires (simulées pour l'effet visuel comme dans l'image)
    const secondaryData = userCounts.map(count => count * 1.3);

    this.teamChartOptions = {
      series: [
        {
          name: 'Collaborateurs',
          type: 'area',
          data: primaryData,
        },
        {
          name: 'Total',
          type: 'area',
          data: secondaryData
        }
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true
        }
      },
      colors: ['#10b981', '#3b82f6'], // Vert et bleu comme dans l'image
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: teamNames,
        labels: {
          style: {
            colors: '#9ca3af',
            fontSize: '12px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9ca3af',
            fontSize: '12px'
          }
        },
        min: 0,
        max: Math.max(...secondaryData) * 1.2,
        tickAmount: 4
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (val: number) {
            return val.toString();
          }
        }
      }
    };
  }

  initDemandeChart(demandes: { status: string, count: number }[]): void {
    const statuses = demandes.map(d => d.status);
    const counts = demandes.map(d => d.count);
    
    // Données principales
    const primaryData = counts;
    // Données secondaires (simulées pour l'effet visuel comme dans l'image)
    const secondaryData = counts.map(count => count * 1.4);
  
    this.demandeChartOptions = {
      series: [
        {
          name: 'Demandes',
          type: 'area',
          data: primaryData,
        },
        {
          name: 'Total',
          type: 'area',
          data: secondaryData
        }
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true
        }
      },
      colors: ['#10b981', '#3b82f6'], // Vert et bleu comme dans l'image
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: statuses,
        labels: {
          style: {
            colors: '#9ca3af',
            fontSize: '12px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9ca3af',
            fontSize: '12px'
          }
        },
        min: 0,
        max: Math.max(...secondaryData) * 1.2,
        tickAmount: 4
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (val: number) {
            return val.toString();
          }
        }
      }
    };
  }

  calculateTrend(data: number[]): number[] {
    if (data.length <= 1) return data;
  
    const n = data.length;
    const indices = Array.from({ length: n }, (_, i) => i);
  
    let sumX = 0;
    let sumY = 0; 
    let sumXY = 0;
    let sumXX = 0; 
  
    for (let i = 0; i < n; i++) {
      sumX += indices[i];
      sumY += data[i];
      sumXY += indices[i] * data[i];
      sumXX += indices[i] * indices[i];
    }
  
    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) {
      return data;
    }
  
    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;
  
    return indices.map((x) => Math.max(0, Math.round(intercept + slope * x)));
  }
}