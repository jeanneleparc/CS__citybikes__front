import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MainMap } from 'src/app/components/main-map/main-map';
import { MainSidePanel } from 'src/app/components/main-side-panel/main-side-panel';
import { BarChart } from 'src/app/components/bar-chart/bar-chart';
import { NgChartsModule } from 'ng2-charts';
import { SelectScrollComponent } from 'src/app/components/select-scroll/select-scroll.component';
import { StatsRanking } from 'src/app/components/stats-ranking/stats-ranking';
import { AppComponent } from 'src/app/app.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DropdownMenuComponent } from 'src/app/components/dropdown-menu/dropdown-menu';
import { HandlePlural } from 'src/app/pipe/handle-plural';

@NgModule({
  declarations: [
    AppComponent,
    MainMap,
    MainSidePanel,
    BarChart,
    SelectScrollComponent,
    StatsRanking,
    DropdownMenuComponent,
    HandlePlural,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [HandlePlural],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
