import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { isAuthenticatedGuard } from '../guards/is-authenticated.guard';
import { GameDetailsComponent } from './pages/game-details/game-details.component';

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
  { path: '**', redirectTo: 'dashboard' }, // Ruta de redirección por defecto
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
