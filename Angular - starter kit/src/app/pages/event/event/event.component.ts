import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxDatatableModule } from '@siemens/ngx-datatable';
import { LucideAngularModule, Plus, Edit, Trash2, Calendar, Users, Ship } from 'lucide-angular';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { FormsModule } from '@angular/forms';
import { User } from '../../../store/Authentication/auth.models';
import { AuthenticationService } from '../../../core/services/auth.service';
import { EventService } from '../../../core/services/event.service';
import Swal from 'sweetalert2';
import { Events, EventsType } from '../../../data/event';

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
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  EventsType = EventsType; 
  plusIcon = Plus;
  editIcon = Edit;
  trashIcon = Trash2;
  calendarIcon = Calendar;
  
  currentUser: User | null = null;
  events: Events[] = [];
  filteredEvents: Events[] = [];
  loading = false;
  searchTerm: string = '';
  filterType: EventsType | 'ALL' = 'ALL';
  showEventForm = false;
  newEvent: Partial<Events> = {
    title: '',
    description: '',
    type: EventsType.TEAM_BUILDING,
    startDate: new Date(),
    endDate: new Date(new Date().setHours(new Date().getHours() + 2))
  }

  constructor(
    private authService: AuthenticationService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.loading = true;
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user && user.username) {
          this.currentUser = user;
          this.getUserIdByUsername(user.username);
        } else {
          console.error('User not logged in or username missing.');
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.loading = false;
      },
    });
  }

  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails && userDetails.id) {
          this.currentUser = { ...this.currentUser, id: userDetails.id } as User;
          this.loadEvents(userDetails.id);
        } else {
          console.error('Invalid user data or missing ID');
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.loading = false;
      },
    });
  }

  loadEvents(userId: number): void {
    this.loading = true;
    this.eventService.getEventsByUser(userId).subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = [...this.events];
        this.loading = false;
        //this.ngOnInit()
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading = false;
        Swal.fire('Error', 'Failed to load events', 'error');
      }
    });
  }

  addEvent(): void {
    if (!this.currentUser?.id) return;

    const completeEvent: Events = {
      ...this.newEvent as Required<Pick<Events, 'title' | 'description' | 'type' | 'startDate' | 'endDate'>>,
      id: 0,
      userId: this.currentUser.id
    };

    this.eventService.addEvent(completeEvent).subscribe({
      next: (event) => {
        this.events.push(event);
        this.filterEvents();
        this.resetEventForm();

        Swal.fire('Success', 'Event added successfully!', 'success');
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error adding event:', error);
        Swal.fire('Error', 'Failed to add event', 'error');
      }
    });
  }



  

  resetEventForm(): void {
    this.newEvent = {
      title: '',
      description: '',
      type: EventsType.TEAM_BUILDING,
      startDate: new Date(),
      endDate: new Date(new Date().setHours(new Date().getHours() + 2))
    };
    this.showEventForm = false;
  }

  getEventTypeIcon(type: EventsType) {
    return type === EventsType.VOYAGE ? Ship : Users;
  }

  getEventTypeClass(type: EventsType) {
    return type === EventsType.VOYAGE ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = !this.searchTerm || 
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = this.filterType === 'ALL' || event.type === this.filterType;
      
      return matchesSearch && matchesType;
    });
  }
  deleteEvent(eventId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(eventId).subscribe({
          next: () => {
            this.events = this.events.filter(e => e.id !== eventId);
            this.filteredEvents = this.filteredEvents.filter(e => e.id !== eventId);
            Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
          },
          error: (error) => {
            console.error('Error deleting event:', error);
            Swal.fire('Error', 'Failed to delete event', 'error');
          }
        });
      }
    });
  }
}