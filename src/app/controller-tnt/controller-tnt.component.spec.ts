import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerTntComponent } from './controller-tnt.component';

describe('ControllerTntComponent', () => {
  let component: ControllerTntComponent;
  let fixture: ComponentFixture<ControllerTntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerTntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerTntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
