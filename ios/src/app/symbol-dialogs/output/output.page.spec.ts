import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputPage } from './output.page';

describe('OutputPage', () => {
  let component: OutputPage;
  let fixture: ComponentFixture<OutputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
