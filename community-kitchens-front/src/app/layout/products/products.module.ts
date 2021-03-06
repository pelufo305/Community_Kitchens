import { ProductsRoutingModule } from './products-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';

import {  DxDataGridModule, DxPieChartModule,  DxSelectBoxModule,  DxCheckBoxModule,  DxAutocompleteModule,
  DxTemplateModule } from 'devextreme-angular';
  import { DxLookupModule } from 'devextreme-angular';
  import { BrowserModule } from '@angular/platform-browser';
  import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ProductsComponent } from './pages/products/products.component';
import { ProductService } from 'src/app/shared/services/managers/product.service';

@NgModule({
  declarations: [ProductsComponent],
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
    ProductsRoutingModule,
    HttpClientModule
  ],
  providers: [ProductService],
})
export class ProductsModule { }
