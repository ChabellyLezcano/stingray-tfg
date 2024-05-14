import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MenuItem } from 'primeng/api';
import { User } from 'src/app/auth/interface/authInterface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  user!: User | null;
  items: MenuItem[] = [];
  dropdownItems: MenuItem[] = [];

  constructor(private authService: AuthService) {
    this.dropdownItems = this.dropdownItems.map((item) => ({
      ...item,
      styleClass: item.label === 'Logout' ? 'logout-item' : '',
    }));

    this.dropdownItems = [
      { label: 'Configuración', icon: 'pi pi-cog', routerLink: '/settings' },
      { label: 'About', icon: 'pi pi-info', routerLink: '/about' },
      { label: 'Faq', icon: 'pi pi-question', routerLink: '/faq' },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.authService.logout(),
        style: { color: 'red' },
      },
    ];
  }

  ngOnInit(): void {
    this.user = this.authService.user;

    this.buildCommonMenuItems();
    this.buildRoleSpecificMenuItems();
  }

  getStyleClass(label: string): string {
    return label === 'Logout' ? 'text-red-500' : '';
  }

  private buildCommonMenuItems(): void {
    this.items.push(
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/dashboard'],
      },
      {
        label: 'Reservations',
        icon: 'pi pi-fw pi-calendar',
        routerLink: ['/reservations'],
      },
    );
  }

  private buildRoleSpecificMenuItems(): void {
    if (this.user) {
      if (this.user.role !== 'Admin') {
        this.items.push(
          {
            label: 'Recommendations',
            icon: 'pi pi-fw pi-star',
            routerLink: ['/recommendations'],
          },
          {
            label: 'Favorites',
            icon: 'pi pi-fw pi-heart',
            routerLink: ['/favorites'],
          },
        );
      } else {
        this.items.push({
          label: 'Reservations',
          icon: 'pi pi-fw pi-star',
          routerLink: ['/admin-reservations'],
        });
      }

      if (this.user.role === 'Admin') {
        this.items.push({
          label: 'Games',
          icon: 'pi pi-fw pi-desktop',
          routerLink: ['/games'],
        });
      }
    }
  }
}
