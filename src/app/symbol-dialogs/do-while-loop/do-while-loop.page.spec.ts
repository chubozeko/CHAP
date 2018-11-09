import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoWhileLoopPage } from './do-while-loop.page';

describe('DoWhileLoopPage', () => {
  let component: DoWhileLoopPage;
  let fixture: ComponentFixture<DoWhileLoopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoWhileLoopPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoWhileLoopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
