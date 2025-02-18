import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { FlatpickrModule } from '../../../Component/flatpickr/flatpickr.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamService } from '../../../core/services/team.service';

@Component({
  selector: 'app-add-team',
  standalone: true,
  imports: [CommonModule,PageTitleComponent,FlatpickrModule,ReactiveFormsModule, FormsModule],
  templateUrl: './add-team.component.html',
  styleUrl: './add-team.component.scss'
})
export class AddTeamComponent {
 constructor(private teamService:TeamService){}

}
