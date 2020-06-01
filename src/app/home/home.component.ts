import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="jumbotron">
      <h1 class="display-4">Hello folks!</h1>
      <p class="lead">
        This is a simple Angular CRUD project, we will performing CRUD
        operations in Angular i.e Creating, Reading, Updating and Deleting in
        Angular with simple examples.
      </p>
      <hr class="my-4" />
      <p>
        Go ahead and try.
      </p>
      <a
        class="btn btn-primary btn-lg"
        routerLink="/employees/create"
        role="button"
        >Create Employee</a
      >
    </div>
  `,
  styles: [],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
