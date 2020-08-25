import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidAddUpdateComponent } from './raid-add-update.component';

describe('RaidAddUpdateComponent', () => {
  let component: RaidAddUpdateComponent;
  let fixture: ComponentFixture<RaidAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaidAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaidAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
