import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [],
  imports: [
    ButtonModule,
    CardModule,
    CarouselModule,
    ChipModule,
    DialogModule,
    DropdownModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    MenubarModule,
    MenuModule,
    PaginatorModule,
    PasswordModule,
    ProgressSpinnerModule,
    ProgressSpinnerModule,
    TableModule,
    ToastModule,
  ],
  exports: [
    ButtonModule,
    CardModule,
    CarouselModule,
    ChipModule,
    DialogModule,
    DropdownModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    MenubarModule,
    MenuModule,
    PaginatorModule,
    PasswordModule,
    ProgressSpinnerModule,
    ProgressSpinnerModule,
    TableModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class PrimeNgModule {}
