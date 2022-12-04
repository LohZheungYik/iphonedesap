import { NbMenuService } from '@nebular/theme';
import { Component } from '@angular/core';

@Component({
  selector: 'ngx-no-authority',
  styleUrls: ['./no-authority.component.scss'],
  templateUrl: './no-authority.component.html',
})
export class NoAuthorityComponent {

  constructor(private menuService: NbMenuService) {
  }

  goToHome() {
    this.menuService.navigateHome();
  }
}
