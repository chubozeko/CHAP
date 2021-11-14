import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhileLoopPage } from './while-loop.page';

describe('WhileLoopPage', () => {
  let component: WhileLoopPage;
  let fixture: ComponentFixture<WhileLoopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhileLoopPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhileLoopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
