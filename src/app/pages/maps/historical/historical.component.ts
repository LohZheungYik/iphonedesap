import { Component, ChangeDetectorRef } from '@angular/core';

import * as L from 'leaflet';
import 'style-loader!leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon.png';
import { OvitrapService } from '../../../services/ovitrap/ovitrap.service';
import * as _ from 'lodash';
import { CupService } from '../../../services/cup/cup.service';
import 'leaflet-extra-markers';

@Component({
  selector: 'ngx-historical',
  styleUrls: ['./historical.component.scss'],
  templateUrl: './historical.component.html',
})
export class HistoricalComponent {

  ovitrap: any = {};
  marker: any = {};
  markerList: any = [];
  items: any = [];
  dates: any = [];
  localityList: any = [];
  positive: any = [];
  negative: any = [];
  circle: any = [];
  types: any = [];
  displayType: any = {};
  displayRadiusType: any = {};
  markerRadius = 400;
  rtypes: any = [];
  ovitrap_index = 0;
  leafletMap: L.Map;
  analysis: any = {};

  options = {
    layers: [
      // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '' }),
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 20, maxNativeZoom: 18, attribution: '' }),
    ],
    zoom: 15,
    center: L.latLng({ lat: 1.559179, lng: 103.637594 }),
    preferCanvas: true,
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
      'Open Street Map': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, maxNativeZoom: 18, attribution: '' }),
      'Esri World Map': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxNativeZoom: 18, maxZoom: 20, attribution: '' })
    }
  }

  layers = [
    // L.circle([1.559179, 103.637594], { radius: 400 }),
    // L.marker([1.559179, 103.637594], {
    //   icon: L.icon({
    //     iconSize: [25, 41],
    //     iconAnchor: [13, 41],
    //     iconUrl: 'assets/img/markers/marker-icon.png',
    //     shadowUrl: 'assets/img/markers/marker-shadow.png'
    //   })
    // }).bindTooltip("This is a popup dialog", { direction: "bottom" }),
    // L.circle([1.561179, 103.641594], { radius: 400 }),
    // L.marker([1.561179, 103.641594], {
    //   icon: L.icon({
    //     iconSize: [25, 41],
    //     iconAnchor: [13, 41],
    //     iconUrl: 'assets/img/markers/marker-icon.png',
    //     shadowUrl: 'assets/img/markers/marker-shadow.png'
    //   })
    // }).bindTooltip("This is a popup dialog", { direction: "bottom" })
  ];



  constructor(private cd: ChangeDetectorRef, private cupService: CupService,
    private ovitrapService: OvitrapService) {
    this.types.push("all");
    this.types.push("positive");
    this.types.push("negative");
    this.rtypes.push("no");
    this.rtypes.push("50 meter");
    this.rtypes.push("100 meter");
    this.rtypes.push("200 meter");
    this.rtypes.push("400 meter");
    this.getLocality();
    this.ovitrap.locality = 'Select Locality';
    this.ovitrap.install_date = 'Select Install Date';
    this.displayType = 'Select Marker Display Type';
    this.displayRadiusType = 'Select Radius Display Type';
    this.ovitrap.display_date = false;
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
    // this.ovitrap.collect_date = '';
    this.ovitrap.locality = String(this.ovitrap.locality);

    let oviID = null;
    this.localityList.find(e => this.ovitrap.locality.includes(e.group)).arr.forEach(element => {
      if (this.ovitrap.install_date.includes(element.timeinstall.split("T")[0])) {
        oviID = element.id
        this.ovitrap.collect_date = element.timeremove.split("T")[0]
        this.ovitrap.epid_week_install = element.weekepidinstall
        this.ovitrap.epid_week_collect = element.weekepidremove
      }
    });
    this.cupService.getCup({ "ovitrap_id": oviID }).subscribe(
      data => {
        try {
          data.forEach(element => {
            switch (element.status) {
              case 0:
                element.statusStr = "Installed "
                break;
              case 1:
                element.statusStr = "Positive"
                break;
              case 2:
                element.statusStr = "Negative"
                break;
              case 3:
                element.statusStr = "Lost"
                break;
              case 4:
                element.statusStr = "Broken"
                break;
              case 5:
                element.statusStr = "Collected"
                break;
              default:
                break;
            }

            switch (element.door) {
              case 1:
                element.placement = "Outdoor"
                break;
              case 2:
                element.placement = "Indoor"
                break;
              case 3:
                element.placement = "Semi-Indoor"
                break;
              default:
                break;
            }
          });
          this.markerList = data;
          this.analysis.positive = data.filter(element => element.status == 1).length;
          this.analysis.collect = data.filter(element => (element.status == 1 || element.status == 2 || element.status == 5)).length;
          this.analysis.index = ((this.analysis.positive / this.analysis.collect) * 100).toFixed(2);
          this.cupService.getAllMarker().subscribe(
            data => {
              this.getMarkers(this.markerList, data);
              this.showMarkers("all");
              this.leafletMap.flyTo([this.markerList[0]['gpsy'], this.markerList[0]['gpsx']]);
            },
            err => {
              //console.log(err)
            }
          )
        } catch (error) {
          // console.log(error)
        }



      }, err => {
        //console.log(err)
      });
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

  getMarkers(cupList: any, markerList: any) {
    let dataString = '';
    let dataPopString = '';
    this.positive = [];
    this.negative = [];
    this.circle = [];
    cupList.forEach(cup => {
      try {
        dataString = "Cup No: " + cup.no + "<br>Locality: " + this.ovitrap.locality + "<br>Address: " +
          cup.address + "<br>Mosquito Home Placement: " +
          cup.placement;

        dataPopString = "Cup No: " + cup.no +
          "<br>Locality: " + this.ovitrap.locality +
          "<br>Install Date: " + this.ovitrap.install_date +
          "<br>Collect Date: " + this.ovitrap.collect_date +
          "<br>Epid Week Install: " + this.ovitrap.epid_week_install +
          "<br>Epid Week Collect: " + this.ovitrap.epid_week_collect +
          "<br>Address: " + cup.address +
          "<br>Marker: " + markerList.find(element => element.id == cup.marker).name +
          "<br>Mosquito Home Placement: " + cup.placement +
          "<br>Egg No: " + cup.egg +
          "<br>Larvae No: " + cup.larvae +
          "<br>Cup Result: " + cup.statusStr +
          "<br>Latitude: " + cup.gpsy +
          "<br>Longitude: " + cup.gpsx +
          "<br>Owner Name: " + cup.citizen_name +
          "<br>Phone No: " + cup.citizen_telno;

        if (cup.status == 1) {
          this.positive.push(
            L.marker([cup.gpsy, cup.gpsx], {
              icon: L.ExtraMarkers.icon({
                icon: 'fa-number',
                markerColor: 'red',
                shape: 'circle',
                prefix: 'fa',
                number: cup.no,
              })
            }).bindPopup(dataPopString).bindTooltip(dataString));

          this.circle.push(
            L.circle([cup.gpsy, cup.gpsx], { radius: this.markerRadius }),
          )
        } else if (cup.status == 2) {
          this.negative.push(
            L.marker([cup.gpsy, cup.gpsx], {
              icon: L.ExtraMarkers.icon({
                icon: 'fa-number',
                markerColor: 'blue-dark',
                shape: 'circle',
                prefix: 'fa',
                number: cup.no,
              })
            }).bindPopup(dataPopString).bindTooltip(dataString))
        }
      } catch (error) {
        return
      }


    });
  }

  showMarkers(type: String) {
    this.layers = [];

    if (type == 'all') {
      for (var i = 0; i < this.positive.length; i++) {
        this.layers.push(this.positive[i]);
      }

      for (var i = 0; i < this.negative.length; i++) {
        this.layers.push(this.negative[i]);
      }
    }
    else if (type == 'positive') {
      for (var i = 0; i < this.positive.length; i++) {
        this.layers.push(this.positive[i]);
      }

    } else if (type == 'negative') {
      for (var i = 0; i < this.negative.length; i++) {
        this.layers.push(this.negative[i]);
      }
    }
  }

  onRadiusClick(option: String) {
    let tmp = this.layers;
    this.layers = [];
    if (option.split(':')[1].includes('no')) {
      // for (var i = 0; i < this.circle.length; i++) {
      //   this.layers.pop();
      // }
      for (var i = 0; i < this.circle.length; i++) {
        if (tmp[i] instanceof L.Marker)
          this.layers.push(tmp[i]);
      }
    } else {
      for (var i = 0; i < this.circle.length; i++) {
        if (tmp[i] instanceof L.Marker)
          this.layers.push(tmp[i]);
      }
      if (option.split(':')[1].includes('50 meter')) {
        for (var i = 0; i < this.circle.length; i++) {
          this.circle[i].setRadius(50);
          this.layers.push(this.circle[i]);
        }
      } else if (option.split(':')[1].includes('100 meter')) {
        for (var i = 0; i < this.circle.length; i++) {
          this.circle[i].setRadius(100);
          this.layers.push(this.circle[i]);
        }
      } else if (option.split(':')[1].includes('200 meter')) {
        for (var i = 0; i < this.circle.length; i++) {
          this.circle[i].setRadius(200);
          this.layers.push(this.circle[i]);
        }
      } else if (option.split(':')[1].includes('400 meter')) {
        for (var i = 0; i < this.circle.length; i++) {
          this.circle[i].setRadius(400);
          this.layers.push(this.circle[i]);
        }
      }
    }
  }

  onEditClick(dTypes: String) {
    if (dTypes == '1: all') {
      this.showMarkers('all');
    } else if (dTypes == '2: positive') {
      this.showMarkers('positive');
    } else if (dTypes == '3: negative') {
      this.showMarkers('negative');
    }
  }

  onSelectClick(event) {
    this.ovitrap.display_date = true;
    this.dates = [];
    this.localityList.find(element => event.split(': ')[1].includes(element.group)).arr.forEach(element => {
      this.dates.push(element.timeinstall.split("T")[0]);
    });
    this.cd.detectChanges();
  }

  doRefresh(event) {
    setTimeout(() => {
      window.location.reload();
      event.target.complete();
    }, 500);
  }

}
