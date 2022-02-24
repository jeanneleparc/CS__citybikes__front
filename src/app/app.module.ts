import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MainMap } from 'src/app/components/main-map/main-map';
import { MainSidePanel } from 'src/app/components/main-side-panel/main-side-panel';
import { BarChart } from 'src/app/components/bar-chart/bar-chart';
import { ChartsModule } from 'ng2-charts';
import { SelectScrollComponent } from 'src/app/components/select-scroll/select-scroll.component';
import { StatsRanking } from './components/stats-ranking/stats-ranking';

@NgModule({
  declarations: [
    AppComponent,
    MainMap,
    MainSidePanel,
    BarChart,
    SelectScrollComponent,
    StatsRanking,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ChartsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
