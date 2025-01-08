import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LocalStorageService } from './services/local-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="!isAuthCheckComplete; else mainApp">
      <div class="loading-screen">
        <!-- Indicateur de chargement -->
        <p>Loading...</p>
      </div>
    </div>
    <ng-template #mainApp>
      <app-navbar></app-navbar>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  // templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class AppComponent implements OnInit {
  title = 'Perso';
  isAuthCheckComplete = false;

  constructor(private storage: LocalStorageService) {}

  ngOnInit(): void {
    if (this.storage.get("auth-key") != null){

      this.isAuthCheckComplete = true;

    }

  }
}
