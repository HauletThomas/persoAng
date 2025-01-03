import { Component } from '@angular/core';
import { RiotApiService } from '../../services/riot/riot-api.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-riot-api-champion-winrate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './riot-api-champion-winrate.component.html',
  styleUrl: './riot-api-champion-winrate.component.css'
})
export class RiotApiChampionWinrateComponent {
  searchInput: string = ''; // Variable pour stocker l'entrée utilisateur

  puuid: string = '';  // PUUID du joueur
  // starttime: number | undefined;
  // endtime: number | undefined;
  // type: string | undefined;
  // queue: number | undefined;
  start: number | undefined;
  count: number | undefined;

  matchListIds: any[] = [];
  matchStats: any[] = [];



  constructor(private riotApiService: RiotApiService) {

  }
  onSearch(): void {
    if (!this.searchInput.includes('#')) {
      alert('Veuillez entrer les données au format NameGam#Tagline');
      return;
    }

    const [nameGame, tagLine] = this.searchInput.split('#');
    if (!nameGame || !tagLine) {
      alert('Le NameGame ou le Tagline est manquant.');
      return;
    }


    this.riotApiService.getAccountByGameName(nameGame, tagLine).subscribe({
      next: (response) => {
        //in response (puuid, gameName, tagline)

        this.puuid = response.puuid; // Récupérer le puuid du compte
        console.log(this.puuid);
        this.riotApiService.getMatchById(this.puuid).subscribe({
            next: (matchResponse) => {
              this.matchStats = matchResponse; // Stocker les matchIds
              console.log('Match stat trouvés :', this.matchStats);
            },
            error: (error: HttpErrorResponse) => {
              console.error('Erreur lors de la récupération des match stats :', error);
              alert('Impossible de récupérer les match stats. Vérifiez les informations saisies.');
            },
          });
        // this.puuid = response.puuid; // Récupérer le puuid du compte
        // this.riotApiService.getMatchList(this.puuid, 1, 20).subscribe({
        //     next: (matchResponse) => {
        //       this.matchStats = matchResponse; // Stocker les matchIds
        //       console.log('Match stat trouvés :', this.matchStats);
        //     },
        //     error: (error: HttpErrorResponse) => {
        //       console.error('Erreur lors de la récupération des match stats :', error);
        //       alert('Impossible de récupérer les match stats. Vérifiez les informations saisies.');
        //     },
        //   });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération du compte :', error);
        alert('Impossible de trouver le compte. Vérifiez les informations saisies.');
      }
    });
  }


}
