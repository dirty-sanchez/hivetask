import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartModule } from 'angular2-highcharts';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';
import {InputChartDataComponent} from "./components/input-chart-data/input-chart-data.component";
import LdService from "./services/ld.service";

@NgModule({
  providers: [LdService],
  imports: [
      BrowserModule,
      ChartModule.forRoot(require('highcharts')),
      ReactiveFormsModule
  ],
  declarations: [ AppComponent, InputChartDataComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
