import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  token: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validator: this.passwordMatchValidator,
      },
    );
  }

  passwordMatchValidator(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (
      newPassword &&
      confirmPassword &&
      newPassword.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // Method to handle the reset password submission
  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;

      this.authService
        .resetPassword(this.token, newPassword)
        .subscribe((response) => {
          if (response === true) {
            console.log(
              'Respuesta del servicio de restablecimiento de contraseña:',
              response,
            );
            Swal.fire({
              icon: 'success',
              title: '¡Contraseña restablecida!',
              text: 'Tu contraseña ha sido restablecida exitosamente.',
              confirmButtonText: 'Aceptar',
            }).then((result) => {
              if (result.value) {
                this.router.navigate(['/login']);
              }
            });
          }
        });
    }
  }
}
