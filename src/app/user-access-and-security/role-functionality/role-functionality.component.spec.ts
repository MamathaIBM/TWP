import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFunctionalityComponent } from './role-functionality.component';

describe('RoleFunctionalityListComponent', () => {
  let component: RoleFunctionalityComponent;
  let fixture: ComponentFixture<RoleFunctionalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleFunctionalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFunctionalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
