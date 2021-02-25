import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  currentUser: firebase.User;

  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth ) {
    this.afAuth.authState.subscribe(user => 
      user ? this.currentUser = user : alert('No User'));
  }

  getAllPosts(): Observable<any> {
    return this.afs.collection<any>('posts', ref => ref.orderBy('time', 'desc'))
    .snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          };
        });
      })
    );
  }

  postMessage(message, ownerName, details ): void {
    this.afs.collection('posts').add({
      message,
      title: ownerName,
      user_id: this.currentUser.uid,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      ...details
    }).then(res => console.log(res)).catch(err => console.log(err));
  }

}
