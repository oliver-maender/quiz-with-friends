import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStartpageComponent } from './user-startpage.component';

describe('UserStartpageComponent', () => {
  let component: UserStartpageComponent;
  let fixture: ComponentFixture<UserStartpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserStartpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStartpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
