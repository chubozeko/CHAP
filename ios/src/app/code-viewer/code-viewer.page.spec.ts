import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeViewerPage } from './code-viewer.page';

describe('CodeViewerPage', () => {
  let component: CodeViewerPage;
  let fixture: ComponentFixture<CodeViewerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeViewerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
