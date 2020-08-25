import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigLoaderComponent } from './config-loader.component';

describe('ConfigLoaderComponent', () => {
  let component: ConfigLoaderComponent;
  let fixture: ComponentFixture<ConfigLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
