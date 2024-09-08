import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  sexOptions: any[];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['Password123', [Validators.required, Validators.minLength(8)]],
      validatePassword: ['Password123', Validators.required],
      birthDate: ['', Validators.required],
      sex: ['F', [Validators.required, Validators.pattern(/^(M|F|O)$/)]],
    });

    this.sexOptions = [
      { label: 'Masculino', value: 'M' },
      { label: 'Femenino', value: 'F' },
      { label: 'Otro', value: 'O' },
    ];
  }

  register() {
    if (this.registerForm.valid) {
      const { email, username, password, birthDate, sex } =
        this.registerForm.value;
      this.authService
        .register(email, username, password, birthDate, sex)
        .subscribe((response: any) => {
          if (response === true) {
            Swal.fire({
              icon: 'success',
              title: '¡Registro exitoso!',
              text: 'Por favor, revise su correo electrónico para confirmar su cuenta.',
            });
          }
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El formulario no es válido. Por favor, completa todos los campos correctamente.',
      });
    }
  }
}
