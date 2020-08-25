import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConsentformComponent } from './view-consentform.component';

describe('ViewConsentformComponent', () => {
  let component: ViewConsentformComponent;
  let fixture: ComponentFixture<ViewConsentformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewConsentformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewConsentformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
