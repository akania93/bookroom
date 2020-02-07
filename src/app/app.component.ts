import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bookr-root',
  styleUrls: ['./app.component.less'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'bookroom01';
  currentDate;

  isCollapsed = true;
  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit() {
    this.currentDate = new Date().getFullYear();
  }
}
