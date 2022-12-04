import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvitrapDetailComponent } from './ovitrapDetail.component';

describe('DengueCaseComponent', () => {
  let component: OvitrapDetailComponent;
  let fixture: ComponentFixture<OvitrapDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvitrapDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvitrapDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
