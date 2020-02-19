import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityProductsComponent } from './availability-products.component';

describe('AvailabilityProductsComponent', () => {
  let component: AvailabilityProductsComponent;
  let fixture: ComponentFixture<AvailabilityProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilityProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
