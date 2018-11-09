import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfElsePage } from './if-else.page';

describe('IfElsePage', () => {
  let component: IfElsePage;
  let fixture: ComponentFixture<IfElsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfElsePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfElsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
