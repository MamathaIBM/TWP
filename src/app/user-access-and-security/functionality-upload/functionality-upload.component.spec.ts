import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionalityUploadComponent } from './functionality-upload.component';

describe('PhaseActivityAddComponent', () => {
  let component: FunctionalityUploadComponent;
  let fixture: ComponentFixture<FunctionalityUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionalityUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionalityUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
