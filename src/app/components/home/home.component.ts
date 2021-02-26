import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, UserData } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

   images = [
              'assets/IMG_0021.jpg',
              'assets/IMG_0221.jpg',
              'assets/IMG_0304.jpg',
              'assets/IMG_0382.jpg',
              'assets/IMG_0425.jpg',
              'assets/IMG_0528.jpg'
   ];

   posts: any[] = [];
   user: UserData;
   subscrtn: Subscription[]= [];
  
  constructor(private postService: PostService,
              private authService: AuthService) { 

  }

  ngOnInit(): void {

    this.subscrtn.push(
      this.postService.getAllPosts().subscribe(posts => {
        this.posts = posts
      })
    );

    this.subscrtn.push(
      this.authService.getCurrentUser().subscribe(user => {
        this.user = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscrtn.map(s => s.unsubscribe());
  }

  postMessage(form: NgForm) {
    const {message} = form.value;

    console.log("user: "+ this.user);
    this.postService.postMessage(message,
      this.user.firstName,
      {
        avatar: this.user.avatar,
        lastName: this.user.lastName,
        firstName: this.user.firstName
      });

      form.resetForm();
  }

  logOut() {
    this.authService.logOut();
  }

}
