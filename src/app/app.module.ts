import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MainMap } from './components/main-map/main-map';
import { MainSidePanel } from './components/main-side-panel/main-side-panel';
import { BarChart } from './components/bar-chart/bar-chart';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [AppComponent, MainMap, MainSidePanel, BarChart],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ChartsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
