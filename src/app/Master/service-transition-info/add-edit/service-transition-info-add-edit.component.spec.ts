import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTransitionInfoAddEditComponent } from './service-transition-info-add-edit.component';

describe('ServiceTransitionInfoAddEditComponent', () => {
  let component: ServiceTransitionInfoAddEditComponent;
  let fixture: ComponentFixture<ServiceTransitionInfoAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceTransitionInfoAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTransitionInfoAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
