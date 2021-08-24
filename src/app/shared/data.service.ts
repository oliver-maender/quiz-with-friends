import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';

import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: AngularFirestore) { }

  showAllUsers() {
    return this.firestore.collection('users').doc('userlist').get().pipe(take(1), map((res) => {
      return res.data();
    }));
  }

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
        duels: firebase.firestore.FieldValue.arrayUnion({duelId: newDuelId, playerOne: username, playerTwo: opponentUsername, finished: false})
      });
      this.firestore.collection('users').doc(uid).update({
        duels: firebase.firestore.FieldValue.arrayUnion({duelId: newDuelId, playerOne: opponentUsername, playerTwo: username, finished: false})
      });
    });
  }

  playDuel(duelId: string) {
    return this.firestore.collection('duels').doc(duelId).get().pipe(take(1), map((duel) => {
      return duel.data();
    }));
  }

  listenToDuels(userid: string) {
    return this.firestore.collection('users').doc(userid).valueChanges().pipe(map((duels) => {
      return duels;
    }))
  }
}
