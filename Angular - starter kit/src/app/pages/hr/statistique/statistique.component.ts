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
          console.error('❌ Utilisateur non connecté ou username manquant.');
        }
      },
      error: (error) => {
        console.error("❌ Erreur lors du chargement de l'utilisateur :", error);
      },
    });
  }

  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails && userDetails.id) {
          console.log('✅ ID utilisateur reçu :', userDetails.id);
          this.loadStats(userDetails.id);
        } else {
          console.error('❌ Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors de la récupération des données utilisateur :', error);
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
        // Convert object to array of { status, count }
        const arrayData = Object.entries(data).map(([status, count]) => ({ status, count }));
        this.initDemandeChart(arrayData);
      },
      (error) => console.error('Erreur lors de la récupération des stats des demandes', error)
    );
    
  }

  initRoleChart(roleCounts: Record<string, number>): void {
    this.roleChartOptions = {
      series: Object.values(roleCounts),
      chart: {
        type: 'donut',
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
      labels: Object.keys(roleCounts),
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                color: '#373d3f',
                formatter: (w: any) => {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px',
          fontWeight: 600,
          colors: ['#ffffff']
        },
        formatter: function (val: number, opts: any) {
          return opts.w.config.labels[opts.seriesIndex] + ': ' + val.toFixed(1) + '%';
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
        markers: {
          width: 12,
          height: 12,
          radius: 12,
        },
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
            return val + ' utilisateurs';
          }
        }
      }
    };
  }

  initTeamChart(teams: { teamName: string, userCount: number }[]): void {
    const teamNames = teams.map(team => team.teamName);
    const userCounts = teams.map(team => team.userCount);
  
    const trendData = this.calculateTrend(userCounts);
  
    this.teamChartOptions = {
      series: [
        {
          name: 'Nombre de collaborateurs',
          type: 'bar',
          data: userCounts
        },
        {
          name: 'Tendance',
          type: 'line',
          data: trendData
        }
      ],
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: true
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
        stacked: false
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '40%',
          dataLabels: {
            position: 'top',
            formatter: function (val: number, opts: any) {
              return `${teamNames[opts.dataPointIndex]}: ${val}`;
            }
          }
        }
      },
      fill: {
        type: ['solid', 'gradient'],
        gradient: {
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.8,
          opacityTo: 0.2,
          stops: [0, 100]
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#333333']
        },
        offsetY: -20,
        formatter: function (val: number, opts: any) {
          return val.toString();
        }
      },
      stroke: {
        width: [0, 3],
        curve: 'smooth'
      },
      xaxis: {
        categories: teamNames,
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px',
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
      yaxis: [
        {
          title: {
            text: 'Nombre d\'utilisateurs',
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
        {
          opposite: true,
          title: {
            text: 'Tendance',
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
        }
      ],
      colors: ['#3b82f6', '#ef4444'],
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
        }
      },
      tooltip: {
        theme: 'light',
        shared: true,
        intersect: false,
        style: {
          fontSize: '12px'
        },
        y: {
          formatter: function (val: number, opts: any) {
            return `${teamNames[opts.dataPointIndex]}: ${val} utilisateurs`;
          }
        }
      }
    };
  }

  initDemandeChart(demandes: { status: string, count: number }[]): void {
    const statuses = demandes.map(d => d.status);
    const counts = demandes.map(d => d.count);
    
    this.demandeChartOptions = {
      series: [{
        name: 'Demandes',
        data: counts
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
          speed: 800
        }
      },
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 8,
          columnWidth: '65%',
          dataLabels: {
            position: 'top'
          }
        }
      },
      colors: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'],
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          fontWeight: 600
        },
        offsetY: -20,
        formatter: function(val: number) {
          return val.toString();
        }
      },
      legend: {
        show: false
      },
      grid: {
        show: true,
        borderColor: '#e2e8f0',
        strokeDashArray: 4
      },
      xaxis: {
        categories: statuses,
        labels: {
          style: {
            fontSize: '12px',
            fontWeight: 500,
            colors: '#6b7280'
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
          text: 'Nombre de demandes',
          style: {
            color: '#6b7280',
            fontSize: '13px',
            fontWeight: 600
          }
        },
        labels: {
          style: {
            fontSize: '12px',
            colors: '#6b7280'
          },
          formatter: function(val: number) {
            return val.toFixed(0);
          }
        }
      },
      tooltip: {
        theme: 'light',
        x: {
          show: true
        },
        y: {
          formatter: function(val: number) {
            return val + ' demandes';
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