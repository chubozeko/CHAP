import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialQPage } from './tutorial-q.page';

describe('TutorialQPage', () => {
  let component: TutorialQPage;
  let fixture: ComponentFixture<TutorialQPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialQPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialQPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
