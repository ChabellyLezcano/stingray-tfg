import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MenuItem } from 'primeng/api';
import { User } from 'src/app/auth/interface/authInterface';
import { Location } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  user!: User | null;
  items: MenuItem[] = [];
  dropdownItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    public location: Location,
  ) {
    this.dropdownItems = [
      { label: 'Perfil', icon: 'pi pi-user', routerLink: '/profile' },
      { label: 'About', icon: 'pi pi-info', routerLink: '/about' },
      { label: 'Faq', icon: 'pi pi-question', routerLink: '/faq' },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.authService.logout(),
        styleClass: 'text-red-500',
      },
    ];
  }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.buildCommonMenuItems();
    this.buildRoleSpecificMenuItems();
  }

  private buildCommonMenuItems(): void {
    this.items.push({
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      routerLink: ['/dashboard'],
    });
  }

  private buildRoleSpecificMenuItems(): void {
    if (this.user) {
      if (this.user.role === 'Admin') {
        this.items.push({
          label: 'Gestión de reservas',
          icon: 'pi pi-fw pi-calendar',
          routerLink: ['/reservations-admin'],
        });
      } else {
        this.items.push(
          {
            label: 'Reservas',
            icon: 'pi pi-fw pi-calendar',
            routerLink: ['/reservations-user'],
          },
          {
            label: 'Recomendaciones',
            icon: 'pi pi-fw pi-star',
            routerLink: ['/recommendations'],
          },
          {
            label: 'Favoritos',
            icon: 'pi pi-fw pi-heart',
            routerLink: ['/favorites'],
          },
        );
      }
    }
  }

  showBackButton(): boolean {
    return this.router.url !== '/dashboard';
  }
}
