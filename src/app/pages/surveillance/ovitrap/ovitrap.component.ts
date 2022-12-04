import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { getDeepFromObject } from '../../../@theme/components/auth/helpers';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { OvitrapDialogComponent } from './ovitrap-dialog-prompt/ovitrap-dialog-prompt.component';
import { NbDialogService } from '@nebular/theme';
import { OvitrapService } from '../../../services/ovitrap/ovitrap.service';


@Component({
  selector: 'ngx-ovitrap',
  templateUrl: './ovitrap.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class OvitrapComponent {

  showMessages: any = {};
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;

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

  constructor(private service: SmartTableData, protected router: Router, private dialogService: NbDialogService,
    private authService: AuthService, private caseService: OvitrapService,
    private cd: ChangeDetectorRef, @Inject(NB_AUTH_OPTIONS) protected options = {}, ) {

    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.getOvitrap();

  }

  getOvitrap() {
    if (this.authService.isLogged()) {
      return this.caseService.getAllOvitrap().subscribe(
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
  }

  onDeleteClick(event): void {
    if (window.confirm('Are you sure you want to delete?')) {

      this.errors = [];
      this.messages = [];
      this.submitted = true;

      this.caseService.deleteOvitrap(event.data['id'])
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
    let tmp = this.dialogService.open(OvitrapDialogComponent).onClose;
    tmp.subscribe(() => {
      this.getOvitrap();
    })
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
