import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class OvitrapService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'ApiKey': this.authService.getToken() })
  };

  // private base_url = 'https://des-rest.herokuapp.com'
  private base_url = 'https://des-restful-api3-dev.ap-southeast-1.elasticbeanstalk.com'

  getAllOvitrap(): Observable<any> {
    return this.http.get<any>(this.base_url + '/api/ovitrap', this.httpOptions);
  }

  getOvitrap(data): Observable<any> {
    return this.http.post<any>(this.base_url + '/api/ovitrap/list', data, this.httpOptions);
  }

  postOvitrap(data): Observable<any> {
    return this.http.post<any>(this.base_url + '/api/ovitrap', data, this.httpOptions);
  }

  putOvitrap(data): Observable<any> {
    return this.http.put<any>(this.base_url + '/api/ovitrap', data, this.httpOptions);
  }

  deleteOvitrap(data): Observable<any> {
    return this.http.delete<any>(this.base_url + '/api/ovitrap/' + data, this.httpOptions);
  }

}
