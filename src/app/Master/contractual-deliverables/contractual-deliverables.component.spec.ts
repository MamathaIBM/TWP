import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractualDeliverablesComponent } from './contractual-deliverables.component';

describe('ContractualDeliverablesComponent', () => {
  let component: ContractualDeliverablesComponent;
  let fixture: ComponentFixture<ContractualDeliverablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractualDeliverablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractualDeliverablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
