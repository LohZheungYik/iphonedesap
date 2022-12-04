import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ScannerComponent } from './scanner.component';
import { IonicModule } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@NgModule({
  imports: [
    ThemeModule,
    IonicModule
  ],
  declarations: [
    ScannerComponent,
  ],
  providers: [
    BarcodeScanner
  ],
})
export class ScannerModule { }
