import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { ConfirmAccountComponent } from './pages/confirm-account/confirm-account.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

@NgModule({
  declarations: [
    ConfirmAccountComponent,
    ForgotPasswordComponent,
    LandingPageComponent,
    LoginComponent,
    MainComponent,
    RegisterComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule, 
    ReactiveFormsModule
  ]
})
export class AuthModule { }
