/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { getDeepFromObject } from '../helpers';
import { AuthService } from '../../../../services/auth.service';
// import { NbAuthService } from '../../services/auth.service';
// import { NbAuthResult } from '../../services/auth-result';

@Component({
  selector: 'ngx-logout',
  templateUrl: './logout.component.html',
})
export class NgxLogoutComponent implements OnInit {

  redirectDelay: number = 0;
  strategy: string = '';

  constructor(@Inject(NB_AUTH_OPTIONS) protected options = {},
    protected router: Router,
    private authService: AuthService) {
    this.redirectDelay = this.getConfigValue('forms.logout.redirectDelay');
    this.strategy = this.getConfigValue('forms.logout.strategy');
  }

  ngOnInit(): void {
    this.logout(this.strategy);
  }

  logout(strategy: string): void {
    this.authService.logout()
    this.router.navigateByUrl('/');
    // this.service.logout(strategy).subscribe((result: NbAuthResult) => {

    //   const redirect = result.getRedirect();
    //   if (redirect) {
    //     setTimeout(() => {
    //       return this.router.navigateByUrl(redirect);
    //     }, this.redirectDelay);
    //   }
    // });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
