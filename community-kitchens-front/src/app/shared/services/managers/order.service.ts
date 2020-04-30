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

    ResponseProvider(data) {
        return this.http.post<any>(
            this.apiItem + 'ResponseProvider', data, { headers: this.headers }
        ).toPromise();
    }

    ResponseTransport(data) {
        return this.http.post<any>(
            this.apiItem + 'ResponseTransport', data, { headers: this.headers }
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
      GetOrderItemByProvider(ID, Date) {
        return this.http.get<any>(
            this.apiItem + 'GetOrderItemByProvider?Id=' + ID + '&Date=' + Date, { headers: this.headers }
        ).toPromise();
    }

    GetOrderItemByTransport(ID, Date) {
        return this.http.get<any>(
            this.apiItem + 'GetOrderItemByTransport?Id=' + ID + '&Date=' + Date, { headers: this.headers }
        ).toPromise();
    }

    ProcessOrderRejected(ID) {
        return this.http.get<any>(
            this.api + 'ProcessOrderRejected?ID=' + ID, { headers: this.headers }
        ).toPromise();
    }

    ProcessOrderRejectedTransport(ID) {
        return this.http.get<any>(
            this.api + 'ProcessOrderRejectedTransport?ID=' + ID, { headers: this.headers }
        ).toPromise();
    }

    Accepted(ID) {
        return this.http.get<any>(
            this.api + 'Accepted?ID=' + ID, { headers: this.headers }
        ).toPromise();
    }

}
