import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PreOrderService {
    api: any;
    headers: any;
    constructor(protected http: HttpClient) {
        this.api = 'http://localhost:64119/api/Preorder/';
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
    }

    Insert(data) {
        return this.http.post<any>(
            this.api + 'Insert', data, { headers: this.headers }
        ).toPromise();
    }

    GetByDate(date) {
        return this.http.get<any>(
            this.api + 'GetByDate?Id=' + date, { headers: this.headers }
        ).toPromise();
    }

    GetByID(ID) {
        return this.http.get<any>(
            this.api + 'GetByID?Id=' + ID, { headers: this.headers }
        ).toPromise();
    }
    GetAll() {
        return this.http.get<any>(
            this.api + 'GetAll', { headers: this.headers }
        ).toPromise();
    }

    GetPreorderByDinningRoom(ID) {
        return this.http.get<any>(
            this.api + 'GetPreorderByDinningRoom?Id=' + ID, { headers: this.headers }
        ).toPromise();
    }


}
