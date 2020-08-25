import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TailoredExitcriteriaComponent } from './tailored-exitcriteria.component';

describe('TailoredExitcriteriaComponent', () => {
  let component: TailoredExitcriteriaComponent;
  let fixture: ComponentFixture<TailoredExitcriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TailoredExitcriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TailoredExitcriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
