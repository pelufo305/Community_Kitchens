import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { TransportsComponent } from './pages/transports/transports.component';
import { AvailabilityProductsComponent } from './pages/availability-products/availability-products.component';

const routes: Routes =
[{path: 'suppliers', component:  SuppliersComponent},
{path:  'transports',  component: TransportsComponent},
{path:  'availability-products',  component: AvailabilityProductsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
