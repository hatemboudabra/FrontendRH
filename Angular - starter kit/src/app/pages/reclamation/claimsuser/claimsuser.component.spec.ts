import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsuserComponent } from './claimsuser.component';

describe('ClaimsuserComponent', () => {
  let component: ClaimsuserComponent;
  let fixture: ComponentFixture<ClaimsuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsuserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClaimsuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
