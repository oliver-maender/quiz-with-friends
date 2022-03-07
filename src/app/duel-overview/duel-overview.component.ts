import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-duel-overview',
  templateUrl: './duel-overview.component.html',
  styleUrls: ['./duel-overview.component.css']
})
export class DuelOverviewComponent implements OnInit, OnDestroy {

  routeSub: Subscription;

  username = '';
  userScoring = 0;
  opponentScoring = 0;
  opponent = '';
  userRoundsScoring = [0, 0, 0, 0, 0, 0];
  opponentRoundsScoring = [0, 0, 0, 0, 0, 0];

  player = -1;
  playerId = '';
  isPlayerOnTheClock = false;

  isDuelInfoSet = false;

  playerWinners = [''];

  userSub: Subscription;
  scoreSub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService, private authService: AuthService) { }

  /**
   * Listens to the user data to get the user information and initiates the route check.
   */
  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((res) => {
      this.username = res.username;
      this.playerId = res.id;
      this.checkForRoute();
    });
  }

  /**
   * Checks for the route to get the duel information and prepares it to be displayed.
   */
  checkForRoute() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.scoreSub = this.dataService.getDuel(params['id']).subscribe((duel: any) => {
        if (duel.playerOne === this.username) {
          this.opponent = duel.playerTwo;
          this.userScoring = duel.playerOneScore;
          this.opponentScoring = duel.playerTwoScore;
          this.userRoundsScoring = duel.playerOneRoundScoring;
          this.opponentRoundsScoring = duel.playerTwoRoundScoring;
        } else {
          this.opponent = duel.playerOne;
          this.userScoring = duel.playerTwoScore;
          this.opponentScoring = duel.playerOneScore;
          this.userRoundsScoring = duel.playerTwoRoundScoring;
          this.opponentRoundsScoring = duel.playerOneRoundScoring;
        }

        this.playerWinners = duel.winners;

        if (this.playerId === duel.access[0]) {
          this.player = 1;
        } else {
          this.player = 2;
        }

        if (this.player === 1 && this.player === duel.playerOnTheClock && duel.playerOneRoundsPlayed < 6) {
          this.isPlayerOnTheClock = true;
        } else if (this.player === 2 && this.player === duel.playerOnTheClock && duel.playerTwoRoundsPlayed < 6) {
          this.isPlayerOnTheClock = true;
        } else {
          this.isPlayerOnTheClock = false;
        }

        this.isDuelInfoSet = true;
      });
    });
  }

  /**
   * Initiates the next round when it's the user's turn.
   */
  playRound() {
    if (this.isPlayerOnTheClock) {
      console.log(this.route);
      this.router.navigate(['play'], { relativeTo: this.route });
    } else {
      alert("Your opponent has to play first!");
    }
  }

  /**
   * Unsubscribes to all subscriptions.
   */
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.scoreSub.unsubscribe();
  }

}
