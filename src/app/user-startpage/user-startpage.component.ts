import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  allUsers = [];

  allDuels = [];
  duelsSub: Subscription;

  constructor(private authService: AuthService, private dataService: DataService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((res) => {
      this.username = res.username;
      this.userid = res.id;
    });
    this.duelsSub = this.dataService.listenToDuels(this.userid).subscribe((duels: any) => {
      this.allDuels = duels.duels;
      console.log(this.allDuels);
    });
  }

  showAllUsers() {
    this.dataService.showAllUsers().subscribe((res: any) => {
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
      console.log(this.allUsers);
    });
  }

  startNewDuel(uid: string, opponentUsername: string) {
    for (let i = 0; i < this.allDuels.length; i++) {
      const element = this.allDuels[i];
      if (element.playerTwo === opponentUsername && !element.finished) {
        return;
      }
    }
    this.dataService.startNewDuel(this.username, this.userid, opponentUsername, uid);
  }

  playDuel(duelId: string) {
    this.dataService.playDuel(duelId).subscribe((duel) => {
      console.log(duel);
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
