import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgSelectModule } from '@ng-select/ng-select';

import { ThemeModule } from '../../@theme/theme.module';
import { SurveillanceRoutingModule, routedComponents } from './surveillance-routing.module';
import { NbDialogModule, NbTabsetModule } from '@nebular/theme';
import { DengueCaseComponent } from './dengue-case/dengue-case.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DialogShowComponent } from './dengue-case/dialog-name-prompt/dialog-name-prompt.component';
import { OvitrapDialogComponent } from './ovitrap/ovitrap-dialog-prompt/ovitrap-dialog-prompt.component';
import { OvitrapComponent } from './ovitrap/ovitrap.component';
import { OvitrapDetailComponent } from './ovitrapDetail/ovitrapDetail.component';
import { CupDialogComponent } from './ovitrapDetail/cup-dialog-prompt/cup-dialog-prompt.component';
import { CupEditDialogComponent } from './ovitrapDetail/cup-edit-dialog-prompt/cup-edit-dialog-prompt.component';
import { CaseDialogComponent } from './dengueCaseDetail/case-dialog-prompt/case-dialog-prompt.component';
import { DengueCaseDetailComponent } from './dengueCaseDetail/dengueCaseDetail.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    ThemeModule,
    SurveillanceRoutingModule,
    NgxEchartsModule,
    Ng2SmartTableModule,
    NbDialogModule.forChild(),
    NbTabsetModule,
    NgSelectModule,
    IonicModule,
  ],
  exports: [],
  declarations: [
    ...routedComponents,
    DengueCaseComponent,
    DengueCaseDetailComponent,
    OvitrapComponent,
    OvitrapDetailComponent,
    DialogShowComponent,
    OvitrapDialogComponent,
    CupDialogComponent,
    CupEditDialogComponent,
    CaseDialogComponent,
  ],
  entryComponents: [
    DialogShowComponent,
    OvitrapDialogComponent,
    CupDialogComponent,
    CupEditDialogComponent,
    CaseDialogComponent
  ]
})
export class SurveillanceModule { }
