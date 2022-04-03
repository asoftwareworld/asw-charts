import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AswLine } from './component/line';

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
        CurrencyPipe
    ]
})
export class AswLineModule { }
