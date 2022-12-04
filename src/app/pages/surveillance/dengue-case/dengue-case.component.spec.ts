import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DengueCaseComponent } from './dengue-case.component';

describe('DengueCaseComponent', () => {
  let component: DengueCaseComponent;
  let fixture: ComponentFixture<DengueCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DengueCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DengueCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
