import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterCustomAdoptComponent } from './parameter-custom-adopt.component';

describe('ParameterCustomAdoptComponent', () => {
  let component: ParameterCustomAdoptComponent;
  let fixture: ComponentFixture<ParameterCustomAdoptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterCustomAdoptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterCustomAdoptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
