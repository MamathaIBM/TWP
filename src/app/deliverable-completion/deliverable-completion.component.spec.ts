import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverableCompletionComponent } from './deliverable-completion.component';

describe('DeliverableCompletionComponent', () => {
  let component: DeliverableCompletionComponent;
  let fixture: ComponentFixture<DeliverableCompletionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverableCompletionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverableCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
