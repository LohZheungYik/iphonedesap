import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { MapsRoutingModule, routedComponents } from './maps-routing.module';
import { HistoricalComponent } from './historical/historical.component';
import { NbDialogModule } from '@nebular/theme';
import { PredictionComponent } from './prediction/prediction.component';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  imports: [
    ThemeModule,
    LeafletModule.forRoot(),
    MapsRoutingModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
    IonicModule,
    FontAwesomeModule
  ],
  exports: [],
  declarations: [
    ...routedComponents,
    HistoricalComponent,
    PredictionComponent,
  ],
})
export class MapsModule { }
