import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TailoredServiceBacklogComponent } from './tailored-service-backlog.component';

describe('TailoredServiceBacklogComponent', () => {
  let component: TailoredServiceBacklogComponent;
  let fixture: ComponentFixture<TailoredServiceBacklogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TailoredServiceBacklogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TailoredServiceBacklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
