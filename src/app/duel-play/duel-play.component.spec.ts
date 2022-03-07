import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuelPlayComponent } from './duel-play.component';

describe('DuelPlayComponent', () => {
  let component: DuelPlayComponent;
  let fixture: ComponentFixture<DuelPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuelPlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuelPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
