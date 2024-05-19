import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsAdminComponent } from './reservations-admin.component';

describe('ReservationsAdminComponent', () => {
  let component: ReservationsAdminComponent;
  let fixture: ComponentFixture<ReservationsAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationsAdminComponent],
    });
    fixture = TestBed.createComponent(ReservationsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
