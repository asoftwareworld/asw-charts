/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */

import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { AswPieDonut } from './component/pie-donut';
import { AswCurrencyPipe } from '@asoftwareworld/charts/core';

@NgModule({
    declarations: [
        AswPieDonut
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        AswPieDonut
    ],
    providers: [
        PercentPipe,
        AswCurrencyPipe,
        CurrencyPipe
    ]
})
export class AswPieDonutModule { }
