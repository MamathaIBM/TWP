import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionTeamComponent } from './transition-team.component';

describe('TransitionTeamComponent', () => {
  let component: TransitionTeamComponent;
  let fixture: ComponentFixture<TransitionTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransitionTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
