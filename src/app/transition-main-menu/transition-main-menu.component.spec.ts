import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionMainMenuComponent } from './transition-main-menu.component';

describe('TransitionMainMenuComponent', () => {
  let component: TransitionMainMenuComponent;
  let fixture: ComponentFixture<TransitionMainMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransitionMainMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
