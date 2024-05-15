import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { SharedModule } from '../shared/shared.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { GameDetailsComponent } from './pages/game-details/game-details.component';
import { DetailLayoutComponent } from './layout/detail-layout/detail-layout.component';

@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
    GameDetailsComponent,
    DetailLayoutComponent,
  ],
  imports: [CommonModule, PrivateRoutingModule, SharedModule, PrimeNgModule],
})
export class PrivateModule {}
