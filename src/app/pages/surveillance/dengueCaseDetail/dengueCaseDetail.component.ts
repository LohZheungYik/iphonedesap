import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { getDeepFromObject } from '../../../@theme/components/auth/helpers';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { OvitrapService } from '../../../services/ovitrap/ovitrap.service';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { DengueCaseService } from '../../../services/dengueCase/dengue-case.service';
import { CaseDialogComponent } from './case-dialog-prompt/case-dialog-prompt.component';

@Component({
  selector: 'ngx-case-detail',
  templateUrl: './dengueCaseDetail.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class DengueCaseDetailComponent {

  showMessages: any = {};
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  default: any = {};
  case: any = {};
  caseID: any;

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
      location: {
        title: 'Locality',
        type: 'string',
      },
      weekepidinstall: {
        title: 'Epid Week Install',
        type: 'string',
      },
      timeinstall: {
        title: 'Date Mosquito Home Install',
        type: 'string',
      },
      weekepidremove: {
        title: 'Epid Week Remove',
        type: 'string',
      },
      timeremove: {
        title: 'Date Mosquito Home Remove',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(@Inject(NB_AUTH_OPTIONS) protected options = {}, private cd: ChangeDetectorRef, private authService: AuthService,
    private service: SmartTableData, protected router: Router, private dialogService: NbDialogService,
    private ovitrapService: OvitrapService, private route: ActivatedRoute,
    private caseService: DengueCaseService) {

    this.route.paramMap.subscribe(params => {
      this.caseID = params.get("id")
    })

    this.default.address = 'eg. 1, Jalan Melawati 14';
    this.default.patient = 'eg. Lim Kok Wing';
    this.default.ic = 'eg. 910111011111';
    this.default.age = 'eg. 16';
    this.default.status = '1';
    this.default.infectarea = 'Jalan Melawati 14';

    this.showMessages = this.getConfigValue('forms.login.showMessages');
    if (this.authService.isLogged()) {
      this.caseService.getDengueCase({
        "id": this.caseID
      }).subscribe(data => {
        this.case = data[0];
        this.case.date = this.case.date.split('Z')[0];

      }, e => {
        // console.log(e.error);
      })
      this.getOvitrap();

    }
  }

  getOvitrap() {
    return this.ovitrapService.getOvitrap({
      "denguecase": this.caseID
    }).subscribe(
      data => {
        data.forEach(element => {
          element.timeinstall = element.timeinstall.split("T")[0]
          element.timeremove = element.timeremove.split("T")[0]
        });
        this.source.load(data);
      },
      e => {
        // console.log(e.error);
      }
    )
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

      this.ovitrapService.deleteOvitrap(event.data['id'])
        .subscribe(
          data => {
            // console.log(data);
            this.submitted = false;
            this.messages = ['Operation on deleting the dengue case success'];
            this.cd.detectChanges();
            this.getOvitrap();
          },
          e => {
            // console.log(e.error);
            this.submitted = false;
            this.errors = ['Operation error on deleting the dengue case'];
            this.cd.detectChanges();
            this.getOvitrap();
          }
        );

    } else {

    }
  }

  onEditClick(event) {
    this.router.navigateByUrl('/pages/surveillance/ovitrapsentinel/' + event.data.id);
  }

  onCreateClick(event) {
    let tmp = this.dialogService.open(CaseDialogComponent, { context: { caseID: this.caseID } }).onClose;
    tmp.subscribe(() => {
      this.getOvitrap();
    })
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  submit() {
    if (this.authService.isLogged()) {
      this.caseService.putDengueCase(this.case).subscribe(
        data => {
          // console.log("Successful create user");
          this.submitted = false;
          this.messages = ['Operation on creating the dengue case success'];
          this.cd.detectChanges();
        },
        e => {
          // console.log(e.error);
          this.submitted = false;
          this.errors = ['Operation error on creating the dengue case'];
          this.cd.detectChanges();
        }
      )
    }

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