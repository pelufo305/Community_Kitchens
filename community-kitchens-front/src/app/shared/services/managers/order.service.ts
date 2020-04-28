import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    api: any;
    apiItem: any;
    headers: any;
    constructor(protected http: HttpClient) {
        this.api = 'http://localhost:64119/api/Order/';
        this.apiItem = 'http://localhost:64119/api/OrderItem/';
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
    }

    ProcessOrder(ID) {
        return this.http.get<any>(
            this.api + 'ProcessOrder?ID=' + ID, { headers: this.headers }
        ).toPromise();
    }

    Insert(data) {
        return this.http.post<any>(
            this.apiItem + 'InsertOrderItem', data, { headers: this.headers }
        ).toPromise();
    }

    ProcessPreOrder(ID) {
        return this.http.get<any>(
            this.apiItem + 'GetOrderItemByPreorder?Id=' + ID, { headers: this.headers }
        ).toPromise();
    }

    Delete(ID) {
        return this.http.delete<any>(
          this.apiItem + 'Delete?Id=' + ID, { headers: this.headers }
        ).toPromise();
      }

}
