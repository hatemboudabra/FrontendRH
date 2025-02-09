import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListdemandeComponent } from './listdemande.component';

describe('ListdemandeComponent', () => {
  let component: ListdemandeComponent;
  let fixture: ComponentFixture<ListdemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListdemandeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListdemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
