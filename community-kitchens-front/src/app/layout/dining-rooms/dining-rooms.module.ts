import { DinnersService } from './../../shared/services/managers/dinners.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiningRoomsComponent } from './pages/dining-rooms/dining-rooms.component';
import {  DxDataGridModule, DxPieChartModule,  DxSelectBoxModule,  DxCheckBoxModule,  DxAutocompleteModule,
  DxTemplateModule } from 'devextreme-angular';
  import { DxLookupModule } from 'devextreme-angular';
  import { BrowserModule } from '@angular/platform-browser';
  import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { DiningRoomsRoutingModule } from './dining-rooms-routing.module';
import { HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [DiningRoomsComponent],
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
    DiningRoomsRoutingModule,
    HttpClientModule
 ],
 providers: [DinnersService],
})
export class DiningRoomsModule { }
