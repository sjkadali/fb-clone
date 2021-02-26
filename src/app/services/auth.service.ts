import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData: Observable<firebase.User>;
  private currentUser: UserData;
  private currentUser$: BehaviorSubject<UserData> = new BehaviorSubject<UserData>(null);

  constructor(private afs: AngularFirestore, 
              private afAuth: AngularFireAuth,
              private router: Router) {
    this.userData =afAuth.authState;

    this.userData.subscribe(user => {
      if (user) {
        this.afs.collection<UserData>('users')
        .doc<UserData>(user.uid)
        .valueChanges()
        .subscribe(currentUser => {
          if (currentUser !== undefined) {
            this.currentUser = currentUser;
            this.currentUser$.next(this.currentUser);
          } else {
            this.currentUser$ = null;
            this.currentUser$.next(this.currentUser);
          }
        });
      }
    });
  }

  getCurrentUser(): Observable<UserData> {
    return this.currentUser$.asObservable();
  }

  signUp(email: string,
        password: string,
        firstName: string,
        lastName: string,
        avatar: string ): void {
          this.afAuth.createUserWithEmailAndPassword(email, password)
          .then( res => {
            if (res) {
              if (avatar == undefined || avatar == '') {
                avatar ='https://img.favpng.com/23/0/3/computer-icons-user-profile-clip-art-portable-network-graphics-png-favpng-YEj6NsJygkt6nFTNgiXg9fg9w.jpg';
              }             
              this.afs.collection('users').doc(res.user.uid)
              .set({
                firstName,
                lastName,
                email,
                avatar
              }).then((): void => {
                this.afs.collection<UserData>('users')
                .doc<UserData>(res.user.uid)
                .valueChanges()
                .subscribe(user => {
                  if (user) {
                    this.currentUser = user;
                    this.currentUser$.next(this.currentUser);
                  }
                });
              }).catch(err => console.log(err));
            }
          }).catch(err => console.log(err));
        }

        getUserData(): Observable<firebase.User> {
          return this.userData;
        }

        signIn(email: string, password: string ): void {
          this.afAuth.signInWithEmailAndPassword(email, password)
          .then(res => {
            this.userData = this.afAuth.authState;

            this.afs.collection<UserData>('users')
            .doc<UserData>(res.user.uid)
            .valueChanges()
            .subscribe(user => {
              if (user) {
                this.currentUser = user;
                this.currentUser$.next(this.currentUser);
              }
            });
          }).catch(err => console.log(err));
        }

        logOut(): void {
          this.afAuth.signOut().then(()=> {
            this.currentUser = null;
            this.currentUser$.next(this.currentUser);
            this.router.navigateByUrl('/login')
            .then();
          });
        }

        searchUserInDB(user_id: string): Observable<UserData> {
          return this.afs.collection<UserData>('users')
          .doc<UserData>(user_id)
          .valueChanges();
        }
 
 }

export interface UserData {
  firstName: string,
  lastName: string,
  avatar: string,
  email: string,
  id?: string
}
