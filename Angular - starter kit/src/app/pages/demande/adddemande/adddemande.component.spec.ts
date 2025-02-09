import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddemandeComponent } from './adddemande.component';

describe('AdddemandeComponent', () => {
  let component: AdddemandeComponent;
  let fixture: ComponentFixture<AdddemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdddemandeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdddemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
