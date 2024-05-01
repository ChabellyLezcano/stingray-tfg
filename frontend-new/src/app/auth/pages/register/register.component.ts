import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    // Initialize the register form
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      validatePassword: ['', Validators.required],
      birthDate: ['', Validators.required],
      sex: ['', [Validators.required, Validators.pattern(/^(M|F|Otro)$/)]],
    });
  }

  ngOnInit(): void {}

  // Method to handle the register submission
  register() {
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      const { email, username, password, birthDate, sex } =
        this.registerForm.value;
      this.authService
        .register(email, username, password, birthDate, sex)
        .subscribe((response: any) => {
          if (response === true) {
            console.log('Registro exitoso');
            // Mostrar Sweet Alert de éxito y confirmación de correo
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
