import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReportComponent } from './Component/report/report.component';
import { ChartsComponent } from './Component/charts/charts.component';
import { ReportDataService } from './services/report-data.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Page4Component } from './Component/page4/page4.component';
import { TryComponent } from './Component/try/try.component';


@NgModule({
  declarations: [
    AppComponent,
    ReportComponent,
    ChartsComponent,
    Page4Component,
    TryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
