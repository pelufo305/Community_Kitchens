import { OrderProviderComponent } from './pages/order-provider/order-provider.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreordersComponent } from './pages/preorders/preorders.component';
import { OrdersComponent } from './pages/orders/orders.component';


const routes: Routes =
[{path: 'preorder', component:  PreordersComponent},
{path:  'provider', component:  OrderProviderComponent},
{path:  '',  component: OrdersComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
