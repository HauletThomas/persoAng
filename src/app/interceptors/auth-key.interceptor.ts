import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';

@Injectable()
export class authKeyInterceptor implements HttpInterceptor {

  constructor(private storage: LocalStorageService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.storage.get('auth-key');

    // Vérification si un token est disponible
    if (token) {
      const isTokenExpired = this.isTokenExpired(token);

      if (isTokenExpired) {
        // Supprimer le token expiré et rediriger vers la page de connexion
        this.storage.remove('auth-key');
        this.router.navigate(['/login']);
        return throwError(() => new Error('Session expired'));
      }

      // Ajouter le token aux en-têtes si valide
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Gérer les erreurs du backend (par exemple, token invalide)
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Token non valide ou utilisateur non autorisé
          this.storage.remove('auth-key');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  // Méthode pour vérifier si le token est expiré
  private isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1])); // Décodage du payload JWT
    const expiry = payload.exp * 1000; // Convertir la date d'expiration en millisecondes
    return Date.now() > expiry;
  }
}
