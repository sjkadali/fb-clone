import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

   images = [
              'assets/IMG_0021.jpg',
              'assets/IMG_0221.jpg',
              'assets/IMG_0304.jpg',
              'assets/IMG_0382.jpg',
              'assets/IMG_0425.jpg',
              'assets/IMG_0528.jpg'
   ]
  
  constructor() { }

  ngOnInit(): void {
  }

}
