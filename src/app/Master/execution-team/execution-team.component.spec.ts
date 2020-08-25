import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionTeamComponent } from './execution-team.component';

describe('ExecutionTeamComponent', () => {
  let component: ExecutionTeamComponent;
  let fixture: ComponentFixture<ExecutionTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutionTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
