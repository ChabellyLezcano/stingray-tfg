import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { isAuthenticatedGuard } from '../guards/is-authenticated.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [isAuthenticatedGuard],
    children: [{ path: 'dashboard', component: DashboardComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}