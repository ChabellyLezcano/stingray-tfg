import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { isAuthenticatedGuard } from '../guards/is-authenticated.guard';
import { GameDetailsComponent } from './pages/game-details/game-details.component';
import { CreateGameComponent } from './pages/create-game/create-game.component';
import { AdminGuard } from '../guards/is-admin.guard';
import { EditGameComponent } from './pages/edit-game/edit-game.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { RecommendationsComponent } from './pages/recommendations/recommendations.component';
import { EditReviewComponent } from './pages/edit-review/edit-review.component';
import { ReservationsAdminComponent } from './pages/reservations-admin/reservations-admin.component';
import { ReservationsUserComponent } from './pages/reservations-user/reservations-user.component';
import { AddReviewComponent } from './pages/add-review/add-review.component';

const routes: Routes = [
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
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'recommendations',
    component: RecommendationsComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'add-review/:id',
    component: AddReviewComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'edit-review/:id',
    component: EditReviewComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'reservations-admin',
    component: ReservationsAdminComponent,
    canActivate: [isAuthenticatedGuard, AdminGuard],
  },
  {
    path: 'reservations-user',
    component: ReservationsUserComponent,
    canActivate: [isAuthenticatedGuard],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
