import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { IntegrationService } from '../../services/integration.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '../../models/login-request';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private integration: IntegrationService, private storage: LocalStorageService, private renderer: Renderer2) { }

  userForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  router = inject(Router);
  request: LoginRequest = new LoginRequest;
  errorMessage: string = '';
  showPassword: boolean = false;
  isDarkMode: boolean = false;

  ngOnInit(): void {
    // Charger le thème enregistré
    const savedTheme = this.storage.get('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      this.renderer.addClass(document.body, 'bg-dark');
      this.renderer.addClass(document.body, 'text-light');
    }
  }


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'bg-dark');
      this.renderer.addClass(document.body, 'text-light');
      this.storage.set('theme', 'dark');
    } else {
      this.renderer.removeClass(document.body, 'bg-dark');
      this.renderer.removeClass(document.body, 'text-light');
      this.storage.set('theme', 'light');
    }
  }

  login() {

    this.storage.remove('auth-key');

    const formValue = this.userForm.value;

    if (formValue.username == '' || formValue.password == '') {
      //alert('Wrong Credentilas');
      this.errorMessage = 'Username or password is missing.';
      return;
    }

    this.request.username = formValue.username;
    this.request.password = formValue.password;

    this.integration.doLogin(this.request).subscribe({
      next: (res) => {
        console.log("Received Response:" + res.token);
        if (res.token !== undefined && res.token !==''){
          this.storage.set('auth-key', res.token);
          const decodedToken = this.integration.decodeJWT(res.token);
          console.log(decodedToken);
           // Implémentez une fonction pour décoder le token si nécessaire.
          this.storage.set('username', decodedToken.sub);
        }
        // this.storage.set('username', res.);
        console.log(res.token);
        this.integration.dashboard().subscribe({
          next: (dashboardres) => {
            console.log("Dashboard res:" + dashboardres.response);
            this.router.navigateByUrl('/dashboard');
          }, error: (err) => {
            console.log("Dashboard error received :" + err);
            this.errorMessage = 'Failed to load dashboard.';
            this.storage.remove('auth-key');
          }
        });
      }, error: (err) => {
        console.log("Error Received Response:" + err);
        this.errorMessage = 'Invalid username or password.';
        this.storage.remove('auth-key');
      }
    });
  }
}
