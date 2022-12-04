import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ThemeModule } from '../../@theme/theme.module';
import { ChartModule } from 'angular2-chartjs';


import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { DashboardComponent } from './dashboard.component';
import { IndexChartComponent } from './index-chart/index-chart.component';
import { IndexChartAnimationComponent } from './index-chart/index-chart-bar-animation.component';
import { HouseIndexChartComponent } from './house-index-chart/house-index-chart.component';
import { HouseIndexChartAnimationComponent } from './house-index-chart/house-index-chart-bar-animation.component';
import { LarvalIndexChartComponent } from './larval-index-chart/larval-index-chart.component';
import { LarvalIndexChartAnimationComponent } from './larval-index-chart/larval-index-chart-bar-animation.component';
import { TotalIndexChartComponent } from './total-index-chart/total-index-chart.component';
import { TotalChartAnimationComponent } from './total-index-chart/total-index-chart-bar-animation.component';
import { SimpleDataComponent } from './simple-data/simple-data.component';
import { FCM } from '@ionic-native/fcm/ngx';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    ThemeModule,
    ChartModule,
    NgxEchartsModule,
    NgxChartsModule,
    LeafletModule,
    IonicModule
  ],
  declarations: [
    DashboardComponent,
    // StatsCardFrontComponent,
    // StatsAreaChartComponent,
    // StatsBarAnimationChartComponent,
    // ProfitCardComponent,
    // ECommerceChartsPanelComponent,
    // ChartPanelHeaderComponent,
    // ChartPanelSummaryComponent,
    // OrdersChartComponent,
    // ProfitChartComponent,
    // StatsCardBackComponent,
    // TrafficRevealCardComponent,
    // TrafficBarChartComponent,
    // TrafficFrontCardComponent,
    // TrafficBackCardComponent,
    // TrafficBarComponent,
    // TrafficCardsHeaderComponent,
    // CountryOrdersComponent,
    // CountryOrdersMapComponent,
    // CountryOrdersChartComponent,
    // ECommerceVisitorsAnalyticsComponent,
    // ECommerceVisitorsAnalyticsChartComponent,
    // ECommerceVisitorsStatisticsComponent,
    // ECommerceLegendChartComponent,
    // ECommerceUserActivityComponent,
    // ECommerceProgressSectionComponent,
    // SlideOutComponent,
    // EarningCardComponent,
    // EarningCardFrontComponent,
    // EarningCardBackComponent,
    // EarningPieChartComponent,
    // EarningLiveUpdateChartComponent,
    IndexChartComponent,
    IndexChartAnimationComponent,
    HouseIndexChartComponent,
    HouseIndexChartAnimationComponent,
    LarvalIndexChartComponent,
    LarvalIndexChartAnimationComponent,
    TotalIndexChartComponent,
    TotalChartAnimationComponent,
    SimpleDataComponent,
  ],
  providers: [
    // CountryOrdersMapService,
    FCM
  ],
})
export class DashboardModule { }
