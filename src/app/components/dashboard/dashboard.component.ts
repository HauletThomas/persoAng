import { Component, OnInit, Renderer2 } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string = '';
  isDarkMode: boolean = false;

  constructor(private storage: LocalStorageService, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Récupérer le nom d'utilisateur depuis le LocalStorage
    this.username = this.storage.get('username') || 'Utilisateur';
  }

}
