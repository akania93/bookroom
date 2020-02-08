import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bookr-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'bookroom';
  currentDate;

  ngOnInit() {
    this.currentDate = new Date().getFullYear();
  }
}
