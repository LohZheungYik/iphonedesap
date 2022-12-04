import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CupService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'ApiKey': this.authService.getToken() })
  };

  // private base_url = 'https://des-rest.herokuapp.com'
  private base_url = 'https://des-restful-api3-dev.ap-southeast-1.elasticbeanstalk.com'

  getAllCup(): Observable<any> {
    return this.http.get<any>(this.base_url + '/api/cup', this.httpOptions);
  }

  getCup(data): Observable<any> {
    return this.http.post<any>(this.base_url + '/api/cup/list', data, this.httpOptions);
  }

  postCup(data): Observable<any> {
    return this.http.post<any>(this.base_url + '/api/cup', data, this.httpOptions);
  }

  putCup(data): Observable<any> {
    return this.http.put<any>(this.base_url + '/api/cup', data, this.httpOptions);
  }

  deleteCup(data): Observable<any> {
    return this.http.delete<any>(this.base_url + '/api/cup/' + data, this.httpOptions);
  }

  getAllMarker(): Observable<any> {
    return this.http.get<any>(this.base_url + '/api/marker', this.httpOptions);
  }

  generateExcel(data): Observable<any> {
    return this.http.get<any>(this.base_url + '/api/excel?id=' + data,
      {
        responseType: 'blob' as 'json',
        headers: new HttpHeaders({ 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'ApiKey': this.authService.getToken() }),

      });
  }

  generateQRCode(data): Observable<any> {
    return this.http.get<any>(this.base_url + '/api/qrcode/ovitrap?id=' + data, {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({ 'Accept': 'text/pdf', 'ApiKey': this.authService.getToken() }),

    });
  }

  postMarker(data): Observable<any> {
    return this.http.post<any>(this.base_url + '/api/marker', data, this.httpOptions);
  }

  postForAnalysis(data): any {
    // For mock data testing only
    let egg = Math.floor(Math.random() * Math.floor(200))
    let larvae = Math.floor(Math.random() * Math.floor(100))

    return of({ "egg": egg, "larvae": larvae })
  }

}
