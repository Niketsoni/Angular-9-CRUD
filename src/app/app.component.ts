import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { convertUpdateArguments } from '@angular/compiler/src/compiler_util/expression_converter';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'angular-nine-test';

  update = false;
  joke: any;

  constructor(updates: SwUpdate, private data: DataService) {
    updates.available.subscribe((event) => {
      //this.update = true;
      updates.activateUpdate().then(() => document.location.reload());
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.data.gimmeJokes().subscribe((res) => {
      this.joke = res;
    });
  }
}
