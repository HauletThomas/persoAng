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


  constructor(private riotApiService: RiotApiService){

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
        console.log('Compte trouvé :', response);
        // alert(`Compte trouvé : ${JSON.stringify(response)}`);

        this.puuid = response.puuid; // Récupérer le puuid du compte

        this.riotApiService
          .getMatchList(
            this.puuid,
            this.start = 2,
            this.count = 20
          )
          .subscribe({
            next: (matchResponse) => {
              this.matchListIds = matchResponse; // Stocker les matchIds
              console.log('Match IDs trouvés :', this.matchListIds);
            },
            error: (error: HttpErrorResponse) => {
              console.error('Erreur lors de la récupération des match IDs :', error);
              alert('Impossible de récupérer les match IDs. Vérifiez les informations saisies.');
            },
          });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération du compte :', error);
        alert('Impossible de trouver le compte. Vérifiez les informations saisies.');
      }
    });
    }


}
