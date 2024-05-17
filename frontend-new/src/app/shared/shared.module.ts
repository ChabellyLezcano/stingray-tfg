import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterComponent } from './components/filter/filter.component';
import { MenuComponent } from './components/menu/menu.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
@NgModule({
  declarations: [MenuComponent, SearchBarComponent, FilterComponent],
  imports: [CommonModule, PrimeNgModule],
  exports: [MenuComponent, SearchBarComponent, FilterComponent],
})
export class SharedModule {}
