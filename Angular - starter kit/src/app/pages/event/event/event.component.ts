import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { LucideAngularModule } from 'lucide-angular';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { FormsModule } from '@angular/forms';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    LucideAngularModule,
    NgxDatatableModule,
    FlatpickrModule
  ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  isLoading: boolean = false;
  selectedEvent: any = null;
  eventCategories = ['Tous', 'Réunion', 'Formation', 'Événement', 'Congé'];
  selectedCategory: string = 'Tous';
  searchQuery: string = '';
  dateRange: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  // Options pour le datepicker
  datePickerOptions = {
    altInput: true,
    altFormat: 'd M Y',
    dateFormat: 'Y-m-d',
    mode: 'range',
    onChange: (selectedDates: Date[]) => this.onDateSelect(selectedDates)
  };

  ngOnInit(): void {
    this.loadEvents();
    
    // Initialiser le datepicker après le rendu du composant
    setTimeout(() => {
      const dateInput = document.querySelector('.date-range-input') as HTMLElement;
      if (dateInput) {
      }
    }, 0);
  }

  loadEvents(): void {
    this.isLoading = true;
    // Simuler un appel API
    setTimeout(() => {
      this.events = [
        {
          id: 1,
          title: 'Réunion trimestrielle',
          description: 'Revue des objectifs et résultats du trimestre',
          startDate: new Date('2023-11-15T09:00:00'),
          endDate: new Date('2023-11-15T11:30:00'),
          location: 'Salle A1',
          category: 'Réunion',
          participants: 12,
          status: 'confirmé'
        },
        {
          id: 2,
          title: 'Formation Angular',
          description: 'Formation avancée sur Angular 16',
          startDate: new Date('2023-11-18T13:00:00'),
          endDate: new Date('2023-11-18T17:00:00'),
          location: 'Salle B2',
          category: 'Formation',
          participants: 8,
          status: 'confirmé'
        },
        {
          id: 3,
          title: 'Événement de fin d\'année',
          description: 'Célébration annuelle avec toute l\'équipe',
          startDate: new Date('2023-12-20T18:00:00'),
          endDate: new Date('2023-12-20T23:00:00'),
          location: 'Grand Salon',
          category: 'Événement',
          participants: 45,
          status: 'en attente'
        },
        {
          id: 4,
          title: 'Planning des congés',
          description: 'Revue des congés pour le premier trimestre',
          startDate: new Date('2023-12-05T10:00:00'),
          endDate: new Date('2023-12-05T11:30:00'),
          location: 'Salle C3',
          category: 'Réunion',
          participants: 6,
          status: 'confirmé'
        },
        {
          id: 5,
          title: 'Formation Sécurité',
          description: 'Formation obligatoire sur les normes de sécurité',
          startDate: new Date('2023-11-25T09:00:00'),
          endDate: new Date('2023-11-25T12:00:00'),
          location: 'Amphithéâtre',
          category: 'Formation',
          participants: 30,
          status: 'confirmé'
        }
      ];
      this.filteredEvents = [...this.events];
      this.isLoading = false;
    }, 1000);
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter(event => {
      // Filtrer par catégorie
      const matchesCategory = this.selectedCategory === 'Tous' || event.category === this.selectedCategory;
      
      // Filtrer par recherche (titre ou description)
      const matchesSearch = !this.searchQuery || 
                           event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                           event.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      // Filtrer par date
      let matchesDate = true;
      if (this.startDate && this.endDate) {
        const eventDate = new Date(event.startDate);
        matchesDate = eventDate >= this.startDate && eventDate <= this.endDate;
      }
      
      return matchesCategory && matchesSearch && matchesDate;
    });
  }

  onDateSelect(selectedDates: Date[]): void {
    if (selectedDates.length === 2) {
      this.startDate = selectedDates[0];
      this.endDate = selectedDates[1];
      this.filterEvents();
    } else if (selectedDates.length === 0) {
      this.startDate = null;
      this.endDate = null;
      this.filterEvents();
    }
  }

  openEventDetails(event: any): void {
    this.selectedEvent = event;
    // Implémentation pour ouvrir une modal avec les détails
    console.log('Ouverture des détails pour:', event.title);
  }

  createNewEvent(): void {
    // Implémentation pour créer un nouvel événement
    console.log('Création d\'un nouvel événement');
  }

  editEvent(event: any): void {
    // Implémentation pour modifier un événement
    console.log('Modification de l\'événement:', event.title);
  }

  deleteEvent(event: any): void {
    // Implémentation pour supprimer un événement
    console.log('Suppression de l\'événement:', event.title);
    this.events = this.events.filter(e => e.id !== event.id);
    this.filterEvents();
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmé':
        return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400';
      case 'annulé':
        return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400';
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400';
    }
  }
}