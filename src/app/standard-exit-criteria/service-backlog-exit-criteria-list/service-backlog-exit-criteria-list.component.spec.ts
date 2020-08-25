import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBacklogExitCriteriaListComponent } from './service-backlog-exit-crietria-list.component';

describe('ServiceBacklogExitCriteriaListComponent', () => {
  let component: ServiceBacklogExitCriteriaListComponent;
  let fixture: ComponentFixture<ServiceBacklogExitCriteriaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceBacklogExitCriteriaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBacklogExitCriteriaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
