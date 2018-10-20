import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSymbolsPage } from './dialog-symbols.page';

describe('DialogSymbolsPage', () => {
  let component: DialogSymbolsPage;
  let fixture: ComponentFixture<DialogSymbolsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSymbolsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSymbolsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
