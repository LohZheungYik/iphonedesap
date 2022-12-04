import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'ApiKey': this.authService.getToken() })
  };

  getUser(id): Observable<any> {
    return this.http.get<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/user/' + id, this.httpOptions);
  }

  getAllUser(): Observable<any> {
    return this.http.get<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/user', this.httpOptions);
  }

  updateUser(id, user, image): Observable<any> {
    return this.http.put<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/user/' + id, {
      "data": {
        "id": id,
        "username": user.username,
        "password": user.password,
        "email": user.email,
        "phone_no": user.phone,
        "first_name": user.firstName,
        "last_name": user.lastName,
        "image": image,
        "role_id": user.role
      }
    }, this.httpOptions);
  }

  updateUserAdmin(id, user): Observable<any> {
    return this.http.put<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/user/' + id, {
      "data": {
        "id": id,
        "username": user['username'],
        "password": user['password'],
        "email": user['email'],
        "phone_no": user['phone_no'],
        "first_name": user['first_name'],
        "last_name": user['last_name'],
        "image": user['image'],
        "role_id": user['role_id']
      }
    }, this.httpOptions);
  }

  createUser(user): Observable<any> {
    return this.http.post<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/auth/register', {
      "data": {
        "username": user['username'],
        "password": user['password'],
        "email": user['email'],
        "phone_no": user['phone_no'],
        "first_name": user['first_name'],
        "last_name": user['last_name'],
        "image": user['image']
      }
    }, this.httpOptions);
  }

  deleteUser(id): Observable<any> {
    return this.http.delete<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/user/' + id, this.httpOptions);
  }
}
