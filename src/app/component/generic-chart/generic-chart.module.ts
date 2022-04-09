/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */

import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { AswGenericChart } from './generic-chart';
import { AswCurrencyPipe } from '@asoftwareworld/charts/core';

@NgModule({
    declarations: [
        AswGenericChart
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        AswGenericChart
    ],
    providers: [
        PercentPipe,
        AswCurrencyPipe,
        CurrencyPipe
    ]
})
export class AswGenericChartModule { }
