import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-duel-play',
  templateUrl: './duel-play.component.html',
  styleUrls: ['./duel-play.component.css']
})
export class DuelPlayComponent implements OnInit, OnDestroy {

  question: string = '';
  answers: string[] = [];
  rightAnswer: number = -1;
  questionID: number = -1;
  timeLeft: number = 10;
  timeUp: boolean = false;

  timeLeftInterval: any;

  divStyle: string = '100%';

  player = -1;
  round = -1;
  roundScore = 0;
  questionsInRound = 0;

  constructor(private authService: AuthService, private dataService: DataService, private route: ActivatedRoute, private router: Router) { }

  /**
   * Initiates the duel round
   */
  ngOnInit(): void {
    this.getDuelData();
  }

  /**
   * Gets the data for the duel and start the duel round
   */
  getDuelData() {
    this.route.params.pipe(take(1)).subscribe((params) => {
      this.dataService.getDuel(params['id']).pipe(take(1)).subscribe((duel: any) => {
        this.authService.user.pipe(take(1)).subscribe((res) => {
          if (duel.finished) {
            this.router.navigateByUrl('/');
            return;
          }
          const id = res.id;
          if (id === duel.access[0]) {
            this.player = 1;
          } else {
            this.player = 2;
          }
          if (this.player === 1) {
            this.round = duel.playerOneRoundsPlayed;
          } else {
            this.round = duel.playerTwoRoundsPlayed;
          }
          this.initiateQuestion();
        });
      });
    });
  }

  /**
   * Gets a random question from the database and writes the data into the variables.
   */
  initiateQuestion() {
    this.dataService.getQuestion().pipe(take(1)).subscribe((data: any) => {
      this.timeLeft = 10;
      this.timeUp = false;
      this.calculateTimeLeft();
      this.questionID = Math.floor(Math.random() * data.length);
      this.question = data[this.questionID].question;
      this.answers = data[this.questionID].answers;
      this.rightAnswer = data[this.questionID].rightAnswer;
      console.log(data);
    });
  }

  /**
   * Starts an interval to limit the user's time to answer to 10 seconds.
   */
  calculateTimeLeft() {
    this.timeLeftInterval = setInterval(() => {
      this.timeLeft--;
      this.divStyle = this.timeLeft + '0%';
      console.log(this.timeLeft);
      if (this.timeLeft === 0) {
        this.questionAnswered(-1);
      }
    }, 1000);
  }

  /**
   * Starts the question evaluation.
   *
   * @param id - The id of the answer
   */
  onAnswered(id: number) {
    this.questionAnswered(id);
  }

  /**
   * Evaluates the answer and clears the timer.
   *
   * @param id - The id of the answer
   */
  questionAnswered(id: number) {
    if (id === this.rightAnswer) {
      this.roundScore++;
      console.log('RIGHT');
    }
    this.questionsInRound++;
    this.timeUp = true;
    clearInterval(this.timeLeftInterval);
  }

  /**
   * Either gets the next question or takes the user back to the duel overview page when the round is finished.
   */
  nextQuestion() {
    if (this.questionsInRound < 3) {
      this.initiateQuestion();
    } else {
      this.route.params.pipe(take(1)).subscribe((params) => {
        this.dataService.setDuelScores(params['id'], this.player, this.round, this.roundScore).subscribe(() => {
          this.router.navigate(['..'], { relativeTo: this.route });
        });
      });
    }
  }

  /**
   * Clears the interval
   */
  ngOnDestroy(): void {
    clearInterval(this.timeLeftInterval);
  }

}
