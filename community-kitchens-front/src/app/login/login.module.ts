import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule} from '@angular/common/http';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginServiceService } from '../shared/services/managers/login-service.service';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        LoginRoutingModule,
        HttpClientModule],
    declarations: [LoginComponent],
    providers: [LoginServiceService],
})
export class LoginModule {}
