import { RecipesRoutingModule } from './recipes-routing.module';
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
import { RecipesComponent } from './pages/recipes/recipes.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [RecipesComponent],
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
    RecipesRoutingModule,
    MatTabsModule
  ],
  bootstrap: [RecipesComponent]
})
export class RecipesModule { }
