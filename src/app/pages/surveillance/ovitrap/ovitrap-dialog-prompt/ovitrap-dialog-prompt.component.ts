import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AuthService } from '../../../../services/auth.service';
import { getDeepFromObject } from '../../../../@theme/components/auth/helpers';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { OvitrapService } from '../../../../services/ovitrap/ovitrap.service';

@Component({
  selector: 'ngx-ovitrap-dialog-prompt',
  templateUrl: 'ovitrap-dialog-prompt.component.html',
  styleUrls: ['ovitrap-dialog-prompt.component.scss'],
})

export class OvitrapDialogComponent {

  showMessages: any = {};
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  default: any = {};
  ovitrap: any = {};

  constructor(@Inject(NB_AUTH_OPTIONS) protected options = {}, private cd: ChangeDetectorRef, protected ref: NbDialogRef<OvitrapDialogComponent>,
    private ovitrapService: OvitrapService, private authService: AuthService) {
    this.default.location = 'eg. Jalan Melawati 14';
    this.default.timeinstall = 'Select the Mosquito Home Install Date';
    this.default.timeremove = 'Select the Mosquito Home Remove Date';
  }

  convertDate(input: String) {
    var mnths = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    },
      date = input.split(" ");

    return [date[3], mnths[date[1]], date[2]].join("-");
  }

  

  submit() {

    this.ovitrap.weekepidinstall = this.ovitrap.timeinstall.getWeek();
    this.ovitrap.weekepidremove = this.ovitrap.timeremove.getWeek();
    this.ovitrap.timeinstall = this.convertDate(String(this.ovitrap.timeinstall))
    this.ovitrap.timeremove = this.convertDate(String(this.ovitrap.timeremove))
    if (this.authService.isLogged()) {
      this.ovitrapService.postOvitrap(this.ovitrap).subscribe(
        data => {
          // console.log("Successful create user");
          this.submitted = false;
          this.messages = ['Operation on creating the mosquito home sentinel success'];
          this.cd.detectChanges();
          this.ref.close();
        },
        e => {
          // console.log(e.error);
          this.submitted = false;
          this.errors = ['Operation error on creating the mosquito home sentinel'];
          this.cd.detectChanges();
        }
      )
    }
  }

  cancel() {
    // console.log(this.dag_id);
    this.ref.close();
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}

declare global {
  interface Date {
      getWeek(): any;
  }
}

Date.prototype.getWeek = function() {
  var onejan:any = new Date(this.getFullYear(),0,1);
  var today:any = new Date(this.getFullYear(),this.getMonth(),this.getDate());
  var dayOfYear:any = ((today - onejan +1)/86400000);
  return Math.ceil(dayOfYear/7)
};