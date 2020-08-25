import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTransitionInfoComponent } from './service-transition-info.component';

describe('ServiceTransitionInfoComponent', () => {
  let component: ServiceTransitionInfoComponent;
  let fixture: ComponentFixture<ServiceTransitionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceTransitionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTransitionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
