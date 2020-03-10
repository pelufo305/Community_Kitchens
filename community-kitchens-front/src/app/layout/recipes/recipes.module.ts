import { ProductService } from './../../shared/services/managers/product.service';
import { IngredientService } from './../../shared/services/managers/ingredient.service';
import { RecipeService } from './../../shared/services/managers/recipe.service';
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
import { HttpClientModule} from '@angular/common/http';



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
    MatTabsModule,
    HttpClientModule
  ],
  bootstrap: [RecipesComponent],
  providers: [RecipeService, IngredientService, ProductService],
})
export class RecipesModule { }
