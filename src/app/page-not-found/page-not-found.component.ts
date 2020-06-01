import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-4">404</h1>
        <p class="lead">Ooops, Page not found.</p>
      </div>
    </div>
  `,
  styles: [],
})
export class PageNotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
