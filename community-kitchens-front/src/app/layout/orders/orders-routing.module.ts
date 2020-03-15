import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreordersComponent } from './pages/preorders/preorders.component';
import { OrdersComponent } from './pages/orders/orders.component';

const routes: Routes =
[{path: 'preorder', component:  PreordersComponent},
{path:  '',  component: OrdersComponent}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
