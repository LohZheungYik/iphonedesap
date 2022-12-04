import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { getDeepFromObject } from '../../../@theme/components/auth/helpers';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CupDialogComponent } from './cup-dialog-prompt/cup-dialog-prompt.component';
import { NbDialogService } from '@nebular/theme';
import { OvitrapService } from '../../../services/ovitrap/ovitrap.service';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { CupService } from '../../../services/cup/cup.service';
import { CupEditDialogComponent } from './cup-edit-dialog-prompt/cup-edit-dialog-prompt.component';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'ngx-ovitrap-detail',
  templateUrl: './ovitrapDetail.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class OvitrapDetailComponent {

  showMessages: any = {};
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  default: any = {};
  ovitrap: any = {};
  ovitrapID: any;

  analysis: any = {};

  settings = {
    mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-search"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      no: {
        title: 'Cup No',
        type: 'number',
        width: '50px'
      },
      address: {
        title: 'Address',
        type: 'string',
      },
      placement: {
        title: 'Cup Placement',
        type: 'string',
        width: '150px'
      },
      statusStr: {
        title: 'Cup Status',
        type: 'string',
        width: '100px'
      },
      gpsy: {
        title: 'GPS Latitude',
        type: 'number',
        width: '100px'
      },
      gpsx: {
        title: 'GPS Longitude',
        type: 'number',
        width: '100px'
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(@Inject(NB_AUTH_OPTIONS) protected options = {}, private cd: ChangeDetectorRef, private authService: AuthService,
    private service: SmartTableData, protected router: Router, private dialogService: NbDialogService,
    private ovitrapService: OvitrapService, private route: ActivatedRoute,
    private cupService: CupService) {

    this.route.paramMap.subscribe(params => {
      this.ovitrapID = params.get("id")
    })

    this.default.location = 'eg. Jalan Melawati 14';
    this.default.timeinstall = 'Select the Mosquito Home Install Date';
    this.default.timeremove = 'Select the Mosquito Home Remove Date';

    this.showMessages = this.getConfigValue('forms.login.showMessages');
    if (this.authService.isLogged()) {
      this.ovitrapService.getOvitrap({
        "id": this.ovitrapID
      }).subscribe(data => {
        this.ovitrap = data[0];
        this.ovitrap.timeinstall = new Date(this.ovitrap.timeinstall.split('T')[0]);
        this.ovitrap.timeremove = new Date(this.ovitrap.timeremove.split('T')[0]);

      }, e => {
        // console.log(e.error);
      })
      this.getCup();
    }
  }

  getCup() {
    return this.cupService.getCup({ "ovitrap_id": this.ovitrapID }).subscribe(
      data => {
        data.forEach(element => {
          switch (element.status) {
            case 0:
              element.statusStr = "Installed "
              break;
            case 1:
              element.statusStr = "Positive"
              break;
            case 2:
              element.statusStr = "Negative"
              break;
            case 3:
              element.statusStr = "Lost"
              break;
            case 4:
              element.statusStr = "Broken"
              break;
            case 5:
              element.statusStr = "Collected"
              break;
            default:
              break;
          }

          switch (element.door) {
            case 1:
              element.placement = "Outdoor"
              break;
            case 2:
              element.placement = "Indoor"
              break;
            case 3:
              element.placement = "Semi-Indoor"
              break;
            default:
              break;
          }
        });
        this.source.load(data);
        this.ovitrapAnalysis(data);

        if (history.state.data) {
          let ovitrapData = history.state.data;
          console.log(ovitrapData);
          this.dialogService.open(CupEditDialogComponent,
            { context: { ovitrap_id: this.ovitrapID, data: data.find(e => e.id == ovitrapData.cupID) } }).onClose;
        }
      },
      e => {
        // console.log(e.error);
      })
  }

  convertDate(input: String) {
    var mnths = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    },
      date = input.split(" ");

    return [date[3], mnths[date[1]], date[2]].join("-");
  }

  onDeleteClick(event): void {
    if (window.confirm('Are you sure you want to delete?')) {

      this.errors = [];
      this.messages = [];
      this.submitted = true;

      this.cupService.deleteCup(event.data['id'])
        .subscribe(
          data => {
            // console.log(data);
            this.submitted = false;
            this.messages = ['Operation on deleting the cup success'];
            this.cd.detectChanges();
            this.getCup();
          },
          e => {
            // console.log(e.error);
            this.submitted = false;
            this.errors = ['Operation error on deleting the cup'];
            this.cd.detectChanges();
            this.getCup();
          }
        );

    } else {

    }
  }

  onEditClick(event) {
    let tmp = this.dialogService.open(CupEditDialogComponent, { context: { ovitrap_id: this.ovitrapID, data: event.data } }).onClose;
    tmp.subscribe(() => {
      this.getCup();
    })
  }

  onCreateClick(event) {
    let tmp = this.dialogService.open(CupDialogComponent, { context: { ovitrap_id: this.ovitrapID } }).onClose;
    tmp.subscribe(() => {
      this.getCup();
    })
  }

  handleDateChange(event, variable) {
    if (variable == 'timeinstall') {
      this.ovitrap.weekepidinstall = event.getWeek();
    }
    else if (variable == 'timeremove') {
      this.ovitrap.weekepidremove = event.getWeek();
    }
  }

  submit() {
    let timeinstall = this.ovitrap.timeinstall;
    let timeremove = this.ovitrap.timeremove;
    this.ovitrap.timeinstall = this.convertDate(String(this.ovitrap.timeinstall))
    this.ovitrap.timeremove = this.convertDate(String(this.ovitrap.timeremove))
    if (this.authService.isLogged()) {
      this.ovitrapService.putOvitrap(this.ovitrap).subscribe(
        data => {
          // console.log("Successful create user");
          this.submitted = false;
          this.messages = ['Operation on updating the mosquito home sentinel success'];
          this.cd.detectChanges();
        },
        e => {
          // console.log(e.error);
          this.submitted = false;
          this.errors = ['Operation error on updating the mosquito home sentinel'];
          this.cd.detectChanges();
        }
      )
    }
    this.ovitrap.timeinstall = timeinstall
    this.ovitrap.timeremove = timeremove

  }

  ovitrapAnalysis(data) {
    this.analysis.egg = 0;
    this.analysis.larvae = 0;
    this.analysis.install = data.length;
    this.analysis.collect = data.filter(element => (element.status == 1 || element.status == 2 || element.status == 5)).length;
    this.analysis.lost = data.filter(element => element.status == 3).length;
    this.analysis.broken = data.filter(element => element.status == 4).length;
    this.analysis.positive = data.filter(element => element.status == 1).length;
    this.analysis.index = ((this.analysis.positive / this.analysis.collect) * 100).toFixed(2);
    data.forEach(element => {
      if (element.egg == null && element.status == 1) {
        this.analysis.egg += 0
      } else {
        this.analysis.egg += element.egg;
      }

      if (element.larvae == null && element.status == 1) {
        this.analysis.larvae += 0
      } else {
        this.analysis.larvae += element.larvae;
      }
    });

  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  doRefresh(event) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 500);
  }
}

declare global {
  interface Date {
    getWeek(): any;
  }
}

Date.prototype.getWeek = function () {
  var onejan: any = new Date(this.getFullYear(), 0, 1);
  var today: any = new Date(this.getFullYear(), this.getMonth(), this.getDate());
  var dayOfYear: any = ((today - onejan + 1) / 86400000);
  return Math.ceil(dayOfYear / 7)
};