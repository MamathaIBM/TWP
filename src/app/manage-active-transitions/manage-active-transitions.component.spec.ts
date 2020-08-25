import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageActiveTransitionsComponent } from './manage-active-transitions.component';

describe('ManageActiveTransitionsComponent', () => {
  let component: ManageActiveTransitionsComponent;
  let fixture: ComponentFixture<ManageActiveTransitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageActiveTransitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageActiveTransitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
