import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // Initialize the login form with emailOrUsername and password fields
  loginForm: FormGroup = this.fb.group({
    emailOrUsername: ['giles45', [Validators.required]],
    password: ['Password123', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {}

  // Method to handle login form submission
  login() {
    const { emailOrUsername, password } = this.loginForm.value;

    this.authService.login(emailOrUsername, password).subscribe((response) => {
      if (response === true) {
        console.log('Inicio de sesión exitoso');
        Swal.fire({
          icon: 'success',
          title: '¡Inicio de sesión exitoso!',
          text: '¡Bienvenido de nuevo!',
          showConfirmButton: false,
          timer: 800,
        }).then(() => {
          // Navegar después de que la alerta se cierre
          this.router.navigate(['/dashboard']);
        });
      }
    });
  }
}
