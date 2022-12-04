import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(private http: HttpClient, private authService: AuthService) {

  }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'ApiKey': this.authService.getToken() })
  };

  displayHistoricalMarkers(locality: string, install_date: string, collect_date: string, noDate: Boolean): Observable<any> {

    return this.http.post<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/ovitrap', {
      "data": {
        "filter_option": {
          "locality": locality,
          "install_date": install_date,
          "collect_date": collect_date,
          "no_date": String(noDate)
        }
      }
    },
      this.httpOptions);
  }

  getLocality(): Observable<any> {
    return this.http.get<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/ovitrap', this.httpOptions);
  }

  displayPredictionMarkers(ovitrap, noDate: Boolean): Observable<any> {

    return this.http.post<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/prediction', {
      "data": {
        "filter_option": {
          "locality": ovitrap.locality,
          "install_date": ovitrap.install_date,
          "collect_date": ovitrap.collect_date,
          "year": String(ovitrap.year),
          "no_date": String(noDate),
          "epid_week": String(ovitrap.epid_week),
          "display_type": ovitrap.display_type
        }
      }
    },
      this.httpOptions);
  }
}
