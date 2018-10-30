import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <p>
      home works!
    </p>
    <button (click)="login()">Login</button>
  `,
  styles: []
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('home');
  }

  public login() {
    window['gapi'].auth2.getAuthInstance().signIn();
  }

}
