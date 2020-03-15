import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  DxDataGridModule, DxPieChartModule,  DxSelectBoxModule,  DxCheckBoxModule,  DxAutocompleteModule,
  DxTemplateModule } from 'devextreme-angular';
  import { DxLookupModule } from 'devextreme-angular';
  import { BrowserModule } from '@angular/platform-browser';
  import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { OrdersRoutingModule } from './orders-routing.module';
import { PreordersComponent } from './pages/preorders/preorders.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [PreordersComponent, OrdersComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    RouterModule,
    FormsModule,
    DxLookupModule,
    ReactiveFormsModule,
    DxDataGridModule,
    DxPieChartModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    TranslateModule,
    DxAutocompleteModule,
    DxTemplateModule,
    HttpClientModule
  ]
})
export class OrdersModule { }
