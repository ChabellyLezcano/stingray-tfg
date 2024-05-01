import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  // Método getter para obtener el usuario
  public user = computed(() => this.authService.user);

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}
}
