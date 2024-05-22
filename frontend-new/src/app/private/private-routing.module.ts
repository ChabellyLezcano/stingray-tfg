import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '../guards/is-admin.guard';
import { UserGuard } from '../guards/is-user.guard';
import { isAuthenticatedGuard } from '../guards/is-authenticated.guard';

import { CreateGameComponent } from './pages/create-game/create-game.component';
import { CreateReviewComponent } from './pages/create-review/create-review.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditGameComponent } from './pages/edit-game/edit-game.component';
import { EditReviewComponent } from './pages/edit-review/edit-review.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { GameDetailsComponent } from './pages/game-details/game-details.component';
import { RecommendationsComponent } from './pages/recommendations/recommendations.component';
import { ReservationsAdminComponent } from './pages/reservations-admin/reservations-admin.component';
import { ReservationsUserComponent } from './pages/reservations-user/reservations-user.component';

const routes: Routes = [
  {
    path: 'create-game',
    component: CreateGameComponent,
    canActivate: [isAuthenticatedGuard, AdminGuard],
  },
  {
    path: 'create-review/:id',
    component: CreateReviewComponent,
    canActivate: [isAuthenticatedGuard, AdminGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'edit-game/:id',
    component: EditGameComponent,
    canActivate: [isAuthenticatedGuard, AdminGuard],
  },
  {
    path: 'edit-review/:id',
    component: EditReviewComponent,
    canActivate: [isAuthenticatedGuard, AdminGuard],
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [isAuthenticatedGuard, UserGuard],
  },
  {
    path: 'game/:id',
    component: GameDetailsComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'recommendations',
    component: RecommendationsComponent,
    canActivate: [isAuthenticatedGuard, UserGuard],
  },
  {
    path: 'reservations-admin',
    component: ReservationsAdminComponent,
    canActivate: [isAuthenticatedGuard, AdminGuard],
  },
  {
    path: 'reservations-user',
    component: ReservationsUserComponent,
    canActivate: [isAuthenticatedGuard, UserGuard],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
