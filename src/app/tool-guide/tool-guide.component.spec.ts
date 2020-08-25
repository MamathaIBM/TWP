import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolGuideComponent } from './tool-guide.component';

describe('ToolGuideComponent', () => {
  let component: ToolGuideComponent;
  let fixture: ComponentFixture<ToolGuideComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
