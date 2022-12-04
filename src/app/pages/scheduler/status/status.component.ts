import { Component, ChangeDetectorRef, Inject, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';

import { AuthService } from '../../../services/auth.service';
import { getDeepFromObject } from '../../../@theme/components/auth/helpers';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Subject } from 'rxjs';
import { DialogShowComponent } from './dialog-name-prompt/dialog-name-prompt.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-status',
  templateUrl: './status.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
  providers: [WebsocketService],
})
export class StatusComponent implements OnInit {

  showMessages: any = {};
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;

  settings = {
    actions: false,
    columns: {
      dag_id: {
        title: 'Dag ID',
        type: 'number',
        editable: false,
        addable: false,
      },
      execution_date: {
        title: 'Execution Date',
        type: 'string',
      },
      status: {
        title: 'Dag Status',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  DAG_URL = "";

  msg: Subject<Message>;

  constructor(private service: SmartTableData,
    private wsService: WebsocketService, private dialogService: NbDialogService, private authService: AuthService,
    private cd: ChangeDetectorRef, @Inject(NB_AUTH_OPTIONS) protected options = {}, ) {

    this.showMessages = this.getConfigValue('forms.login.showMessages');

  }

  ngOnInit() {
    if (this.authService.isLogged()) {

      let user_uuid = this.authService.getUsrUUID();
      // user_uuid = '68cfceda-0b09-4f57-96cc-143053o97654';

      this.DAG_URL = "ws://213.136.89.2:31234/socket/dags/" + user_uuid;
      this.msg = <Subject<Message>>this.wsService.connect(this.DAG_URL).map(
        (response: MessageEvent): Message => {
          let data = JSON.parse(response.data);
          this.source.load(data['all_dag']);
          return data;
        }
      );
      this.msg.subscribe(onmessage => {
        // console.log(onmessage);
      })
    }
  }

  onUserRowSelect(event) {
    // console.log(event.data)
    this.dialogService.open(DialogShowComponent, { context: { dag_id: event.data['dag_id'] } }).onClose;
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }


}
