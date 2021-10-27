import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForLoopPage } from './for-loop.page';

describe('ForLoopPage', () => {
  let component: ForLoopPage;
  let fixture: ComponentFixture<ForLoopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForLoopPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForLoopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
