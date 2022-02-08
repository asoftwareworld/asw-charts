/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
import { PipeTransform } from '@angular/core';
export declare class AswCurrencyPipe implements PipeTransform {
    private locale;
    private defaultCurrencyCode;
    constructor(locale: string, defaultCurrencyCode?: string);
    transform(value: number | string | null | undefined, currencyCode?: string, display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean, digitsInfo?: string, locale?: string): string | null;
}
