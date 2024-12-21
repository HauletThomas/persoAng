import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string = '';

  constructor(private storage: LocalStorageService) {}

  ngOnInit(): void {
    // Récupérer le nom d'utilisateur depuis le LocalStorage
    this.username = this.storage.get('username') || 'Utilisateur';
  }
}
