import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadinessQuestionDesignSaveComponent } from './readiness-question-design-save.component';

describe('ReadinessQuestionDesignSaveComponent', () => {
  let component: ReadinessQuestionDesignSaveComponent;
  let fixture: ComponentFixture<ReadinessQuestionDesignSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadinessQuestionDesignSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadinessQuestionDesignSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
