import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { TransportsComponent } from './pages/transports/transports.component';
import { AvailabilityProductsComponent } from './pages/availability-products/availability-products.component';

@NgModule({
  declarations: [SuppliersComponent, TransportsComponent, AvailabilityProductsComponent],
  imports: [
    CommonModule
  ]
})
export class SupplierModule { }
