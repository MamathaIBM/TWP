import { async, ComponentFixture, TestBed } from '@angular/core/testing';
 
import { SevenKeyComponent } from './seven-key.component';

describe('SevenKeyComponent', () => {
  let component: SevenKeyComponent;
  let fixture: ComponentFixture<SevenKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SevenKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SevenKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
