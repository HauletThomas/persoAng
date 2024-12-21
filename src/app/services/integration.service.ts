import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import { SignupRequest } from '../models/signup-request';
import { SignupResponse } from '../models/signup-response';

const BASE_URL = "http://localhost:8080/api";

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  constructor(private http: HttpClient) { }

  doLogin(request: LoginRequest):Observable<LoginResponse> {
    return this.http.post<LoginResponse>(BASE_URL + "/doLogin", request);
  }

  dashboard(): Observable<any> {
    return this.http.get<any>(BASE_URL + "/dashboard");
  }

  doRegister(request: SignupRequest):Observable<SignupResponse> {
    return this.http.post<SignupResponse>(BASE_URL + "/doRegister", request);
  }

  checkUserExists(email: string, username: string): Observable<{ exists: boolean }> {
    return this.http.post<{ exists: boolean }>('/checkUserExists', { email, username });
  }

  decodeJWT(token: string): any {
    if (!token) {
      return null;
    }

    try {
      // Divise le token en trois parties : Header, Payload, Signature
      const payload = token.split('.')[1];
      // Décode le payload en base64
      const decodedPayload = atob(payload);
      // Retourne le payload JSON décodé
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding JWT', error);
      return null;
    }
  }
}
