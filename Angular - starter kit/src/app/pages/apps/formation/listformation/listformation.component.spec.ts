import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListformationComponent } from './listformation.component';

describe('ListformationComponent', () => {
  let component: ListformationComponent;
  let fixture: ComponentFixture<ListformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
