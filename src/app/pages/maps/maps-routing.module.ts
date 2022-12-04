import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapsComponent } from './maps.component';
// import { LeafletComponent } from './leaflet/leaflet.component';
import { HistoricalComponent } from './historical/historical.component';
import { PredictionComponent } from './prediction/prediction.component';

const routes: Routes = [{
  path: '',
  component: MapsComponent,
  children: [{
    path: 'historical',
    component: HistoricalComponent,
  }, {
    path: 'prediction',
    component: PredictionComponent,
  },],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapsRoutingModule { }

export const routedComponents = [
  MapsComponent,
  HistoricalComponent,
  PredictionComponent,
];
