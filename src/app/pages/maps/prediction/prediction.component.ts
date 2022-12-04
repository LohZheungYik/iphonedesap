import { Component, ChangeDetectorRef } from '@angular/core';

import * as L from 'leaflet';
import 'style-loader!leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import { NbDateService } from '@nebular/theme';
import { MarkerService } from '../../../services/marker/marker.service';
import { OvitrapService } from '../../../services/ovitrap/ovitrap.service';
import * as _ from 'lodash';
import 'leaflet-extra-markers';

@Component({
  selector: 'ngx-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent {

  ovitrap: any = {};
  marker: any = {};
  markerList: any = [];
  items: any = [];
  localityList: any = [];

  predicted: any = [];

  types: any = [];
  displayType: any = {};
  displayRadiusType: any = {};
  leafletMap: L.Map;
  dstypes: any = [];
  rtypes: any = [];

  options = {
    layers: [
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '' }),
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 20, maxNativeZoom: 18, attribution: '' }),
    ],
    zoom: 15,
    center: L.latLng({ lat: 1.559179, lng: 103.637594 }),
  };

  onMapReady(map: L.Map) {
    setTimeout(() => {
      map.invalidateSize();
      // L.esri.Geocoding.geosearch().addTo(map);
      this.leafletMap = map;
    }, 0);

  }

  layersControl = {
    baseLayers: {
      // 'WikiMedia Map': L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', { maxZoom: 18, attribution: '...' }),
      'Open Street Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, maxNativeZoom: 18, attribution: '' }),
      'Esri World Map': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxNativeZoom: 18, maxZoom: 20, attribution: '' })
    }
  }

  layers = [];

  weeks = [];
  years = [];


  constructor(private cd: ChangeDetectorRef, private ovitrapService: OvitrapService,
    protected dateService: NbDateService<Date>, private markerService: MarkerService) {
    this.types.push("date");
    this.types.push("week");
    this.getLocality();
    this.ovitrap.locality = 'Select Locality';
    this.ovitrap.display_type = 'Select Display Range';
    this.ovitrap.epid_week = 'Select Epid Week';
    this.ovitrap.year = 'Select Year';
    this.generateDropDownItem();
    this.dstypes.push("all");
    this.dstypes.push("border only");
    this.rtypes.push("no");
    this.rtypes.push("200 meter");
    this.rtypes.push("400 meter");
    this.rtypes.push("both");
    this.displayType = 'Select Marker Display Type';
    this.displayRadiusType = 'Select Radius Display Type';
  }

  generateDropDownItem() {
    var date = new Date();
    var currentYear = date.getFullYear();

    for (var i = 100; i >= 1; i--) {
      this.years.push(currentYear - i);
    }

    this.years.push(currentYear);

    for (var i = 1; i <= 100; i++) {
      this.years.push(currentYear + i);
    }

    for (let i = 1; i < 53; i++) {
      this.weeks.push(String(i));
    }
  }

  convertDate(input: String) {
    var mnths = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    },
      date = input.split(" ");

    return [date[3], mnths[date[1]], date[2]].join("-");
  }

  displayMarkers() {
    this.ovitrap.install_date = '';
    this.ovitrap.collect_date = '';

    let noDate = true;

    if (this.ovitrap.display_type == 'date') {

    } else {
      this.ovitrap.dateRange == null;
      this.cd.detectChanges();
    }

    if (this.ovitrap.display_type == 'date') {
      if (this.ovitrap.dateRange != null) {
        noDate = false;
        this.ovitrap.install_date = this.convertDate(String(this.ovitrap.dateRange.start));
        this.ovitrap.collect_date = this.convertDate(String(this.ovitrap.dateRange.end));
      }
    } else if (this.ovitrap.display_type == 'week') {
      noDate = true;
    }

    this.markerService.displayPredictionMarkers(
      this.ovitrap, noDate
    ).subscribe(
      data => {
        this.markerList = data['data'];
        if (this.ovitrap.display_type == 'date') {
          this.getDateMarkers(this.markerList);
        } else if (this.ovitrap.display_type == 'week') {
          this.getWeekMarkers(this.markerList);
        }
        this.leafletMap.flyTo([this.markerList['latitude'], this.markerList['longitude']]);
        // console.log(this.markerList);
      },
      r => {
        // console.log(r.error);
      }
    )
  }

  getLocality() {
    this.ovitrapService.getAllOvitrap().subscribe(
      data => {
        let rslt = _(data)
          .groupBy(x => x.location)
          .map((value, key) => ({ group: key, arr: value }))
          .value();
        this.localityList = rslt;
        this.localityList.forEach(element => {
          this.items.push(element.group)
        });
        this.items.sort()
      }
      , e => {
        // console.log(e)
      });
  }


  getDateMarkers(markerList: any) {
    this.layers = [];
    let dataString = '';
    let dataPopString = '';

    dataString = "Predicted ID: " + markerList['prediction_id'] +
      "<br>Date: " + markerList['install_date'].split("T")[0] +
      "<br>Latitude: " + markerList['latitude'] +
      "<br>Longitude: " + markerList['longitude'];

    dataPopString = "Date: " + markerList['install_date'].split("T")[0] +
      "<br>Week: " + markerList['epid_week_install'] +
      "<br>Longitude: " + markerList['longitude'] +
      "<br>Latitude: " + markerList['latitude'] +
      "<br>Dew Point: " + markerList['dewPoint'] + " &#8451;" +
      "<br>Humidity: " + markerList['humidity'] +
      "<br>Wind Speed: " + markerList['wind_speed'] + " m/s" +
      "<br>Cloud Cover: " + markerList['cloudCover'] +
      "<br>UV Index: " + markerList['uv_index'] +
      "<br>Visibility: " + markerList['visibility'] + " KM" +
      "<br>Minimum Temperature: " + markerList['temp_min'] + " &#8451;" +
      "<br>Maximum Temperature: " + markerList['temp_max'] + " &#8451;" +
      "<br>Predicted Egg No: " + markerList['predicted_egg'].toFixed(2) +
      "<br>Predicted Egg No For Future 3 months: " + markerList['predicted_egg_future'].toFixed(2);

    this.layers.push(
      L.marker([markerList['latitude'], markerList['longitude']], {
        icon: L.ExtraMarkers.icon({
          icon: 'fa-exclamation',
          markerColor: 'red',
          shape: 'circle',
          prefix: 'fa',
        })
      }).bindPopup(dataPopString).bindTooltip(dataString));

  }

  getWeekMarkers(markerList: any) {
    this.layers = [];
    let dataString = '';
    let dataPopString = '';

    dataString = "Predicted ID: " + markerList['prediction_id'] +
      "<br>Year: " + markerList['op_year'] +
      "<br>Epid Week: " + markerList['epid_week'] +
      "<br>Latitude: " + markerList['latitude'] +
      "<br>Longitude: " + markerList['longitude'];

    dataPopString = "Year: " + markerList['op_year'] +
      "<br>Epid Week: " + markerList['epid_week'] +
      "<br>Longitude: " + markerList['longitude'] +
      "<br>Latitude: " + markerList['latitude'] +
      "<br>Dew Point: " + markerList['dewPoint'] + " &#8451;" +
      "<br>Humidity: " + markerList['humidity'] +
      "<br>Wind Speed: " + markerList['wind_speed'] + " m/s" +
      "<br>Cloud Cover: " + markerList['cloudCover'] +
      "<br>UV Index: " + markerList['uv_index'] +
      "<br>Visibility: " + markerList['visibility'] + " KM" +
      "<br>Minimum Temperature: " + markerList['temp_min'] + " &#8451;" +
      "<br>Maximum Temperature: " + markerList['temp_max'] + " &#8451;" +
      "<br>Average Predicted Egg No: " + markerList['predicted_egg'].toFixed(2) +
      "<br>Average Predicted Egg No For Future 3 months: " + markerList['predicted_egg_future'].toFixed(2);

    this.layers.push(
      L.marker([markerList['latitude'], markerList['longitude']], {
        icon: L.ExtraMarkers.icon({
          icon: 'fa-exclamation',
          markerColor: 'red',
          shape: 'circle',
          prefix: 'fa',
        })
      }).bindPopup(dataPopString).bindTooltip(dataString));

  }

  onRadiusClick(option: String) {
    let tmp = this.layers;
    this.layers = [];

    if (option.split(':')[1].includes('no')) {
      // for (var i = 0; i < this.circle.length; i++) {
      //   this.layers.pop();
      // }
      for (var i = 0; i < tmp.length; i++) {
        if (tmp[i] instanceof L.Marker)
          this.layers.push(tmp[i]);
      }

    } else if (option.split(':')[1].includes('both')) {
      for (var i = 0; i < tmp.length; i++) {
        if (tmp[i] instanceof L.Marker)
          this.layers.push(tmp[i]);
      }

      this.layers.push(L.circle([this.markerList['latitude'], this.markerList['longitude']], { "radius": 200, "color": "red" }));
      this.layers.push(L.circle([this.markerList['latitude'], this.markerList['longitude']], { "radius": 400, "color": "blue" }));

    }
    else {
      for (var i = 0; i < tmp.length; i++) {
        if (tmp[i] instanceof L.Marker)
          this.layers.push(tmp[i]);
      }
      if (option.split(':')[1].includes('200 meter')) {

        this.layers.push(L.circle([this.markerList['latitude'], this.markerList['longitude']], { "radius": 200, "color": "red" }));


      } else if (option.split(':')[1].includes('400 meter')) {

        this.layers.push(L.circle([this.markerList['latitude'], this.markerList['longitude']], { "radius": 400, "color": "blue" }));

      }
    }
  }

  showMarkers(type: String) {
    let tmp = this.layers;
    this.layers = [];

    if (type == 'all') {
      for (var i = 0; i < tmp.length; i++) {
        if (tmp[i] instanceof L.Marker)
          this.layers.push(tmp[i]);
        else {
          tmp[i].setStyle({ fill: true });
          this.layers.push(tmp[i]);
        }
      }

    }
    else if (type == 'border only') {
      for (var i = 0; i < tmp.length; i++) {
        if (tmp[i] instanceof L.Marker)
          this.layers.push(tmp[i]);
        else {
          tmp[i].setStyle({ fill: false });
          this.layers.push(tmp[i]);
        }
      }

    }
  }

  onEditClick(dTypes: String) {
    if (dTypes == '1: all') {
      this.showMarkers('all');
    } else if (dTypes == '2: border only') {
      this.showMarkers('border only');
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 500);
  }


}
