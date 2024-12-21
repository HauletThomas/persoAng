import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IntegrationService } from '../../services/integration.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SignupRequest } from '../../models/signup-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router,private integrationService: IntegrationService, private storage: LocalStorageService, private renderer: Renderer2) { }

  request: SignupRequest = new SignupRequest;
  msg: String | undefined;
  showPassword: boolean = false;
  isDarkMode: boolean = false;


  signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), this.passwordValidator]),
  })

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

  public onSubmit() {
    this.storage.remove('auth-key');

    const formValue =  this.signupForm.value;

    this.request.email = formValue.email;
    this.request.username = formValue.username;
    this.request.password = formValue.password;


    if (this.signupForm.valid) {
      console.log("Form is valid");

      this.integrationService.doRegister(this.request).subscribe({
        next: (res) => {
          console.log(res.response);

          this.msg = res.response;
          this.router.navigate(['/login']);

        }, error: (err) => {
          console.log("Error Received:", err);
        }
      })
    } else {
      console.log("On submit failed.");
    }
  }

  private passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol) {
      return { invalidPassword: true };
    }
    return null;
  }
}
