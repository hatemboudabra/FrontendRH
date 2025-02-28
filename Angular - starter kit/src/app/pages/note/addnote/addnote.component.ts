import { Component } from '@angular/core';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { TeamService } from '../../../core/services/team.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addnote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './addnote.component.html',
  styleUrl: './addnote.component.scss'
})
export class AddnoteComponent {
  constructor(private noteService:EvaluationService,private authService:AuthenticationService , private teamService:TeamService
  ){}

}
