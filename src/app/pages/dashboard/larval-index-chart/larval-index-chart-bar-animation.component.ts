import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { MarkerService } from '../../../services/marker/marker.service';
import { IndexService } from '../../../services/indices/index-service.service';
import * as _ from 'lodash';
import { OvitrapService } from '../../../services/ovitrap/ovitrap.service';

@Component({
  selector: 'ngx-larval-index-chart-bar-animation',
  template: `
    <p style="padding-left: 1em;"><b>Filter Option: </b></p>
      <select style="width:300px;" (change)="onSelectClick($event.target.value)" class="form-control" name='locality'
        placeholder="Select Locality">
        <option [ngValue]="">Select Locality</option>
        <option *ngFor="let item of items;" [ngValue]="item">{{item}}</option>
      </select>
      <br><br>
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class LarvalIndexChartAnimationComponent {
  options: any = {};
  themeSubscription: any;

  localityList: any = [];
  legend_data: any = [];
  legend_color: any = [];
  seriesConfig: any = [];

  items: any = [];

  dataDisplay: any = [];

  constructor(private cd: ChangeDetectorRef, private ovitrapService: OvitrapService, private theme: NbThemeService, private markerService: MarkerService, private indexService: IndexService) {
    this.getLocality();
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  ovitrap_chart(locality) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      let xAxisData = [];
      let data1 = [];

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      this.legend_data = [];
      this.legend_color = [];
      this.seriesConfig = [];
      if (locality == '') {
        xAxisData = [];
        data1 = [];
      } else {
        this.indexService.getLarvalIndex(locality).subscribe(
          oviData => {

            for (var i = 0; i < oviData.length; i++) {
              xAxisData.push(oviData[i]['collect_date'].split("T")[0]);
              data1.push(oviData[i]['index']);
            }
            // console.log(data1);


            var tmp_color = colors.primaryLight;
            var tmp_seriesConfig = {
              name: locality,
              type: 'bar',
              data: data1,
              animationDelay: idx => idx * 0 + 10,
            };
            this.legend_data.push(locality);
            this.legend_color.push(tmp_color);
            this.seriesConfig.push(tmp_seriesConfig);

            // console.log(this.legend_data);

            this.options = {
              backgroundColor: echarts.bg,
              color: this.legend_color,
              legend: {
                data: this.legend_data,
                align: 'left',
                textStyle: {
                  color: echarts.textColor,
                },
              },
              tooltip: {
                axisPointer: {
                  type: 'shadow',
                },
                textStyle: {
                  color: '#2a2a2a',
                  fontWeight: '400',
                  fontSize: '16',
                },
                position: 'top',
                backgroundColor: '#eef2f5',
                borderColor: '#eef2f5',
                borderWidth: '3',
                formatter: params => `${params.value} %`,
                extraCssText: 'border-radius: 10px; padding: 4px 16px;',
              },
              xAxis: [
                {
                  data: xAxisData,
                  silent: false,
                  axisTick: {
                    alignWithLabel: true,
                  },
                  axisLine: {
                    lineStyle: {
                      color: echarts.axisLineColor,
                    },
                  },
                  axisLabel: {
                    textStyle: {
                      color: echarts.textColor,
                    },
                  },
                },
              ],
              yAxis: [
                {
                  axisLine: {
                    lineStyle: {
                      color: echarts.axisLineColor,
                    },
                  },
                  splitLine: {
                    lineStyle: {
                      color: echarts.splitLineColor,
                    },
                  },
                  axisLabel: {
                    textStyle: {
                      color: echarts.textColor,
                    },
                  },
                },
              ],
              series: this.seriesConfig,
              animationEasing: 'elasticOut',
              animationDelayUpdate: idx => idx * 5,
            };



            // for (let i = 0; i < 100; i++) {
            //   xAxisData.push('Category ' + i);
            //   data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
            // }

          }
        );
      }
    });

  }

  getLocality() {
    this.ovitrapService.getAllOvitrap().subscribe(
      data => {
        let rslt = _(data)
          .groupBy(x => x.location)
          .map((value, key) => ({ group: key, arr: value }))
          .value();
        this.localityList = rslt;
        this.localityList.forEach(element => {
          this.items.push(element.group)
        });
        this.items.sort()
        this.ovitrap_chart('');
      }
      , e => {
        // console.log(e)
      });
  }

  onSelectClick(event) {
    // console.log(event);
    this.ovitrap_chart(event);
  }

}
