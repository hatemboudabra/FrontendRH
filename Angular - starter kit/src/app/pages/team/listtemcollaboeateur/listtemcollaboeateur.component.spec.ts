import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListtemcollaboeateurComponent } from './listtemcollaboeateur.component';

describe('ListtemcollaboeateurComponent', () => {
  let component: ListtemcollaboeateurComponent;
  let fixture: ComponentFixture<ListtemcollaboeateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListtemcollaboeateurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListtemcollaboeateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
