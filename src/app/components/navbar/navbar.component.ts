import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class NavbarComponent {
  constructor(private storage: LocalStorageService, private router: Router) {}

  logout(): void {
    this.storage.remove("auth-key");
    this.router.navigate(['/login']);
  }

  isUserLoggedIn(): boolean {
    return !!this.storage.get('auth-key'); // Retourne `true` si un token existe
  }
}

