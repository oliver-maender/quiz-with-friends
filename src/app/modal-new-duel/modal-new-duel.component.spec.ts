import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewDuelComponent } from './modal-new-duel.component';

describe('ModalNewDuelComponent', () => {
  let component: ModalNewDuelComponent;
  let fixture: ComponentFixture<ModalNewDuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNewDuelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewDuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
