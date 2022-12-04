import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { DengueCaseService } from '../../../../services/dengueCase/dengue-case.service';
import { AuthService } from '../../../../services/auth.service';
import { getDeepFromObject } from '../../../../@theme/components/auth/helpers';
import { NB_AUTH_OPTIONS } from '@nebular/auth';

@Component({
  selector: 'ngx-dialog-name-prompt',
  templateUrl: 'dialog-name-prompt.component.html',
  styleUrls: ['dialog-name-prompt.component.scss'],
})
export class DialogShowComponent {

  showMessages: any = {};
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  default:any = {};

  case:any = {};
  constructor(@Inject(NB_AUTH_OPTIONS) protected options = {}, private cd: ChangeDetectorRef, protected ref: NbDialogRef<DialogShowComponent>, 
    private caseService: DengueCaseService, private authService:AuthService) {
      let tmpDate = new Date().toISOString();
      this.default.address = 'eg. 1, Jalan Melawati 14';
      this.default.patient = 'eg. Lim Kok Wing';
      this.default.ic = 'eg. 910111011111';
      this.default.age = 'eg. 16';
      this.default.status = '1';
      this.default.infectarea = 'Jalan Melawati 14';

      this.case.date = (tmpDate).substr(0, tmpDate.length-1);
     }

  submit() {
    if (this.authService.isLogged()) {
      this.caseService.postDengueCase(this.case).subscribe(
        data => {
          // console.log("Successful create user");
          this.submitted = false;
          this.messages = ['Operation on creating the dengue case success'];
          this.cd.detectChanges();
          this.ref.close();
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

  cancel() {
    // console.log(this.dag_id);
    this.ref.close();
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
