import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    // Initialize the forgot password form with an email field
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Method to handle form submission
  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const emailControl = this.forgotPasswordForm.get('email');
      if (emailControl) {
        const email = emailControl.value;
        this.authService.forgotPassword(email).subscribe((response) => {
          console.log(
            'Respuesta del servicio de olvido de contraseña:',
            response,
          );
          if (response === true) {
            Swal.fire({
              icon: 'success',
              title: 'Correo enviado',
              text: 'Un enlace para restablecer la contraseña ha sido enviado a tu correo electrónico. Por favor revisa tu bandeja de entrada.',
              confirmButtonText: 'Aceptar',
            });
          }
        });
      }
    }
  }
}
