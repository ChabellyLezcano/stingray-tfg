import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateGameComponent } from './pages/create-game/create-game.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GameDetailsComponent } from './pages/game-details/game-details.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { PrivateRoutingModule } from './private-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EditGameComponent } from './pages/edit-game/edit-game.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FavoritesComponent } from './pages/favorites/favorites.component';

@NgModule({
  declarations: [
    CreateGameComponent,
    DashboardComponent,
    GameDetailsComponent,
    LayoutComponent,
    EditGameComponent,
    FavoritesComponent,
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    PrivateRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class PrivateModule {}
