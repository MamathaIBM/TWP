import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFunctionalityAddComponent } from './role-functionality-add.component';

describe('RoleFunctionalityAddListComponent', () => {
  let component: RoleFunctionalityAddComponent;
  let fixture: ComponentFixture<RoleFunctionalityAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleFunctionalityAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFunctionalityAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
