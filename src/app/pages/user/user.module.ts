import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule, routedComponents } from './user-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    UserRoutingModule,
    Ng2SmartTableModule,
    UiSwitchModule,
    IonicModule
  ],
  declarations: [
    ...routedComponents,
    UserComponent,
    ProfileComponent,
  ],
})
export class UserModule { }
