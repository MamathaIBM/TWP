import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintScopeComponent } from './sprint-scope.component';

describe('SprintScopeComponent', () => {
  let component: SprintScopeComponent;
  let fixture: ComponentFixture<SprintScopeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintScopeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
