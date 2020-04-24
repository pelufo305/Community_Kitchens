import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    api: any;
    headers: any;
    constructor(protected http: HttpClient) {
        this.api = 'http://localhost:64119/api/Order/';
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
}
