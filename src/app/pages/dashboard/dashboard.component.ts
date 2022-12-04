import { Component } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  constructor(private fcm: FCM) {
    this.subscribeToNotification();
  }

  subscribeToNotification() {
    if (localStorage.getItem('Subscribed') == 'true')
      this.fcm.subscribeToTopic('prediction');
    else
      this.fcm.unsubscribeFromTopic('prediction');
  }

  doRefresh(event) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 500);
  }
}
