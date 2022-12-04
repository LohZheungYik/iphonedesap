import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../../guard/role/role.guard';
import { SchedulerComponent } from './scheduler.component';
import { StatusComponent } from './status/status.component';

const routes: Routes = [{
  path: '',
  component: SchedulerComponent,
  children: [{
    path: 'status',
    component: StatusComponent,
    canActivate: [RoleGuard],
    data: {
      permission: {
        only: ['1', '3'],
        redirectTo: '/pages/noauth'
      }
    },
  },],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchedulerRoutingModule { }

export const routedComponents = [

];