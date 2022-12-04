import { Component, ChangeDetectorRef } from '@angular/core';
import { IndexService } from '../../../services/indices/index-service.service';

@Component({
  selector: 'ngx-simple-data',
  templateUrl: './simple-data.component.html',
  styleUrls: ['./simple-data.component.scss']
})
export class SimpleDataComponent {

  displayData: any = {};

  constructor(private indexService: IndexService, private cd: ChangeDetectorRef) {
    this.getTotalAnalysis();
  }

  numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  getTotalAnalysis() {

    this.indexService.getTotalAnalysis().subscribe(
      data => {
        data.forEach(element => {
          if (element.hasOwnProperty('totalCup')) {
            this.displayData.ovitrap = this.numberWithCommas(element.totalCup);
          } else if (element.hasOwnProperty('totalEgg')) {
            this.displayData.egg = this.numberWithCommas(element.totalEgg);
          } else if (element.hasOwnProperty('totalLarvae')) {
            this.displayData.larvae = this.numberWithCommas(element.totalLarvae);
          } else if (element.hasOwnProperty('positiveCup')) {
            this.displayData.positive = this.numberWithCommas(element.positiveCup);
          }
        });
        this.cd.detectChanges();
      }
    )
  }

}
