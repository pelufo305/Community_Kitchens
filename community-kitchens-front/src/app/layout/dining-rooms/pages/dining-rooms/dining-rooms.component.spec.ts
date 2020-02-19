import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiningRoomsComponent } from './dining-rooms.component';

describe('DiningRoomsComponent', () => {
  let component: DiningRoomsComponent;
  let fixture: ComponentFixture<DiningRoomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiningRoomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiningRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
