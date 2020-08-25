import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TailoredSprintBacklogComponent } from './tailored-sprint-backlog.component';

describe('TailoredSprintBacklogComponent', () => {
  let component: TailoredSprintBacklogComponent;
  let fixture: ComponentFixture<TailoredSprintBacklogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TailoredSprintBacklogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TailoredSprintBacklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
