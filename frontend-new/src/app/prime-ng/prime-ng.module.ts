import { NgModule } from '@angular/core';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [],
  imports: [
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    ChipModule,
    DialogModule,
    DropdownModule,
    FileUploadModule,
    InputTextModule,
    MenubarModule,
    MenuModule,
    PaginatorModule,
    PasswordModule,
    ProgressSpinnerModule,
    ProgressSpinnerModule,
    SidebarModule,
    TableModule,
    ToastModule,
  ],
  exports: [
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    ChipModule,
    DialogModule,
    DropdownModule,
    FileUploadModule,
    InputTextModule,
    MenubarModule,
    MenuModule,
    PaginatorModule,
    PasswordModule,
    ProgressSpinnerModule,
    ProgressSpinnerModule,
    SidebarModule,
    TableModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class PrimeNgModule {}
