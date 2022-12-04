/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { getDeepFromObject } from '../helpers';
import { AuthService } from '../../../../services/auth.service';

// import { NbAuthService } from '../../services/auth.service';
// import { NbAuthResult } from '../../services/auth-result';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxLoginComponent {

  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  rememberMe = false;

  constructor(@Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private authService: AuthService) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.strategy = this.getConfigValue('forms.login.strategy');
    this.rememberMe = this.getConfigValue('forms.login.rememberMe');
    this.relogin();
  }

  relogin(): void {
    this.errors = [];
    this.messages = [];

    if (this.authService.isLogged()) {
      alert("Checking user session...")
      this.submitted = true;
      this.authService.reauthenticate()
        .subscribe(
          data => {
            if (data['data']['authenticate'] == 'success') {
              let token = data['data']['token'];
              let role_id = data['data']['role_id'];
              let user_id = data['data']['user_id'];
              let usr_uuid = data['data']['usr_uuid'];
              this.authService.setToken(token, role_id, user_id, usr_uuid);
              this.router.navigateByUrl('/pages/dashboard');
            }
          },
          r => {
            // alert("Invalid username and password");
            this.errors = ['Invalid ApiKey value'];
            this.submitted = false;
            this.authService.clearToken();
            this.cd.detectChanges();
          });
    }

  }

  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;


    this.authService.authenticate(
      this.user.username,
      this.user.password,
      this.user.rememberMe
    )
      .subscribe(
        data => {
          if (data['data']['authenticate'] == 'success') {
            let token = data['data']['token'];
            let role_id = data['data']['role_id'];
            let user_id = data['data']['user_id'];
            let usr_uuid = data['data']['usr_uuid'];
            this.authService.setToken(token, role_id, user_id, usr_uuid);
            this.router.navigateByUrl('/pages/dashboard');
          }
        },
        r => {
          // alert("Invalid username and password");
          this.errors = ['Invalid username or password'];
          this.submitted = false;
          this.cd.detectChanges();
        });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
