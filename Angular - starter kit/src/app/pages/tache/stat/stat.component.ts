import { Component } from '@angular/core';
import { TacheService } from '../../../core/services/tache.service';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AuthenticationService } from '../../../core/services/auth.service';
import { EvaluationService } from '../../../core/services/evaluation.service';

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
  chefId: number = 7;

  constructor(
    private tacheService: TacheService, 
    private evaluationService: EvaluationService, 
    private auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Charger les statistiques par statut
    this.tacheService.getTacheStatsByChef(this.chefId).subscribe(
      (data) => this.initChartStatut(data),
      (error) => console.error('Erreur lors de la récupération des stats par statut', error)
    );

    // Charger les statistiques par collaborateur
    this.tacheService.getTachesAssignedByChefToCollaborators(this.chefId).subscribe(
      (data) => this.initChartCollaborateur(data),
      (error) => console.error('Erreur lors de la récupération des stats par collaborateur', error)
    );

    // Charger les notes des utilisateurs évalués
    this.evaluationService.getAllUsersWithAverageNote().subscribe(
      (data) => this.initChartEvaluation(data),
      (error) => console.error('Erreur lors de la récupération des notes des utilisateurs', error)
    );
  }

  initChartStatut(data: { [key: string]: number }): void {
    this.chartStatut = {
      series: [{ 
        name: 'Tâches par statut', 
        data: Object.values(data) 
      }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: true
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 0,
          left: 0,
          blur: 3,
          opacity: 0.1
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '40%',
          distributed: true,
          rangeBarOverlap: true,
          colors: {
            ranges: [{
              from: 0,
              to: 100,
              color: undefined
            }],
            backgroundBarColors: ['#f3f4f6'],
            backgroundBarOpacity: 0.2,
          },
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 0.8,
          stops: [0, 100]
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px',
          fontWeight: 600,
          colors: ['#ffffff']
        },
        offsetY: -20,
        formatter: function (val: number) {
          return val.toString();
        }
      },
      xaxis: {
        categories: Object.keys(data),
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '7px',
            fontWeight: 500
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
        title: {
          text: 'Nombre de tâches',
          style: {
            color: '#6b7280',
            fontSize: '13px',
            fontWeight: 600
          }
        },
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px'
          }
        }
      },
      colors: [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6'
      ],
      grid: {
        show: true,
        borderColor: '#e2e8f0',
        strokeDashArray: 4,
        position: 'back',
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      tooltip: {
        theme: 'light',
        shared: false,
        intersect: true,
        style: {
          fontSize: '12px'
        },
        y: {
          formatter: function (val: number) {
            return val + ' tâches';
          }
        },
        marker: {
          show: true
        }
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
    this.chartEvaluation = {
      series: [{ name: 'Note moyenne', data: data.map((d) => d.averageNote) }],
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
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.8,
          opacityTo: 0.2,
          stops: [0, 90, 100],
          colorStops: [
            {
              offset: 0,
              color: '#fbbf24',
              opacity: 1
            },
            {
              offset: 100,
              color: '#f59e0b',
              opacity: 0.3
            }
          ]
        }
      },
      xaxis: {
        categories: data.map((d) => d.username),
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Note moyenne',
          style: {
            color: '#6b7280',
            fontSize: '12px',
          },
        },
        min: 0,
        max: 10,
        labels: {
          formatter: function(val: number) {
            return val.toFixed(1);
          }
        }
      },
      colors: ['#fbbf24'],
      grid: {
        borderColor: '#e2e8f0',
        strokeDashArray: 4,
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val: number) {
            return val.toFixed(1) + ' / 10';
          },
        },
      },
    };
  }
}
