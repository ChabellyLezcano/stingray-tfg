import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      emailOrUsername: ['giles45', [Validators.required]],
      password: ['Password123', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const emailOrUsername = this.loginForm.get('emailOrUsername')!.value;
      const password = this.loginForm.get('password')!.value;
      this.authService.login(emailOrUsername, password).subscribe({
        next: (ok) => {
          if (ok) {
            console.log('Login successful');
            // Aquí puedes redirigir al usuario o hacer otras acciones tras el login exitoso
          } else {
            this.errorMessage = 'Login failed. Please check your credentials.';
          }
        },
        error: (err) => {
          this.errorMessage = err;
          console.error('Error during login:', err);
        }
      });
    }
  }
}