import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { MarkerService } from '../../../services/marker/marker.service';
import { IndexService } from '../../../services/indices/index-service.service';

@Component({
  selector: 'ngx-total-chart-bar-animation',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class TotalChartAnimationComponent {
  options: any = {};
  themeSubscription: any;

  localityList: any = [];
  legend_data: any = [];
  legend_color: any = [];
  seriesConfig: any = [];

  items: any = [];

  dataDisplay: any = [];

  constructor(private cd: ChangeDetectorRef, private theme: NbThemeService, private markerService: MarkerService, private indexService: IndexService) {
    this.ovitrap_chart();
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  ovitrap_chart() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      this.legend_data = [];
      this.legend_color = [];


      this.indexService.getTotalPercentage().subscribe(
        oviData => {
          for (var i = 0; i < oviData.length; i++) {
            let tmp_data = {};
            this.legend_data.push(oviData[i]['locality']);
            this.legend_color.push(this.getRandomColor());
            tmp_data['value'] = oviData[i]['total'];
            tmp_data['name'] = oviData[i]['locality'];
            this.dataDisplay.push(tmp_data);
          }

          // console.log(this.dataDisplay);

          this.options = {
            backgroundColor: echarts.bg,
            color: this.legend_color,
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)',
              position: ['0%', '70%'],
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: this.legend_data,
              textStyle: {
                fontSize: 0.1,
                color: echarts.textColor,
              },
            },
            series: [
              {
                name: 'Locality',
                type: 'pie',
                radius: '80%',
                center: ['50%', '50%'],
                data: this.dataDisplay,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: echarts.itemHoverShadowColor,
                  },
                },
                label: {
                  normal: {
                    textStyle: {
                      color: echarts.textColor,
                    },
                  },
                },
                labelLine: {
                  normal: {
                    lineStyle: {
                      color: echarts.axisLineColor,
                    },
                  },
                },
              },
            ],
          };



          // for (let i = 0; i < 100; i++) {
          //   xAxisData.push('Category ' + i);
          //   data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
          // }

        }
      );

    });

  }

}
