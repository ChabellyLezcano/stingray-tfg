import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { isAuthenticatedGuard } from '../guards/is-authenticated.guard';
import { GameDetailsComponent } from './pages/game-details/game-details.component';
import { CreateGameComponent } from './pages/create-game/create-game.component';
import { AdminGuard } from '../guards/is-admin.guard';
import { EditGameComponent } from './pages/edit-game/edit-game.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { UserGuard } from '../guards/is-user.guard';
import { RecommendationsComponent } from './pages/recommendations/recommendations.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'game/:id',
    component: GameDetailsComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'create-game',
    component: CreateGameComponent,
    canActivate: [isAuthenticatedGuard, AdminGuard],
  },
  {
    path: 'edit-game/:id',
    component: EditGameComponent,
    canActivate: [isAuthenticatedGuard, AdminGuard],
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [isAuthenticatedGuard, UserGuard],
  },
  {
    path: 'recommendations',
    component: RecommendationsComponent,
    canActivate: [isAuthenticatedGuard, UserGuard],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
