import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerAdminComponent } from './controller-admin.component';

describe('ControllerAdminComponent', () => {
  let component: ControllerAdminComponent;
  let fixture: ComponentFixture<ControllerAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
