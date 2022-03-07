import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuelOverviewComponent } from './duel-overview.component';

describe('DuelOverviewComponent', () => {
  let component: DuelOverviewComponent;
  let fixture: ComponentFixture<DuelOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuelOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuelOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
