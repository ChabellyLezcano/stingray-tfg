import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout/layout.component';

@NgModule({
  declarations: [DashboardComponent, LayoutComponent],
  imports: [CommonModule, PrivateRoutingModule],
})
export class PrivateModule {}
