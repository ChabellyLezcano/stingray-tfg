import { NgModule } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CarouselModule } from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@NgModule({
  declarations: [],
  imports: [
    DialogModule,
    ButtonModule,
    SidebarModule,
    MenubarModule,
    TableModule,
    PaginatorModule,
    CarouselModule,
    DropdownModule,
    InputTextModule,
    PasswordModule,
  ],
  exports: [
    DialogModule,
    ButtonModule,
    SidebarModule,
    MenubarModule,
    TableModule,
    PaginatorModule,
    CarouselModule,
    DropdownModule,
    InputTextModule,
    PasswordModule,
  ],
})
export class PrimeNgModule {}