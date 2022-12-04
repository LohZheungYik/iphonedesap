import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { getDeepFromObject } from '../../../@theme/components/auth/helpers';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { DengueCaseService } from '../../../services/dengueCase/dengue-case.service';
import { DialogShowComponent } from './dialog-name-prompt/dialog-name-prompt.component';
import { NbDialogService } from '@nebular/theme';


@Component({
  selector: 'ngx-dengue-case',
  templateUrl: './dengue-case.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class DengueCaseComponent {

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
      patient: {
        title: 'Patient Name',
        type: 'string',
      },
      address: {
        title: 'Address',
        type: 'string',
      },
      ic: {
        title: 'IC No',
        type: 'string',
      },
      age: {
        title: 'Age',
        type: 'number',
      },
      date: {
        title: 'Reported Date',
        type: 'string',
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData, protected router: Router, private dialogService: NbDialogService,
    private authService: AuthService, private caseService: DengueCaseService,
    private cd: ChangeDetectorRef, @Inject(NB_AUTH_OPTIONS) protected options = {}, ) {

    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.getDengueCase();

    if (this.authService.isLogged()) {
      this.caseService.getAllDengueCase().subscribe(
        data => {
          this.source.load(data);
        },
        e => {
          // console.log(e.error);
        }
      )
    }

  }

  getDengueCase() {
    if (this.authService.isLogged()) {
      return this.caseService.getAllDengueCase().subscribe(
        data => {
          this.source.load(data);
        })
    }
  }

  onDeleteClick(event): void {
    if (window.confirm('Are you sure you want to delete?')) {

      this.errors = [];
      this.messages = [];
      this.submitted = true;

      this.caseService.deleteDengueCase(event.data['id'])
        .subscribe(
          data => {
            // console.log(data);
            this.submitted = false;
            this.messages = ['Operation on deleting the dengue case success'];
            this.cd.detectChanges();
            this.getDengueCase();
          },
          e => {
            // console.log(e.error);
            this.submitted = false;
            this.errors = ['Operation error on deleting the dengue case'];
            this.cd.detectChanges();
            this.getDengueCase();
          }
        );

    } else {

    }
  }

  onEditClick(event) {
    this.router.navigateByUrl('/pages/surveillance/denguecase/' + event.data.id);
  }

  onCreateClick(event) {
    let tmp = this.dialogService.open(DialogShowComponent).onClose;
    tmp.subscribe(() => {
      this.getDengueCase();
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
