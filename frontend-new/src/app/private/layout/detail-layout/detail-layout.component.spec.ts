import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailLayoutComponent } from './detail-layout.component';

describe('DetailLayoutComponent', () => {
  let component: DetailLayoutComponent;
  let fixture: ComponentFixture<DetailLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailLayoutComponent],
    });
    fixture = TestBed.createComponent(DetailLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
