import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListoffersComponent } from './listoffers.component';

describe('ListoffersComponent', () => {
  let component: ListoffersComponent;
  let fixture: ComponentFixture<ListoffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListoffersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListoffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
