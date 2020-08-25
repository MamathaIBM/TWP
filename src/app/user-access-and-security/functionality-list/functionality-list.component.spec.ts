import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionalityListComponent } from './functionality-list.component';

describe('FunctionalityListComponent', () => {
  let component: FunctionalityListComponent;
  let fixture: ComponentFixture<FunctionalityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionalityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionalityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
