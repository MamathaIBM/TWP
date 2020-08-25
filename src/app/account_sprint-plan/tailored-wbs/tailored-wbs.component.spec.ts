import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TailoredWBSComponent } from './tailored-wbs.component';

describe('TailoredWBSComponent', () => {
  let component: TailoredWBSComponent;
  let fixture: ComponentFixture<TailoredWBSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TailoredWBSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TailoredWBSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
