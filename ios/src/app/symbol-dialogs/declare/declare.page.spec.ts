import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarePage } from './declare.page';

describe('DeclarePage', () => {
  let component: DeclarePage;
  let fixture: ComponentFixture<DeclarePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclarePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclarePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
