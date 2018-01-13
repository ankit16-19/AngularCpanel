import '../polyfills';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http'; // remove later
import {HttpClientModule} from '@angular/common/http';

import { AmChartsModule } from '@amcharts/amcharts3-angular';

import { AngularModule} from './angular.module';
import {AppComponent} from './app.component';

// Bootstrap imports
import { AccordionModule } from 'ngx-bootstrap';
import {DashboardComponent} from './dashboard/dashboard.component';
import { DownloaderComponent } from './downloader/downloader.component';
import {AppRoutingModule} from './app-routing/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DownloaderComponent,
  ],
  imports: [
    BrowserModule,
    AngularModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule, // remove later
    HttpClientModule,
    ReactiveFormsModule,
    AmChartsModule,
    AccordionModule.forRoot(),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
