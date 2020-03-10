import { ProviderService } from './../../../shared/services/managers/provider.service';
import { UserService } from './../../../shared/services/managers/user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './pages/users/users.component';
import {  DxDataGridModule, DxPieChartModule,  DxSelectBoxModule,  DxCheckBoxModule,  DxAutocompleteModule,
  DxTemplateModule } from 'devextreme-angular';
  import { DxLookupModule } from 'devextreme-angular';
  import { BrowserModule } from '@angular/platform-browser';
  import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [UsersComponent],
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
    UsersRoutingModule,
    HttpClientModule
  ],
  providers: [UserService, ProviderService ]
})
export class UsersModule { }
