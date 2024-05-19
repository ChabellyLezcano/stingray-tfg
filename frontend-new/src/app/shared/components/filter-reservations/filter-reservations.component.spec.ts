import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterReservationsComponent } from './filter-reservations.component';

describe('FilterReservationsComponent', () => {
  let component: FilterReservationsComponent;
  let fixture: ComponentFixture<FilterReservationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterReservationsComponent],
    });
    fixture = TestBed.createComponent(FilterReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
