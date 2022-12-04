import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { SchedulerRoutingModule, routedComponents } from './scheduler-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SchedulerComponent } from './scheduler.component';

import { NbDialogModule } from '@nebular/theme';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { StatusComponent } from './status/status.component';
import { DialogShowComponent } from './status/dialog-name-prompt/dialog-name-prompt.component';

@NgModule({
  declarations: [
    ...routedComponents,
    SchedulerComponent,
    DialogShowComponent,
    StatusComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    SchedulerRoutingModule,
    Ng2SmartTableModule,
    NbDialogModule.forChild(),
    DragDropModule,
  ],
  entryComponents: [
    DialogShowComponent
  ]
})
export class SchedulerModule { }



