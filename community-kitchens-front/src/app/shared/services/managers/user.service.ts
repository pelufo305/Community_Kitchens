import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api: any;
  headers: any;
  constructor(protected http: HttpClient) {
  this.api = 'http://localhost:64119/api/SystemUser/';
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token')
  });
}
Insert(data) {
  return this.http.post<any>(
    this.api + 'Insert' , data, { headers: this.headers }
  ).toPromise();
}

Update(data) {
  return this.http.put<any>(
    this.api + 'Update' , data, { headers: this.headers }
  ).toPromise();
}

GetAll() {
  return this.http.get<any>(
    this.api + 'GetAll', { headers: this.headers }
  ).toPromise();
 }



  GetByID(ID) {
  return this.http.get<any>(
    this.api + 'GetByID?ID=' + ID, { headers: this.headers }
  ).toPromise();
}


Delete(ID) {
return this.http.delete<any>(
  this.api + 'Delete?ID=' + ID, { headers: this.headers }
).toPromise();
}

}
