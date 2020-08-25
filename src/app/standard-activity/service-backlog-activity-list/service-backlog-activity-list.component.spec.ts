import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBacklogActivityListComponent } from './service-backlog-activity-list.component';

describe('ServiceBacklogActivityListComponent', () => {
  let component: ServiceBacklogActivityListComponent;
  let fixture: ComponentFixture<ServiceBacklogActivityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceBacklogActivityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBacklogActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
