import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvitrapComponent } from './ovitrap.component';

describe('DengueCaseComponent', () => {
  let component: OvitrapComponent;
  let fixture: ComponentFixture<OvitrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvitrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvitrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
