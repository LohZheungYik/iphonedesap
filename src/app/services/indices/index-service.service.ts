import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'ApiKey': this.authService.getToken() })
  };


  getOvitrapIndex(locality): Observable<any> {
    return this.http.get<any>('https://des-restful-api3-dev.ap-southeast-1.elasticbeanstalk.com/api/index_calculator/oi/' + locality, this.httpOptions);
  }

  getHouseIndex(locality): Observable<any> {
    return this.http.get<any>('https://des-restful-api3-dev.ap-southeast-1.elasticbeanstalk.com/api/index_calculator/hi/' + locality, this.httpOptions);
  }

  getLarvalIndex(locality): Observable<any> {
    return this.http.get<any>('https://des-restful-api3-dev.ap-southeast-1.elasticbeanstalk.com/api/index_calculator/ld/' + locality, this.httpOptions);
  }

  getTotalPercentage(): Observable<any> {
    return this.http.get<any>('https://des-restful-api3-dev.ap-southeast-1.elasticbeanstalk.com/api/overall/total', this.httpOptions);
  }

  getTotalAnalysis(): Observable<any> {
    return this.http.get<any>('https://des-restful-api3-dev.ap-southeast-1.elasticbeanstalk.com/api/overall', this.httpOptions);
  }

}
