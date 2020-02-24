import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiningRoomsComponent } from './pages/dining-rooms/dining-rooms.component';

const routes: Routes = [
  {
      path: '',
      component: DiningRoomsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiningRoomsRoutingModule { }
