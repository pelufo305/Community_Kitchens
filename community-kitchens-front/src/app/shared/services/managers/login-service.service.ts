import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
 api: any;
  AuthUser(data) {
    return this.http.post<any>(
      this.api, data
    ).toPromise();
  }

constructor(protected http: HttpClient) {
   this.api = 'http://localhost:64119/api/login/authenticate';
}
}
