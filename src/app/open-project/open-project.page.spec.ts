import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenProjectPage } from './open-project.page';

describe('OpenProjectPage', () => {
  let component: OpenProjectPage;
  let fixture: ComponentFixture<OpenProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenProjectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
