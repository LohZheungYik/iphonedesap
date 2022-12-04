import { Component, ChangeDetectorRef, Inject, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AuthService } from '../../../../services/auth.service';
import { getDeepFromObject } from '../../../../@theme/components/auth/helpers';
import { NB_AUTH_OPTIONS } from '@nebular/auth';
import { CupService } from '../../../../services/cup/cup.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'ngx-cup-dialog-prompt',
  templateUrl: 'cup-dialog-prompt.component.html',
  styleUrls: ['cup-dialog-prompt.component.scss'],
})

export class CupDialogComponent {

  showMessages: any = {};
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  default: any = {};
  cup: any = {};
  ovitrap_id: any;
  markers: any = [];
  newMarker: any = {};

  constructor(@Inject(NB_AUTH_OPTIONS) protected options = {}, private cd: ChangeDetectorRef, protected ref: NbDialogRef<CupDialogComponent>,
    private cupService: CupService, private authService: AuthService, private geolocation: Geolocation) {
    this.default.no = 'eg. 1';
    this.default.address = 'eg. Jalan Melawati 15';
    this.default.placement = 'Select the Cup Placement';
    this.default.gpsy = 'eg. 1.24722';
    this.default.gpsx = 'eg. 103.1234';
    this.default.citizen_name = 'eg. Mohd Ahmad';
    this.default.citizen_telno = '60123456789';
    this.default.markerdetails = 'eg. Testing marker detail (Optional)';
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

  submit() {
    this.cup.ovitrap_id = this.ovitrap_id;

    //Status - 0 : installed
    //Status - 1 : positive
    //Status - 2 : negative
    //Status - 3 : missing
    //Status - 4 : fault (rosak)
    //Status - 5 : collected
    this.cup.status = 0;
    console.log(this.cup)

    if (this.authService.isLogged()) {
      if (this.cup.marker == 0) {
        this.cupService.postMarker({
          'name': this.newMarker.name
        }).subscribe(
          data => {
            this.cup.marker = data['insertId'];
            this.cupService.postCup(this.cup).subscribe(
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
        this.cupService.postCup(this.cup).subscribe(
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
      this.cup.gpsy = resp.coords.latitude.toFixed(4),
        this.cup.gpsx = resp.coords.longitude.toFixed(4);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  cancel() {
    this.ref.close();
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}