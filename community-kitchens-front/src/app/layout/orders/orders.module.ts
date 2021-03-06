import { TransportService } from './../../shared/services/managers/transport.service';
import { ProviderService } from './../../shared/services/managers/provider.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  DxDataGridModule, DxPieChartModule,  DxSelectBoxModule,  DxCheckBoxModule,  DxAutocompleteModule,
  DxTemplateModule,
  DxValidatorModule} from 'devextreme-angular';
  import { DxLookupModule } from 'devextreme-angular';
  import { BrowserModule } from '@angular/platform-browser';
  import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { OrdersRoutingModule } from './orders-routing.module';
import { PreordersComponent } from './pages/preorders/preorders.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { HttpClientModule } from '@angular/common/http';
import { DisponibilityService } from 'src/app/shared/services/managers/disponibility.service';
import { ProductService } from 'src/app/shared/services/managers/product.service';
import { IngredientService } from 'src/app/shared/services/managers/ingredient.service';
import { RecipeService } from 'src/app/shared/services/managers/recipe.service';
import { DinnersService } from 'src/app/shared/services/managers/dinners.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { MatTabsModule } from '@angular/material/tabs';
import { PreOrderService } from 'src/app/shared/services/managers/pre-order.service';
import { OrderService } from 'src/app/shared/services/managers/order.service';
import { OrderProviderComponent } from './pages/order-provider/order-provider.component';

@NgModule({
  declarations: [PreordersComponent, OrdersComponent, OrderProviderComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
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
    HttpClientModule,
    DxValidatorModule,
    MatTabsModule,
    NgbModule.forRoot()
  ],
  bootstrap:    [ PreordersComponent, OrdersComponent ],
  providers: [RecipeService, IngredientService, DisponibilityService,
              ProductService, DinnersService, PreOrderService,
              OrderService, ProviderService, TransportService]
})
export class OrdersModule { }
