import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionStakeholderComponent } from './transition-stakeholder.component';

describe('TransitionStakeholderComponent', () => {
  let component: TransitionStakeholderComponent;
  let fixture: ComponentFixture<TransitionStakeholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransitionStakeholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionStakeholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
