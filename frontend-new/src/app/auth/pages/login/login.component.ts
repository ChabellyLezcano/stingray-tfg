import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')!.value;
      const password = this.loginForm.get('password')!.value;
      
      // Llama al método de inicio de sesión del servicio de autenticación
      this.authService.login(email, password)
        .subscribe(
          success => {
            // Maneja el inicio de sesión exitoso
            console.log('Inicio de sesión exitoso');
            // Redirige a la página deseada después del inicio de sesión
          },
          error => {
            // Maneja el error de inicio de sesión
            this.errorMessage = 'Error en el inicio de sesión: ' + error;
            console.error('Error en el inicio de sesión', error);
            // Muestra un mensaje de error al usuario
          }
        );
    }
  }
}
