import { Component, OnInit } from '@angular/core';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listnote',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './listnote.component.html',
  styleUrls: ['./listnote.component.scss']
})
export class ListnoteComponent {
  /*evaluationNote: string = '';
  ratingValue: number = 0;
  maxStars: number = 5;

  constructor(private evaluationService: EvaluationService) {}

  ngOnInit(): void {
    this.loadEvaluationNote();
  }

  loadEvaluationNote(): void {
    const collaboratorId = 9;
    this.evaluationService.getCollaboratorEvaluationNote(collaboratorId).subscribe({
      next: (note) => {
        this.evaluationNote = note;
        this.ratingValue = Math.round((Number(note) / 20) * 5);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la note', error);
      }
    });
  }

  getStarsArray(): number[] {
    return Array(this.maxStars).fill(0).map((_, index) => index + 1);
  }

  getRatingLabel(): string {
    switch(this.ratingValue) {
      case 1:
        return 'Insuffisant';
      case 2:
        return 'À améliorer';
      case 3:
        return 'Satisfaisant';
      case 4:
        return 'Très bien';
      case 5:
        return 'Excellent';
      default:
        return '';
    }
  }*/
}