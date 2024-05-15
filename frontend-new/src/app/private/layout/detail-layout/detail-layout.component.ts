import { Location } from '@angular/common';
import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-detail-layout',
  templateUrl: './detail-layout.component.html',
  styleUrls: ['./detail-layout.component.css'],
})
export class DetailLayoutComponent {
  // Método getter para obtener el usuario
  public user = computed(() => this.authService.user);

  constructor(
    private router: Router,
    private authService: AuthService,
    public location: Location,
  ) {}
}
