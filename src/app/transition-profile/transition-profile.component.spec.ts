import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionProfileComponent } from './transition-profile.component';

describe('TransitionProfileComponent', () => {
  let component: TransitionProfileComponent;
  let fixture: ComponentFixture<TransitionProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransitionProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
