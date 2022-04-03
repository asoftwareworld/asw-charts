import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AswBarColumn } from './component/bar-column';

@NgModule({
    declarations: [
        AswBarColumn
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AswBarColumn
    ],
    providers: [
        CurrencyPipe
    ]
})
export class AswBarColumnModule { }
