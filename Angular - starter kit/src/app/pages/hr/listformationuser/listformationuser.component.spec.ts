import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListformationuserComponent } from './listformationuser.component';

describe('ListformationuserComponent', () => {
  let component: ListformationuserComponent;
  let fixture: ComponentFixture<ListformationuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListformationuserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListformationuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
