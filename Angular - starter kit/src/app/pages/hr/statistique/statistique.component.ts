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
          console.error(' Utilisateur non connecté ou username manquant.');
        }
      },
      error: (error) => {
        console.error(" Erreur lors du chargement de l'utilisateur :", error);
      },
    });
  }

  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails && userDetails.id) {
          console.log(' ID utilisateur reçu :', userDetails.id);
          this.loadStats(userDetails.id);
        } else {
          console.error(' Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error(' Erreur lors de la récupération des données utilisateur :', error);
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
    const cumulativeData = counts.map((_, i) => counts.slice(0, i + 1).reduce((a, b) => a + b, 0));
  
    this.roleChartOptions = {
      series: [
        {
          name: 'Nombre d\'utilisateurs',
          type: 'bar',
          data: counts,
        },
        {
          name: 'Cumul des utilisateurs',
          type: 'area',
          data: cumulativeData,
        },
      ],
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: true,
        },
      },
      colors: ['#3b82f6', '#10b981'],
      xaxis: {
        categories: roles,
      },
      yaxis: {
        title: {
          text: 'Nombre d\'utilisateurs',
        },
      },
      tooltip: {
        shared: true,
      },
    };
  }
initTeamChart(teams: { teamName: string, userCount: number }[]): void {
  const teamNames = teams.map(team => team.teamName);
  const userCounts = teams.map(team => team.userCount);
  const average = userCounts.reduce((a, b) => a + b, 0) / userCounts.length;

  this.teamChartOptions = {
    series: [
      {
        name: 'Nombre de collaborateurs',
        type: 'bar',
        data: userCounts,
      },
      {
        name: 'Moyenne',
        type: 'line',
        data: Array(teamNames.length).fill(average),
      },
    ],
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true,
      },
    },
    stroke: {
      width: [0, 4],
      dashArray: [0, 5], 
    },
    colors: ['#3b82f6', '#ef4444'],
    xaxis: {
      categories: teamNames,
    },
    yaxis: {
      title: {
        text: 'Nombre de collaborateurs',
      },
    },
    tooltip: {
      shared: true,
    },
  };
}

  initDemandeChart(demandes: { status: string, count: number }[]): void {
    const statuses = demandes.map(d => d.status);
    const counts = demandes.map(d => d.count);
    const trendData = this.calculateTrend(counts);
  
    this.demandeChartOptions = {
      series: [
        {
          name: 'Nombre de demandes',
          type: 'bar',
          data: counts,
        },
        {
          name: 'Tendance',
          type: 'line',
          data: trendData,
        },
      ],
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: true,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '40%',
        },
      },
      colors: ['#10b981', '#f59e0b'],
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: statuses,
      },
      yaxis: [
        {
          title: {
            text: 'Nombre de demandes',
          },
        },
        {
          opposite: true,
          title: {
            text: 'Tendance',
          },
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
      },
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