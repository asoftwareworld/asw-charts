/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */

import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { AswSemiCircleDonut } from './component/semi-circle-donut';

@NgModule({
    declarations: [
        AswSemiCircleDonut
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        AswSemiCircleDonut
    ],
    providers: [
        PercentPipe,
        CurrencyPipe,
        Document
    ]
})
export class AswSemiCircleDonutModule { }
