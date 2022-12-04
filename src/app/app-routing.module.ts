import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Router } from '@angular/router';


import { NgxLoginComponent } from './@theme/components/auth/login/login.component';
import { NgxLogoutComponent, NgxAuthComponent } from './@theme/components/auth';

const routes: Routes = [
  {
    path: 'pages',
    loadChildren: './pages/pages.module#PagesModule',
    // canActivate: [AuthGuardService],
  },
  {
    path: 'auth',
    component: NgxAuthComponent,
    children: [
      {
        path: '',
        component: NgxLoginComponent
      },
      {
        path: 'login',
        component: NgxLoginComponent,
      },
      // {
      //   path: 'register',
      //   component: NgxRegisterComponent,
      // },
      {
        path: 'logout',
        component: NgxLogoutComponent,
      },
      // {
      //   path: 'request-password',
      //   component: NbRequestPasswordComponent,
      // },
      // {
      //   path: 'reset-password',
      //   component: NbResetPasswordComponent,
      // },
    ],
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(router: Router) {
  }
}

export const routing = RouterModule.forRoot(routes, { useHash: false });