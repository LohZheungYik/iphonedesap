import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class DengueCaseService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'ApiKey': this.authService.getToken() })
  };

  // private base_url = 'http://des-rest.herokuapp.com'
  private base_url = 'http://des-restful-api3-dev.ap-southeast-1.elasticbeanstalk.com'

  getAllDengueCase(): Observable<any> {
    return this.http.get<any>(this.base_url + '/api/dengue_case', this.httpOptions);
  }

  getDengueCase(data): Observable<any> {
    return this.http.post<any>(this.base_url + '/api/dengue_case/list', data, this.httpOptions);
  }

  postDengueCase(data): Observable<any> {
    return this.http.post<any>(this.base_url + '/api/dengue_case', data, this.httpOptions);
  }

  putDengueCase(data): Observable<any> {
    return this.http.put<any>(this.base_url + '/api/dengue_case', data, this.httpOptions);
  }

  deleteDengueCase(data): Observable<any> {
    return this.http.delete<any>(this.base_url + '/api/dengue_case/' + data, this.httpOptions);
  }

}
