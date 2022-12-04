import { Component, ChangeDetectorRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { UserService } from '../../../services/user/user-service.service';
import { AuthService } from '../../../services/auth.service';

import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { getDeepFromObject } from '../../../@theme/components/auth/helpers';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {


  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;

  user: any = {};
  userImage: File = null;

  public imagePath;
  imgURL: any;
  image: any = "";

  isSubscribed: any = false;

  constructor(@Inject(NB_AUTH_OPTIONS) protected options = {},
    private userService: UserService, private authService: AuthService,
    private cd: ChangeDetectorRef, protected router: Router,
    private fcm: FCM) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.strategy = this.getConfigValue('forms.login.strategy');

    this.getUserDetail();
  }

  getUserDetail() {
    if (this.authService.isLogged()) {
      this.userService.getUser(this.authService.getUserId()).subscribe(
        data => {
          this.user.username = data['data']['username'];
          this.user.firstName = data['data']['first_name'];
          this.user.lastName = data['data']['last_name'];
          this.user.password = "";
          this.user.confirmPassword = "";
          this.user.phone = data['data']['phone_no'];
          this.user.role = data['data']['role_id'];
          this.user.email = data['data']['email'];
          if (data['data']['image'] != null) {
            this.imgURL = data['data']['image'];
            this.image = this.imgURL;
          } else {
            this.imgURL = "";
          }
          if (localStorage.getItem('Subscribed') != "null") {
            if (localStorage.getItem('Subscribed') == "true")
              this.isSubscribed = true;
            else
              this.isSubscribed = false;
          } else {

          }
          this.cd.detectChanges();
          this.subscribeToNotification();
        },
        r => {
          // console.log(r.error);
        }
      )
    }
  }

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.imagePath = event.target.files;
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.imgURL = reader.result; //add source to image
        this.image = JSON.stringify(reader.result);
      }

    }
  }

  update() {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    if (this.authService.isLogged()) {

      this.userService.updateUser(this.authService.getUserId(), this.user, this.image)
        .subscribe(
          data => {
            // console.log(data);
            this.submitted = false;
            this.cd.detectChanges();
          },
          e => {
            this.submitted = false;
            this.errors = ['Operation error on updating the user details'];
            this.cd.detectChanges();
          }
        );

    }
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  onChange(value: boolean) {
    this.isSubscribed = value;
    this.cd.detectChanges();
    localStorage.setItem('Subscribed', this.isSubscribed);
    this.subscribeToNotification();
  }

  subscribeToNotification() {
    console.log(this.isSubscribed);
    if (localStorage.getItem('Subscribed') == 'true')
      this.fcm.subscribeToTopic("prediction");
    else
      this.fcm.unsubscribeFromTopic("prediction");
  }


  doRefresh(event) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 500);
  }
}
