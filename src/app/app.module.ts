import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { CountdownModule } from 'ngx-countdown';

import {MatCheckboxModule} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertComponent } from './_components/alert.component';
import { AlertService } from './_services/alert.service';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './_services/authentication.service';
import { AutoLogoutService } from './_services/autologout.service';
import { MailService } from './_services/email.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AlertComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    CountdownModule,
    HttpClientModule
  ],
  providers: [
    AuthenticationService,
    AlertService,
    AutoLogoutService,
    MailService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
