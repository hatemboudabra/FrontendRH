import { Component, inject } from '@angular/core';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import { MDModalModule } from '../../../Component/modals';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ModalService } from '../../../Component/modals/modal.service';
import { addCalendar, deleteCalendar, fetchCalendar, updateCalendar } from '../../../store/Calendar/calendar.actions';
import { getEvents } from '../../../store/Calendar/calendar.selectors';
import { createEventId } from '../../../data/calendar';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { DemandeService } from '../../../core/services/demande.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [PageTitleComponent, MDModalModule, FullCalendarModule, FormsModule, ReactiveFormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  submitted = false;
  eventForm!: UntypedFormGroup;
  isEditMode!: boolean;
  editEvent: any;
  calendarEvents: EventInput[] = [];
  allcalendarEvents: any;

  private store = inject(Store)
  private demandeService = inject(DemandeService); 
  currentDate: any;

  constructor(private formBuilder: UntypedFormBuilder, private modalservice: ModalService) { }

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });

    this.store.dispatch(fetchCalendar());
    this.store.select(getEvents).subscribe((data) => {
      this.calendarEvents = data;
      this.allcalendarEvents = data;
    });

    this.loadDailyDemandes();
  }
  loadDailyDemandes() {
    this.demandeService.getDemandesCountByMonth().pipe(
      map((dailyStats: Map<string, number>) => {
        const events: EventInput[] = [];
        Object.entries(dailyStats).forEach(([dateStr, count]) => {
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            events.push({
              title: `${count} demande${count > 1 ? 's' : ''}`,
              start: dateStr,
              allDay: true,
              display: 'block',
              color: this.getColorForCount(count),
              textColor: '#ffffff'
            });
          }
        });
  
        return events;
      })
    ).subscribe((events: EventInput[]) => {
      this.calendarEvents = events;
      this.allcalendarEvents = this.calendarEvents; 
      this.calendarOptions.events = this.calendarEvents;
    });
  }
  private getColorForCount(count: number): string {
    if (count > 5) return '#ef4444';   
    if (count > 1) return '#f59e0b';   
    return '#10b981';                 
  }



  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, listPlugin, timeGridPlugin, multiMonthPlugin, interactionPlugin],
    headerToolbar: {
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
      center: 'title',
      left: 'prev,next,today'
    },
    timeZone: 'UTC',
    editable: true,
    droppable: true,
    selectable: true,
    weekends: true,
    selectMirror: true,
    dayMaxEvents: true,
    initialView: 'multiMonthYear',
    themeSystem: "tailwindcss",
    initialEvents: this.calendarEvents,
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this)
  };
  handleDateClick(date: any) {
    this.currentDate = date.date;
    this.modalservice.open('event-modal');
    this.isEditMode = false;
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.modalservice.open('event-modal');
    this.isEditMode = true;
    this.editEvent = clickInfo.event;
    this.submitted = false;
    var category = clickInfo.event.classNames.join(" ");
    this.eventForm = this.formBuilder.group({
      title: clickInfo.event.title,
      category: category,
    });
  }

  position() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Event has been saved',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  resetForm() {
    this.eventForm.reset({
      title: '',
      className: '',
    });
    this.modalservice.close('event-modal');
  }
}