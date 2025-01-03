import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RiotApiService {

  private apiUrl = 'http://localhost:8080/'; // URL de votre API Spring Boot


  constructor(private http: HttpClient) {}

  getAccountByGameName(gameName: string, tagLine: string): Observable<any> {
    const params = new HttpParams()
      .set('gameName', gameName)
      .set('tagLine', tagLine);

      console.log('' +this.apiUrl + "getAccountByGameName", { params }+'');
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

  // getMatchStatistics(puuid: string, count: number){
  //   const params = new HttpParams()
  //     .set('puuid', puuid)
  //     .set('count', count);
  //   return this.http.get<any>(this.apiUrl + "getMatchStatistics", { params });

  // }

  getMatchById(puuid: string){
    let params = new HttpParams()
      .set('puuid', puuid);
    return this.http.get<any>(this.apiUrl + "getMatchById",{
params  });

  }
}

