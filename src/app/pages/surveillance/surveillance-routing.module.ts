import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveillanceComponent } from './surveillance.component';
import { DengueCaseComponent } from './dengue-case/dengue-case.component';
import { OvitrapComponent } from './ovitrap/ovitrap.component';
import { OvitrapDetailComponent } from './ovitrapDetail/ovitrapDetail.component';
import { DengueCaseDetailComponent } from './dengueCaseDetail/dengueCaseDetail.component';

const routes: Routes = [{
  path: '',
  component: SurveillanceComponent,
  children: [{
    path: '',
    component: DengueCaseComponent,
  },{
    path: 'denguecase',
    children:[{
      path:'',
      component: DengueCaseComponent,
    },{
      path:':id',
      component:DengueCaseDetailComponent,

    }]
  }, {
    path: 'ovitrapsentinel',
    children:[{
      path:'',
      component: OvitrapComponent,
    },{
      path:':id',
      component:OvitrapDetailComponent,

    }]
    
  },],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveillanceRoutingModule { }

export const routedComponents = [
  SurveillanceComponent,
];
