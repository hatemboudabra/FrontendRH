import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdemandeComponent } from './userdemande.component';

describe('UserdemandeComponent', () => {
  let component: UserdemandeComponent;
  let fixture: ComponentFixture<UserdemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserdemandeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserdemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
