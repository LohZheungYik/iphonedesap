import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookieService: CookieService) {

  }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', })
  };

  public getToken() {
    return this.cookieService.get('ApiKey');
  }

  public getUserId() {
    return this.cookieService.get('UserId');
  }

  public getRoleId() {
    return this.cookieService.get('UserRoleId');
  }

  public getUsrUUID() {
    return this.cookieService.get('UsrUUID');
  }

  setToken(token: string, role_id: string, user_id: string, usr_uuid: string): void {
    let date = new Date();
    date.setHours(date.getHours() + 1)
    this.cookieService.set('ApiKey', token, date);
    this.cookieService.set('UserRoleId', role_id, date);
    this.cookieService.set('UserId', user_id, date);
    this.cookieService.set('UsrUUID', usr_uuid, date);
  }

  clearToken() {
    this.cookieService.delete('ApiKey');
    this.cookieService.delete('UserRoleId');
    this.cookieService.delete('UserId');
    this.cookieService.delete('UsrUUID');
  }

  isLogged() {
    // return localStorage.getItem('ApiKey') != null;
    return this.cookieService.check('ApiKey');

  }

  authenticate(username: string, password: string, rememberMe: string): Observable<any> {
    return this.http.post<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/auth/api-key', {
      'data': {
        "username": username,
        "password": password,
        "remember": rememberMe
      }
    }, this.httpOptions);
  }

  reauthenticate(): Observable<any> {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'ApiKey': this.cookieService.get('ApiKey') })
    };
    return this.http.post<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/auth/api-relogin', {},
      this.httpOptions);
  }

  logout() {
    this.clearToken();
  }
}