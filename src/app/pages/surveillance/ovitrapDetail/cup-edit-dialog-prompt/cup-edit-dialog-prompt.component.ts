import { Component, ChangeDetectorRef, Inject, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AuthService } from '../../../../services/auth.service';
import { getDeepFromObject } from '../../../../@theme/components/auth/helpers';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { CupService } from '../../../../services/cup/cup.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'ngx-cup-edit-dialog-prompt',
  templateUrl: 'cup-edit-dialog-prompt.component.html',
  styleUrls: ['cup-edit-dialog-prompt.component.scss'],
  providers: [Camera]
})

export class CupEditDialogComponent implements OnInit {

  showMessages: any = {};
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  default: any = {};
  cup: any = {};
  ovitrap_id: any;
  data: any;
  markers: any = [];
  newMarker: any = {};

  constructor(@Inject(NB_AUTH_OPTIONS) protected options = {}, private cd: ChangeDetectorRef, protected ref: NbDialogRef<CupEditDialogComponent>,
    private cupService: CupService, private authService: AuthService, private geolocation: Geolocation,
    private camera: Camera) {
    this.cupService.getAllMarker().subscribe(
      data => {
        this.markers = data;
        this.markers.sort(function (a, b) {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
        this.markers.push({ "id": 0, "name": "New Marker" })
      }
    )

  }

  ngOnInit() {
    this.cup = this.data;
    if (this.cup.egg == null) {
      this.cup.egg = 0;
    }
    if (this.cup.larvae == null) {
      this.cup.larvae = 0;
    }
  }

  submit() {
    this.cup.ovitrap_id = this.ovitrap_id;
    delete this.cup.placement;
    delete this.cup.statusStr;
    //Status - 0 : installed
    //Status - 1 : positive
    //Status - 2 : negative
    //Status - 3 : missing
    //Status - 4 : fault (rosak)
    //Status - 5 : collected

    if (this.authService.isLogged()) {

      if (this.cup.marker == 0) {
        this.cupService.postMarker({
          'name': this.newMarker.name
        }).subscribe(
          data => {
            this.cup.marker = data['insertId'];
            this.cupService.putCup(this.cup).subscribe(
              data => {
                // console.log("Successful create user");
                this.submitted = false;
                this.messages = ['Operation on creating the cup success'];
                this.cd.detectChanges();
                this.ref.close();
              },
              e => {
                // console.log(e.error);
                this.submitted = false;
                this.errors = ['Operation error on creating the cup'];
                this.cd.detectChanges();
              }
            )
          }
        )
      } else {
        this.cupService.putCup(this.cup).subscribe(
          data => {
            // console.log("Successful create user");
            this.submitted = false;
            this.messages = ['Operation on creating the cup success'];
            this.cd.detectChanges();
            this.ref.close();
          },
          e => {
            // console.log(e.error);
            this.submitted = false;
            this.errors = ['Operation error on creating the cup'];
            this.cd.detectChanges();
          }
        )
      }
    }
  }

  getLatLong() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      // console.log(resp);
      this.cup.gpsy = resp.coords.latitude.toFixed(4);
      this.cup.gpsx = resp.coords.longitude.toFixed(4);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  cancel() {
    this.ref.close();
  }

  takePicture() {
    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.cupService.postForAnalysis(base64Image).subscribe(
        data => {

          // For mock data testing only
          setTimeout(() => {
            this.cup.egg = data.egg;
            this.cup.larvae = data.larvae;
          }, 5000);
        },
        err => {
          // console.log(err)
        })
    })
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}