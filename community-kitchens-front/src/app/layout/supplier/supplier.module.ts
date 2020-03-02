
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { TransportsComponent } from './pages/transports/transports.component';
import { AvailabilityProductsComponent } from './pages/availability-products/availability-products.component';
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
import { SupplierRoutingModule } from './supplier-routing.module';
@NgModule({
  declarations: [SuppliersComponent, TransportsComponent, AvailabilityProductsComponent],
  imports: [
    CommonModule,
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
    SupplierRoutingModule
  ]
})
export class SupplierModule { }
