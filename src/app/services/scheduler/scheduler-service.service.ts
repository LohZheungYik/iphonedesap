import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {


  constructor(private http: HttpClient, private authService: AuthService) {

  }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'ApiKey': this.authService.getToken() })
  };

  createScheduler(scheduler): Observable<any> {
    return this.http.post<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/scheduler', {
      "data": {
        "name": scheduler['name'],
        "uuid": scheduler['uuid'],
        "config": scheduler['config'],
        "isTriggered": scheduler['isTriggered']
      }
    }, this.httpOptions);
  }

  updateScheduler(scheduler): Observable<any> {
    return this.http.put<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/scheduler/' + scheduler.uuid, {
      "data": {
        "config": scheduler['config'],
        "isTriggered": scheduler['isTriggered'],
        "state": "edited"
      }
    }, this.httpOptions);
  }

  deleteScheduler(scheduler): Observable<any> {
    return this.http.delete<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/scheduler/' + scheduler.uuid, this.httpOptions);
  }

  getSchedulerList(): Observable<any> {
    return this.http.get<any>('https://aepad-rest-dev.ap-southeast-1.elasticbeanstalk.com/api/scheduler', this.httpOptions);
  }

}
