import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from '@components/layout/nav-bar/nav-bar';
import { Spinner } from "@components/spinner/spinner";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBar, Spinner],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']  // ✅ CORRIGÉ ici
})
export class App {
  protected readonly title = signal('RPGHelp_Angular');
  loading: boolean = false;

  constructor() {}

  // Exemple de méthode pour tester le spinner
  loadData() {
    this.loading = true;

    // Simule une requête asynchrone
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}
