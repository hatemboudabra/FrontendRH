import { Component } from '@angular/core';
import { PageTitleComponent } from '../../../shared/page-title/page-title.component';


@Component({
    selector: 'app-index',
    standalone: true,
    imports: [PageTitleComponent],
    templateUrl: './index.component.html',
})
export class IndexComponent {

    constructor() {
    }

    ngOnInit(): void {

    }
}
