import { Component, ChangeDetectorRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Subject } from 'rxjs';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { WebsocketService } from '../../../../services/websocket/websocket.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'ngx-dialog-name-prompt',
  templateUrl: 'dialog-name-prompt.component.html',
  styleUrls: ['dialog-name-prompt.component.scss'],
  providers: [WebsocketService],
})
export class DialogShowComponent {

  dag_id: string = '';
  msg: Subject<Message>;
  SPECIFIC_DAG_URL = "";
  dag_status: any = {};
  task_status: any = {};

  constructor(private wsService: WebsocketService, private cd: ChangeDetectorRef,
    protected ref: NbDialogRef<DialogShowComponent>, private authService: AuthService) { }

  ngOnInit() {
    this.cd.detectChanges();

    let user_uuid = this.authService.getUsrUUID();

    // user_uuid = '68cfceda-0b09-4f57-96cc-143053o97654';

    this.SPECIFIC_DAG_URL = "ws://213.136.89.2:31234/socket/dags/" + user_uuid + "/" + this.dag_id;
    this.msg = <Subject<Message>>this.wsService.connect(this.SPECIFIC_DAG_URL).map(
      (response: MessageEvent): Message => {
        let data = JSON.parse(response.data);

        if (data.hasOwnProperty('dag_status')) {
          // console.log(data['dag_status']);
          this.dag_status = data['dag_status'];
        } else if (data.hasOwnProperty('task_status')) {
          // console.log(data['task_status']);
          this.task_status = data['task_status'];
        }

        this.cd.detectChanges();
        return data;
      }
    );
    this.msg.subscribe(onmessage => {
      // console.log(onmessage);
    })
  }

  cancel() {
    // console.log(this.dag_id);
    this.ref.close();
  }
}
