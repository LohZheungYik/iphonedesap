import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import jsQR from 'jsqr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'scanner.component.html',
  styleUrls: ['scanner.component.scss']
})
export class ScannerComponent {

  @ViewChild('video') video: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('fileinput') fileinput: ElementRef;
  private data: any;
  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;
  loading: HTMLIonLoadingElement = null;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private plt: Platform,
    protected router: Router
  ) {
    const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
      console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!
    }
  }

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
  }



  reset() {
    this.scanResult = null;
  }

  stopScan() {
    this.scanActive = false;
  }

  async startScan() {
    // Not working on iOS standalone mode!
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    this.videoElement.srcObject = stream;
    // Required for Safari
    this.videoElement.setAttribute('playsinline', true);
  
    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();
  
    this.videoElement.play();
    requestAnimationFrame(this.scan.bind(this));
  }
  
  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }
  
      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;
  
      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
  
      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;

        let str = this.scanResult;
        let res = str.split("/");
        this.data = {
          ovitrapID: res[res.findIndex(e => e === 'ovitrapsentinel') + 1],
          cupID: res[res.findIndex(e => e === 'cup') + 1]
        }
        console.log(this.data)
        
        this.videoElement.srcObject.getTracks().forEach(function(track) {
          track.stop();
        });

        this.router.navigateByUrl('/pages/surveillance/ovitrapsentinel/' + this.data.ovitrapID,
        { state: { data: this.data } });

  
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }
  
  captureImage() {
    this.fileinput.nativeElement.click();
  }
  
  handleFile(files: FileList) {
    const file = files.item(0);
  
    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
  
      if (code) {
        this.scanResult = code.data;

      }
    };
    img.src = URL.createObjectURL(file);
  }

}



/*
import { Component } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-scanner',
  templateUrl: './scanner.component.html',
})
export class ScannerComponent {

  private data: any;

  private options: BarcodeScannerOptions = {
    preferFrontCamera: false, // iOS and Android
    showFlipCameraButton: true, // iOS and Android
    showTorchButton: true, // iOS and Android
    prompt: "Place a QR code inside the scan area", // Android
    resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
    disableSuccessBeep: false // iOS and Android
  };

  constructor(private barcodescanner: BarcodeScanner, protected router: Router) {
  }

  activateScanner() {
    this.barcodescanner.scan(this.options).then(barcodeData => {
      console.log(barcodeData);
      let str = barcodeData['text'];
      let res = str.split("/");
      this.data = {
        ovitrapID: res[res.findIndex(e => e === 'ovitrapsentinel') + 1],
        cupID: res[res.findIndex(e => e === 'cup') + 1]
      }
      console.log(this.data)
      this.router.navigateByUrl('/pages/surveillance/ovitrapsentinel/' + this.data.ovitrapID,
        { state: { data: this.data } });

    }).catch(err => {
      this.data = JSON.stringify(err);
    });
  }
}
*/
