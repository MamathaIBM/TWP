import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineEpicAddUpdateComponent } from './define-epic-add-update.component';

describe('DefineEpicAddUpdateComponent', () => {
  let component: DefineEpicAddUpdateComponent;
  let fixture: ComponentFixture<DefineEpicAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineEpicAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineEpicAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
