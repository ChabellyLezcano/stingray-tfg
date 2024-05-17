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

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.dropdownItems = [
      { label: 'Configuración', icon: 'pi pi-cog', routerLink: '/settings' },
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
    this.items.push(
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
      {
        label: 'Reservaciones',
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

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  showBackButton(): boolean {
    return this.router.url !== '/dashboard';
  }
}
