import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionClosureComponent } from './transition-closure.component';

describe('TransitionClosureComponent', () => {
  let component: TransitionClosureComponent;
  let fixture: ComponentFixture<TransitionClosureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransitionClosureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
