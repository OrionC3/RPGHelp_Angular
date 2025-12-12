import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from '@components/layout/nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('RPGHelp_Angular');
  loading: boolean = false;

  constructor() {}

  // Crée la méthode loadData ici
  loadData() {
    this.loading = true;

    // Simule une requête asynchrone
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}
