import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './components/menu/menu.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@NgModule({
  declarations: [MenuComponent, SearchBarComponent],
  imports: [CommonModule, PrimeNgModule],
  exports: [MenuComponent, SearchBarComponent],
})
export class SharedModule {}
