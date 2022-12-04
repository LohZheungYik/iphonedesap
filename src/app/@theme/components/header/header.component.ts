import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserData, User } from '../../../@core/data/users';
import { AnalyticsService } from '../../../@core/utils';
import { LayoutService } from '../../../@core/utils';
import { UserService } from '../../../services/user/user-service.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  user: any;

  userMenu = [{ title: 'Profile', link: '/pages/user/profile' }, { title: 'Log out', link: '/auth/logout' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private userService: UserData,
    private analyticsService: AnalyticsService,
    private layoutService: LayoutService,
    private customUserService: UserService,
    private authService: AuthService) {
  }

  // ngOnInit() {
  //   this.userService.getUsers()
  //     .subscribe((users: any) => this.user = users.nick);
  // }

  ngOnInit() {
    if (this.authService.isLogged()) {
      this.customUserService.getUser(this.authService.getUserId()).subscribe(
        data => {
          let tmp = { name: "", picture: "" };
          tmp.name = data['data']['first_name'] + " " + data['data']['last_name'];
          if (data['data']['image'] != null) {
            this.thumbnailify(data['data']['image'], 100, function (base64Thumbnail) {
              tmp.picture = base64Thumbnail;
            });
          } else {
            tmp.picture = "";
          }

          this.user = tmp;
        },
        r => {
          // console.log(r.error);
        }
      )
    };
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }

  thumbnailify(base64Image, targetSize, callback) {
    var img = new Image();

    img.onload = function () {
      var width = img.width,
        height = img.height,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d");

      canvas.width = canvas.height = targetSize;

      ctx.drawImage(
        img,
        width > height ? (width - height) / 2 : 0,
        height > width ? (height - width) / 2 : 0,
        width > height ? height : width,
        width > height ? height : width,
        0, 0,
        targetSize, targetSize
      );

      callback(canvas.toDataURL());
    };

    img.src = base64Image;
  };
}
