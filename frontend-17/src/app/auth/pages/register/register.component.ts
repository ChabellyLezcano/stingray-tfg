import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(5)]],  // Asegúrate de que el nombre de usuario cumpla con tus requisitos mínimos
      password: ['', [Validators.required, Validators.minLength(8)]],  // Contraseña con mínimo de 8 caracteres
      birthDate: ['', [Validators.required]],  // Añadir validadores específicos si es necesario
      sex: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { email, username, password, birthDate, sex } = this.registerForm.value;
      this.authService.register(email, username, password, birthDate, sex).subscribe({
        next: (ok) => {
          if (ok) {
            console.log('Registration successful');
            // Aquí puedes redirigir al usuario o hacer otras acciones tras el registro exitoso
          } else {
            this.errorMessage = 'Registration failed. Please check your inputs.';
          }
        },
        error: (err) => {
          this.errorMessage = err;
          console.error('Error during registration:', err);
        }
      });
    }
  }
}