import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAdminHorizontalComponent } from './menu-admin-horizontal.component';

describe('MenuAdminHorizontalComponent', () => {
  let component: MenuAdminHorizontalComponent;
  let fixture: ComponentFixture<MenuAdminHorizontalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuAdminHorizontalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuAdminHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
