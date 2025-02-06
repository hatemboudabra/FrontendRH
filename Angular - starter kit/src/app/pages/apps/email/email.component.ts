import { Component } from '@angular/core';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, icons } from 'lucide-angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import { MDModalModule } from '../../../Component/modals';
import { mailbox } from '../../../data';
import { MnDropdownComponent } from '../../../Component/dropdown';
import { CandidatService } from '../../../core/services/candidat.service';
@Component({
  selector: 'app-email',
  standalone: true,
  imports: [PageTitleComponent, LucideAngularModule, SimplebarAngularModule, MDModalModule, MnDropdownComponent],
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }]
})
export class EmailComponent {
  mailbox: any[] = []; 
  emaillist: boolean = true;

  constructor(private candidatService: CandidatService) {}

  ngOnInit(): void {
    this.loadCandidatures();
  }

  loadCandidatures(): void {
    this.candidatService.getCandidatures().subscribe((data) => {
      this.mailbox = data; 
    });
  }

  emailList(show: boolean): void {
    this.emaillist = show;
  }

}
