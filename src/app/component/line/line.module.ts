import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { AswLine } from './component/line';
import { AswCurrencyPipe } from '@asoftwareworld/charts/core';

@NgModule({
    declarations: [
        AswLine
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AswLine
    ],
    providers: [
        PercentPipe,
        AswCurrencyPipe,
        CurrencyPipe
    ]
})
export class AswLineModule { }
