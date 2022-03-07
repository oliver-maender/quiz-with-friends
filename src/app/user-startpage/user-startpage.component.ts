import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-user-startpage',
  templateUrl: './user-startpage.component.html',
  styleUrls: ['./user-startpage.component.css']
})
export class UserStartpageComponent implements OnInit, OnDestroy {

  username = '';
  userid = '';
  userSub: Subscription;

  showAllUsersList = false;

  showInfoMessage = false;
  infoMessage = '';

  allUsers = [];

  allDuels = [];
  allActiveDuels = [];
  allFinishedDuels = [];
  allOpponents = [];
  duelsSub: Subscription;

  duelsReceived = false;

  constructor(private authService: AuthService, private dataService: DataService) { }

  /**
   * Initiates all the routines needed to show the user's startpage
   */
  ngOnInit(): void {
    console.log('onInitCalled');
    this.userSub = this.authService.user.subscribe((res) => {
      this.username = res.username;
      this.userid = res.id;

      console.log("userSubCalled");

      this.duelsSub = this.dataService.listenToDuels(this.userid).subscribe((userData: any) => {
        console.log("duelsSubCalled", userData);
        this.allDuels = userData.duels;
        this.allOpponents = userData.activeOpponents;
        this.allActiveDuels = [];
        this.allFinishedDuels = [];
        for (let i = this.allDuels.length - 1; i >= 0; i--) {
          const duel = this.allDuels[i];
          if (this.allActiveDuels.some(e => e.opponent === duel.opponent)) {
            this.allFinishedDuels.push(duel);
          } else {
            this.allActiveDuels.push(duel);
          }
        }
        this.duelsReceived = true;
        console.log(this.allDuels);
        console.log(this.allOpponents);
      });
    });
  }

  /**
   * Gets all users in the database
   */
  showAllUsers() {
    this.dataService.showAllUsers().pipe(take(1)).subscribe((res: any) => {
      this.allUsers = [];
      console.log(res);
      for (const user in res) {
        if (Object.prototype.hasOwnProperty.call(res, user)) {
          const element = res[user];
          if (user != this.userid) {
            this.allUsers.push({ username: element, uid: user });
          }
        }
      }
      this.showAllUsersList = true;
      console.log(this.allUsers);
    });
  }

  /**
   * Creates a new duel if the player does not have an active duel against this player already.
   *
   * @param uid - The user's id
   * @param opponentUsername - The opponent's username
   * @returns if there is already an active duel against this player
   */
  startNewDuel(uid: string, opponentUsername: string) {
    this.showAllUsersList = false;
    if (this.allOpponents) {
      for (let i = 0; i < this.allOpponents.length; i++) {
        const opponent = this.allOpponents[i];
        if (opponent === uid) {
          this.infoMessage = 'You already play against this person.';
          this.showInfoMessage = true;
          return;
        }
      }
    }
    this.infoMessage = 'Duel started!';
    this.showInfoMessage = true;
    this.dataService.startNewDuel(this.username, this.userid, opponentUsername, uid);
  }

  /**
   * Closes the modal for showing all users.
   */
  dismissModal() {
    this.showAllUsersList = false;
  }

  /**
   * Unsubscribes to the subscriptions.
   */
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.duelsSub.unsubscribe();
  }

}
