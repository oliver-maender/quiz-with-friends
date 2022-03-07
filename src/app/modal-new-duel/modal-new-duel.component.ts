import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-new-duel',
  templateUrl: './modal-new-duel.component.html',
  styleUrls: ['./modal-new-duel.component.css']
})
export class ModalNewDuelComponent implements OnInit {

  @Input() allUsers = [];

  @Output() newOpponent = new EventEmitter<{uid: string, opponentUsername: string}>();
  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Starts the routine to create a new duel when possible.
   *
   * @param uid - The user's id
   * @param opponentUsername - The opponent's username
   */
  startNewDuel(uid: string, opponentUsername: string) {
    this.newOpponent.emit({uid, opponentUsername});
  }

  /**
   * Closes the modal when the user does not choose an opponent and closes the modal via button.
   */
  closeModal() {
    this.closeModalEvent.emit(true);
  }

}
