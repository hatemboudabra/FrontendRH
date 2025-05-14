import { Component } from '@angular/core';
import { TacheService } from '../../../core/services/tache.service';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AuthenticationService } from '../../../core/services/auth.service';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { User } from '../../../store/Authentication/auth.models';
import { DemandeService } from '../../../core/services/demande.service';

@Component({
  selector: 'app-stat',
  standalone: true,
  imports: [CommonModule,PageTitleComponent,NgApexchartsModule],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss'
})
export class StatComponent {
  chartStatut: any;
  chartCollaborateur: any;
  chartEvaluation: any;
  chartDemandes: any ;

 // chefId: number = 7;
  currentUser: User | null = null;

  constructor(
    private tacheService: TacheService, 
    private evaluationService: EvaluationService, 
    private authService: AuthenticationService,
    private demandeService:DemandeService
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
    this.tacheService.getTacheStatsByChef(userId).subscribe(
      (data) => this.initChartStatut(data),
      (error) => console.error('Erreur lors de la récupération des stats par statut', error)
    );

    this.tacheService.getTachesAssignedByChefToCollaborators(userId).subscribe(
      (data) => this.initChartCollaborateur(data),
      (error) => console.error('Erreur lors de la récupération des stats par collaborateur', error)
    );

    this.evaluationService.getAllUsersWithAverageNote().subscribe(
      (data) => this.initChartEvaluation(data),
      (error) => console.error('Erreur lors de la récupération des notes des utilisateurs', error)
    );
    this.demandeService.getDemandesCountByStatusForDocumentTrainingOrLeave().subscribe(
      (data) => this.initChartDemandes(data),
      (error) => console.error('Erreur lors de la récupération des stats des demandes', error)
    );
  }
  initChartDemandes(data: any): void {
    let dataObj: {[key: string]: number};
    
    if (data instanceof Map) {
      dataObj = Object.fromEntries(data);
    } else if (data instanceof Object) {
      dataObj = data;
    } else {
      console.error('Format de données inattendu pour les demandes', data);
      dataObj = { 'Erreur': 0 };
    }
    
    if (Object.keys(dataObj).length === 0) {
      dataObj = { 'Aucune donnée': 0 };
    }
    
    this.chartDemandes = {
      series: Object.values(dataObj),
      chart: {
        type: 'donut',
        height: 350,
        toolbar: {
          show: true
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      labels: Object.keys(dataObj),
      colors: [
        '#06b6d4', 
        '#ec4899', 
        '#eab308', 
        '#84cc16',
        '#8b5cf6' 
      ],
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opts: any) {
          return opts.w.globals.series[opts.seriesIndex];
        }
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Demandes',
                formatter: function (w: any) {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
                }
              }
            }
          }
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center'
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val: number) {
            return val + ' demandes';
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }
  initChartStatut(data: { [key: string]: number }): void {
    const categories = Object.keys(data);
    const values = Object.values(data);
    
    // Calculs pour les séries supplémentaires
    const total = values.reduce((a, b) => a + b, 0);
    const percentages = values.map(v => (v / total) * 100);
    const trendLine = values.map((_, i, arr) => {
      const subset = arr.slice(0, i + 1);
      return subset.reduce((a, b) => a + b, 0) / subset.length;
    });
  
    this.chartStatut = {
      series: [
        {
          name: 'Nombre de tâches',
          type: 'column',
          data: values
        },
        {
          name: 'Pourcentage',
          type: 'line',
          data: percentages
        },
        {
          name: 'Tendance',
          type: 'area',
          data: trendLine
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        toolbar: { show: true },
        animations: { 
          enabled: true,
          easing: 'easeout',
          speed: 800,
          dynamicAnimation: { speed: 400 }
        }
      },
      colors: ['#6366F1', '#F59E0B', '#10B981'],
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '45%',
          dataLabels: { position: 'top' }
        }
      },
      stroke: {
        width: [0, 3, 0],
        curve: 'smooth',
        dashArray: [0, 0, 5]
      },
      fill: {
        type: ['solid', 'gradient', 'gradient'],
        gradient: {
          shadeIntensity: 0.8,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
      },
      markers: {
        size: [0, 5, 0],
        colors: ['#F59E0B'],
        strokeWidth: 0
      },
      xaxis: {
        categories: categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '12px',
            fontFamily: 'Inter'
          }
        }
      },
      yaxis: [
        {
          title: { text: 'Nombre de tâches' },
          min: 0
        },
        {
          opposite: true,
          title: { text: 'Pourcentage %' },
          max: 100,
          labels: {
            formatter: (val: number) => `${Math.round(val)}%`
          }
        }
      ],
      tooltip: {
        shared: true,
        intersect: false,
        theme: 'dark',
        y: [
          { formatter: (val: number) => `${val} tâches` },
          { formatter: (val: number) => `${val.toFixed(1)}%` },
          { formatter: (val: number) => `Moyenne: ${val.toFixed(1)}` }
        ]
      },
      grid: {
        borderColor: '#F3F4F6',
        strokeDashArray: 4,
        padding: { top: -20 }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        markers: {
          radius: 12,
          offsetX: -4
        },
        itemMargin: { horizontal: 12 }
      }
    };
  }

  initChartCollaborateur(data: { [key: string]: number }): void {
    this.chartCollaborateur = {
      series: [{ 
        name: 'Tâches assignées', 
        data: Object.values(data) 
      }],
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: true
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      plotOptions: {
        area: {
          fillTo: 'end'
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          colors: ['#333']
        }
      },
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
      xaxis: {
        categories: Object.keys(data),
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Nombre de tâches',
          style: {
            color: '#6b7280',
            fontSize: '12px',
          },
        },
      },
      colors: ['#3b82f6'],
      grid: {
        borderColor: '#e2e8f0',
        strokeDashArray: 4,
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val: number) {
            return val + ' tâches';
          },
        },
      },
    };
  }
  
  initChartEvaluation(data: { username: string; averageNote: number }[]): void {
    // Trier et garder les 5 meilleurs
    const topPerformers = [...data]
      .sort((a, b) => b.averageNote - a.averageNote)
      .slice(0, 5);

    this.chartEvaluation = {
      series: [{
        name: 'Note moyenne',
        data: topPerformers.map(user => user.averageNote)
      }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '45%',
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toFixed(1),
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#000']
        }
      },
      xaxis: {
        categories: topPerformers.map(user => user.username),
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '12px',
            fontFamily: 'Inter'
          },
          rotate: -45
        }
      },
      yaxis: {
        title: {
          text: 'Note moyenne',
          style: {
            color: '#6B7280',
            fontSize: '12px',
            fontFamily: 'Inter'
          }
        },
        min: 0,
        max: 10,
        forceNiceScale: true,
        labels: {
          formatter: (val: number) => val.toFixed(1)
        }
      },
      colors: ['#3B82F6'],
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 4,
        padding: {
          top: -20
        }
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val: number) => `${val.toFixed(1)}/10`
        }
      },
      noData: {
        text: 'Chargement des données...',
        align: 'center',
        verticalAlign: 'middle',
        style: {
          color: '#6B7280',
          fontSize: '14px',
          fontFamily: 'Inter'
        }
      }
    };
  }

  createEmptyChart(): void {
    this.chartEvaluation = {
      series: [{
        data: []
      }],
      chart: {
        type: 'bar',
        height: 350
      },
      noData: {
        text: 'Aucune donnée disponible',
        align: 'center',
        verticalAlign: 'middle'
      }
    };
  }
}
