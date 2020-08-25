import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineEpicComponent } from './define-epic.component';

describe('DefineEpicComponent', () => {
  let component: DefineEpicComponent;
  let fixture: ComponentFixture<DefineEpicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineEpicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineEpicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
