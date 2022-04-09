import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { AswSankeyChart } from './component/sankey-chart';
import { AswCurrencyPipe } from '@asoftwareworld/charts/core';

@NgModule({
    declarations: [
        AswSankeyChart
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AswSankeyChart
    ],
    providers: [
        PercentPipe,
        AswCurrencyPipe,
        CurrencyPipe
    ]
})
export class AswSankeyChartModule { }
