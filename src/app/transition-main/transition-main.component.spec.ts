import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionMainComponent } from './transition-main.component';

describe('TransitionMainComponent', () => {
  let component: TransitionMainComponent;
  let fixture: ComponentFixture<TransitionMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransitionMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
