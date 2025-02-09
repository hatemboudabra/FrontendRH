import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeManagerComponent } from './demande-manager.component';

describe('DemandeManagerComponent', () => {
  let component: DemandeManagerComponent;
  let fixture: ComponentFixture<DemandeManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
