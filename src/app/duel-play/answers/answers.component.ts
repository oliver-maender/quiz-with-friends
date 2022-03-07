import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {

  @Output() answeredEvent = new EventEmitter<number>();

  @Input() answers: string[] = [];
  @Input() rightAnswer = -1;
  @Input() answered: boolean = false;
  result: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Highlights the right and wrong answers and forwards the given answer id to the answeredEvent listeners.
   *
   * @param id - The id of the answer (0-3)
   */
  checkAnswer(id: number) {
    if (!this.answered) {
      this.answered = true;
      id === this.rightAnswer ? this.result = 'right' : this.result = 'wrong';
      this.answeredEvent.emit(id);
    }
  }

}
