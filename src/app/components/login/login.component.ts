import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  subscrtns: Subscription[] = [];

  constructor(private authService: AuthService,
              private afAuth: AngularFireAuth,
              private router: Router,
              private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.subscrtns.push(
      this.authService.getUserData().subscribe(user => {
        if (user) {
          this.router.navigateByUrl('/')
          .then();
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscrtns.map(s => s.unsubscribe());
  }

  login(form: NgForm): void {
    const {email, password} = form.value;

    if (!form.valid) {
      return;
    } 

    this.authService.signIn(email,password);
    form.resetForm();
  }

  openRegister():void {
    const dialogRef = this.matDialog.open(RegisterComponent,{
      role: 'dialog',
      height: '480px',
      width: '480px'
    });
      dialogRef.afterClosed().subscribe(result => {
        const {fname, lname, email, password, avatar}  = result;

        if (result !== undefined) {
          this.authService.signUp(email, password, fname, lname, avatar);
        } 
        return;
      });
  }

}
