import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RiotApiService {
  //private apiKey = 'RGAPI-686127a8-92f8-47f7-9f94-9a81e378b100';
  //private baseUrl = 'https://europe.api.riotgames.com';
  private apiUrl = 'http://localhost:8080/'; // URL de votre API Spring Boot


  constructor(private http: HttpClient) {}

  // private headers = new HttpHeaders({
  //   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  //   'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
  //   'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
  //   'Origin': 'https://developer.riotgames.com',
  // });

  // getAccount(tagLine: string, gameName: string): Observable<any>{
  //   const url = `${this.baseUrl}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${this.apiKey}`;
  //   return this.http.get(url, {headers: this.headers});

  // }
  getAccountByGameName(gameName: string, tagLine: string): Observable<any> {
    const params = new HttpParams()
      .set('gameName', gameName)
      .set('tagLine', tagLine);
    return this.http.get<any>(this.apiUrl + "getAccountByGameName", { params });
  }

  getMatchList(puuid: string, start: number, count: number){

    let params = new HttpParams()
      .set('puuid', puuid);

    if (start) {
      params = params.set('start', 2);
    }
    if (count) {
      params = params.set('count', 20);
    }
    console.log(params);
    return this.http.get<any>(this.apiUrl + "getMatchList", { params });
  }
}

