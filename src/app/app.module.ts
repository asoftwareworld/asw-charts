import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AswPieDonutModule } from '@asoftwareworld/charts/pie-donut';
import { AswSemiCircleDonutModule } from '@asoftwareworld/charts/semi-circle-donut';
import { AswLineModule } from '@asoftwareworld/charts/line';
import { AswSankeyChartModule } from '@asoftwareworld/charts/sankey-chart';
import { AswGenericChartModule } from '@asoftwareworld/charts/generic-chart';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,
        AswPieDonutModule,
        AswSemiCircleDonutModule,
        AswLineModule,
        AswSankeyChartModule,
        AswGenericChartModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
