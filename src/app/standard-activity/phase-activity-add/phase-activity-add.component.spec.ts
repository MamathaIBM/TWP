import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseActivityAddComponent } from './phase-activity-add.component';

describe('PhaseActivityAddComponent', () => {
  let component: PhaseActivityAddComponent;
  let fixture: ComponentFixture<PhaseActivityAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhaseActivityAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseActivityAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
