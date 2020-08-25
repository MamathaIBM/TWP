import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationServersComponent } from './application-servers.component';

describe('ApplicationServersComponent', () => {
  let component: ApplicationServersComponent;
  let fixture: ComponentFixture<ApplicationServersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationServersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
