import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';

import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: AngularFirestore) { }

  /**
   * Gets the data for all the users.
   *
   * @returns All user data
   */
  showAllUsers() {
    return this.firestore.collection('users').doc('userlist').get().pipe(take(1), map((res) => {
      return res.data();
    }));
  }

  /**
   * Creates a new duel between those two users.
   *
   * @param username - The user's username
   * @param userid - The user's user ID
   * @param opponentUsername - The opponent's username
   * @param uid - The opponent's user ID
   */
  startNewDuel(username: string, userid: string, opponentUsername: string, uid: string) {
    let newDuelId = '';
    this.firestore.collection('duels').add({ access: [userid, uid] }).then((docRes) => {
      newDuelId = docRes.id;
      // this.firestore.collection('users').doc(userid).get().pipe(take(1)).subscribe((res) => {
      //   let duels: any = res.data();
      //   duels.duels.push(newDuelId);
      //   console.log(duels);
      //   this.firestore.collection('users').doc(userid).update(duels);
      // });
      this.firestore.collection('users').doc(userid).update({
        duels: firebase.firestore.FieldValue.arrayUnion({ duelId: newDuelId, opponent: opponentUsername, finished: false })
      });
      this.firestore.collection('users').doc(uid).update({
        duels: firebase.firestore.FieldValue.arrayUnion({ duelId: newDuelId, opponent: username, finished: false })
      });
      this.firestore.collection('users').doc(userid).update({
        activeOpponents: firebase.firestore.FieldValue.arrayUnion(uid)
      });
      this.firestore.collection('users').doc(uid).update({
        activeOpponents: firebase.firestore.FieldValue.arrayUnion(userid)
      });
      this.firestore.collection('duels').doc(newDuelId).update({ playerOne: username, playerTwo: opponentUsername, finished: false, playerOneScore: 0, playerTwoScore: 0, playerOneRoundsPlayed: 0, playerOneRoundScoring: [0, 0, 0, 0, 0, 0], playerTwoRoundsPlayed: 0, playerTwoRoundScoring: [0, 0, 0, 0, 0, 0], playerOnTheClock: 1, winners: [''] });
    });
  }

  /**
   * Listens to the duel data to show changes immediately.
   *
   * @param duelId - The id of the duel
   * @returns The duel data
   */
  getDuel(duelId: string) {
    return this.firestore.collection('duels').doc(duelId).valueChanges().pipe(map((duel: any) => {
      return duel;
    }));
  }

  /**
   * Returns the specified question.
   *
   * @returns The data of the question
   */
  getQuestion() {
    return this.firestore.collection('questionAnswer').valueChanges().pipe(take(1), map((resData) => {
      return resData;
    }));
  }

  /**
   * Changes the duel score in the firestore
   *
   * @param duelId - The id of the duel
   * @param player - The player who just played (1 or 2)
   * @param round - The round which was just played
   * @param score - The score the user got this round
   * @returns true
   */
  setDuelScores(duelId: string, player: number, round: number, score: number) {
    return this.firestore.collection('duels').doc(duelId).get().pipe(take(1), map((duel: any) => {
      let duelData = duel.data();
      if (duelData.playerOnTheClock === 1) {
        duelData.playerOnTheClock = 2;
      } else {
        duelData.playerOnTheClock = 1;
      }
      if (player === 1) {
        this.setDuelForPlayerOne(duelData, round, score, duelId);
      } else {
        this.setDuelForPlayerTwo(duelData, round, score, duelId);
      }
      console.log(duelData.playerOneRoundScoring);
      return true;
    }));
  }

  /**
   * Changes the duel data in the firestore for player 1
   *
   * @param duelData - The data of the duel
   * @param round - The round which was just played
   * @param score - The score the user got this round
   * @param duelId - The id of the duel
   */
  setDuelForPlayerOne(duelData: any, round: number, score: number, duelId: string) {
    duelData.playerOneRoundScoring[round] = score;
    duelData.playerOneRoundsPlayed++;
    duelData.playerOneScore += score;
    if (duelData.playerOneRoundsPlayed === 6 && duelData.playerTwoRoundsPlayed === 6) {
      duelData.finished = true;
      duelData.playerOnTheClock = 0;
      this.setDuelFinishOnUsers(duelData.access[0], duelData.access[1]);
      if (duelData.playerOneScore > duelData.playerTwoScore) {
        duelData.winners = [duelData.playerOne];
      } else if (duelData.playerOneScore < duelData.playerTwoScore) {
        duelData.winners = [duelData.playerTwo];
      } else {
        duelData.winners = [duelData.playerOne, duelData.playerTwo];
      }
    }
    this.firestore.collection('duels').doc(duelId).update({
      playerOneRoundsPlayed: duelData.playerOneRoundsPlayed,
      playerOneRoundScoring: duelData.playerOneRoundScoring,
      playerOneScore: duelData.playerOneScore,
      playerOnTheClock: duelData.playerOnTheClock,
      finished: duelData.finished,
      winners: duelData.winners
    });
  }

  /**
   * Changes the duel data in the firestore for player 2
   *
   * @param duelData - The data of the duel
   * @param round - The round which was just played
   * @param score - The score the user got this round
   * @param duelId - The id of the duel
   */
  setDuelForPlayerTwo(duelData: any, round: number, score: number, duelId: string) {
    duelData.playerTwoRoundScoring[round] = score;
    duelData.playerTwoRoundsPlayed++;
    duelData.playerTwoScore += score;
    if (duelData.playerOneRoundsPlayed === 6 && duelData.playerTwoRoundsPlayed === 6) {
      duelData.finished = true;
      duelData.playerOnTheClock = 0;
      this.setDuelFinishOnUsers(duelData.access[0], duelData.access[1]);
      if (duelData.playerOneScore > duelData.playerTwoScore) {
        duelData.winners = [duelData.playerOne];
      } else if (duelData.playerOneScore < duelData.playerTwoScore) {
        duelData.winners = [duelData.playerTwo];
      } else {
        duelData.winners = [duelData.playerOne, duelData.playerTwo];
      }
    }
    this.firestore.collection('duels').doc(duelId).update({
      playerTwoRoundsPlayed: duelData.playerTwoRoundsPlayed,
      playerTwoRoundScoring: duelData.playerTwoRoundScoring,
      playerTwoScore: duelData.playerTwoScore,
      playerOnTheClock: duelData.playerOnTheClock,
      finished: duelData.finished,
      winners: duelData.winners
    });
  }

  /**
   * Removes the opponent from active opponents.
   *
   * @param playerOneUId - Player one's uid
   * @param playerTwoUId - Player two's uid
   */
  setDuelFinishOnUsers(playerOneUId: string, playerTwoUId: string) {
    this.firestore.collection('users').doc(playerOneUId).update({
      activeOpponents: firebase.firestore.FieldValue.arrayRemove(playerTwoUId)
    });
    this.firestore.collection('users').doc(playerTwoUId).update({
      activeOpponents: firebase.firestore.FieldValue.arrayRemove(playerOneUId)
    });
  }

  /**
   * Listen to the duels to display the changes immediately.
   *
   * @param userid - The user's id
   * @returns The user's data
   */
  listenToDuels(userid: string) {
    return this.firestore.collection('users').doc(userid).valueChanges().pipe(map((userData) => {
      return userData;
    }))
  }
}
