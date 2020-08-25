import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTraineeMapUploadComponent } from './app-trainee-map-upload.component';

describe('PhaseActivityAddComponent', () => {
  let component: AppTraineeMapUploadComponent;
  let fixture: ComponentFixture<AppTraineeMapUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTraineeMapUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTraineeMapUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
