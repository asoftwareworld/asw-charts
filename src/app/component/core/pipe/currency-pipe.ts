/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */

import { DEFAULT_CURRENCY_CODE, Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { invalidPipeArgumentError } from './invalid-pipe-argument-error';
@Pipe({
    name: 'aswCurrencyPipe',
})
export class AswCurrencyPipe implements PipeTransform {
    constructor(
        @Inject(LOCALE_ID) private locale: string,
        @Inject(DEFAULT_CURRENCY_CODE) private defaultCurrencyCode: string = 'USD') { }

    transform(
        value: number | string | null | undefined, currencyCode?: string,
        display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean, digitsInfo?: string,
        locale?: string): string | null;

    transform(
        value: number | string | null | undefined, currencyCode: string = this.defaultCurrencyCode,
        display: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = 'symbol', digitsInfo?: string,
        locale?: string): string | null {
        if (!isValue(value)) { return null; }

        locale = locale || this.locale;

        if (typeof display === 'boolean') {
            display = display ? 'symbol' : 'code';
        }

        let currency: string = currencyCode || this.defaultCurrencyCode;
        if (display !== 'code') {
            if (display === 'symbol' || display === 'symbol-narrow') {
                currency = getCurrencySymbol(currency, display === 'symbol' ? 'wide' : 'narrow', locale);
            } else {
                currency = display;
            }
        }

        try {
            const num = strToNumber(value);
            const formattedCurrency = formatCurrency(num, locale, currency, currencyCode, digitsInfo);
            console.log(formattedCurrency);
            return formattedCurrency;
        } catch (error: any) {
            throw invalidPipeArgumentError(AswCurrencyPipe, error.message);
        }
    }
}

function isValue(value: number | string | null | undefined): value is number | string {
    return !(value == null || value === '' || value !== value);
}

/**
 * Transforms a string into a number (if needed).
 */
function strToNumber(value: number | string): number {
    // Convert strings to numbers
    if (typeof value === 'string' && !isNaN(Number(value) - parseFloat(value))) {
        return Number(value);
    }
    if (typeof value !== 'number') {
        throw new Error(`${value} is not a number`);
    }
    return value;
}


// transform(value: any, args?: any): any {
    //     return value.charAt(0) === '-' ?
    //        '(' + value.substring(1, value.length) + ')' :
    //        value;
    // }
    // transform(value: number | null | undefined): any {
    //     if (value === null) { return null; }
    //     if (isNaN(Number(value))) { return null; } // will only work value is a number
    //     if (value === 0) { return null; }
    //     let abs = Math.abs(Number(value));
    //     const rounder = Math.pow(10, 1);
    //     const isNegative = Number(value) < 0; // will also work for Negetive numbers
    //     let key = '';

    //     const powers = [
    //         { key: 'Q', value: Math.pow(10, 15) },
    //         { key: 'T', value: Math.pow(10, 12) },
    //         { key: 'B', value: Math.pow(10, 9) },
    //         { key: 'M', value: Math.pow(10, 6) },
    //         { key: 'K', value: 1000 }
    //     ];

    //     powers.forEach(power => {
    //         let reduced = abs / power.value;
    //         reduced = Math.round(reduced * rounder) / rounder;
    //         if (reduced >= 1) {
    //             abs = reduced;
    //             key = power.key;
    //             return;
    //         }
    //     });

    //     // for (let i = 0; i < powers.length; i++) {
    //     //     let reduced = abs / powers[i].value;
    //     //     reduced = Math.round(reduced * rounder) / rounder;
    //     //     if (reduced >= 1) {
    //     //         abs = reduced;
    //     //         key = powers[i].key;
    //     //         break;
    //     //     }
    //     // }
    //     return (isNegative ? '(' + abs + ')' : abs) + key;
    // }
