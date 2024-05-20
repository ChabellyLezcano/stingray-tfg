import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterComponent } from './components/filter/filter.component';
import { MenuComponent } from './components/menu/menu.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FilterReservationsComponent } from './components/filter-reservations/filter-reservations.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
@NgModule({
  declarations: [
    MenuComponent,
    SearchBarComponent,
    FilterComponent,
    FilterReservationsComponent,
    PaginatorComponent,
  ],
  imports: [CommonModule, PrimeNgModule],
  exports: [
    MenuComponent,
    SearchBarComponent,
    FilterComponent,
    FilterReservationsComponent,
    PaginatorComponent,
  ],
})
export class SharedModule {}
