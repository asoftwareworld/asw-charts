import { ɵstringify, Pipe, Inject, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { getCurrencySymbol, formatCurrency } from '@angular/common';

/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
var CurrencyCodeEnum;
(function (CurrencyCodeEnum) {
    CurrencyCodeEnum["ALL"] = "Lek";
    CurrencyCodeEnum["AFN"] = "\u060B";
    CurrencyCodeEnum["ARS"] = "$";
    CurrencyCodeEnum["AWG"] = "\u0192";
    CurrencyCodeEnum["AUD"] = "$";
    CurrencyCodeEnum["AZN"] = "\u20BC";
    CurrencyCodeEnum["BSD"] = "$";
    CurrencyCodeEnum["INR"] = "INR";
    CurrencyCodeEnum["USD"] = "USD";
    CurrencyCodeEnum["EUR"] = "EUR";
    CurrencyCodeEnum["JPY"] = "JPY";
    CurrencyCodeEnum["Test"] = "PKR";
})(CurrencyCodeEnum || (CurrencyCodeEnum = {}));

/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
var GridOptionsEnum;
(function (GridOptionsEnum) {
    GridOptionsEnum["ExtraSmall"] = "xs";
    GridOptionsEnum["Small"] = "sm";
    GridOptionsEnum["Medium"] = "md";
    GridOptionsEnum["Large"] = "lg";
    GridOptionsEnum["ExtraLarge"] = "xl";
    GridOptionsEnum["ExtraExtraLarge"] = "xxl";
})(GridOptionsEnum || (GridOptionsEnum = {}));

/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
var LegendTypeEnum;
(function (LegendTypeEnum) {
    LegendTypeEnum["Default"] = "default";
    LegendTypeEnum["Percentage"] = "percentage";
    LegendTypeEnum["Value"] = "value";
    LegendTypeEnum["Both"] = "both";
})(LegendTypeEnum || (LegendTypeEnum = {}));
var LegendLayoutEnum;
(function (LegendLayoutEnum) {
    LegendLayoutEnum["Vertical"] = "vertical";
    LegendLayoutEnum["Horizontal"] = "horizontal";
    LegendLayoutEnum["Proximate"] = "proximate";
})(LegendLayoutEnum || (LegendLayoutEnum = {}));
var LegendPositionEnum;
(function (LegendPositionEnum) {
    LegendPositionEnum["Left"] = "left";
    LegendPositionEnum["Right"] = "right";
    LegendPositionEnum["Bottom"] = "bottom";
})(LegendPositionEnum || (LegendPositionEnum = {}));

/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
function invalidPipeArgumentError(type, value) {
    return Error(`InvalidPipeArgument: '${value}' for pipe '${ɵstringify(type)}'`);
}

/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
class AswCurrencyPipe {
    constructor(locale, defaultCurrencyCode = 'USD') {
        this.locale = locale;
        this.defaultCurrencyCode = defaultCurrencyCode;
    }
    transform(value, currencyCode = this.defaultCurrencyCode, display = 'symbol', digitsInfo, locale) {
        if (!isValue(value)) {
            return null;
        }
        locale = locale || this.locale;
        if (typeof display === 'boolean') {
            display = display ? 'symbol' : 'code';
        }
        let currency = currencyCode || this.defaultCurrencyCode;
        if (display !== 'code') {
            if (display === 'symbol' || display === 'symbol-narrow') {
                currency = getCurrencySymbol(currency, display === 'symbol' ? 'wide' : 'narrow', locale);
            }
            else {
                currency = display;
            }
        }
        try {
            const num = strToNumber(value);
            const formattedCurrency = formatCurrency(num, locale, currency, currencyCode, digitsInfo);
            console.log(formattedCurrency);
            return formattedCurrency;
        }
        catch (error) {
            throw invalidPipeArgumentError(AswCurrencyPipe, error.message);
        }
    }
}
AswCurrencyPipe.decorators = [
    { type: Pipe, args: [{
                name: 'aswCurrencyPipe',
            },] }
];
AswCurrencyPipe.ctorParameters = () => [
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] },
    { type: String, decorators: [{ type: Inject, args: [DEFAULT_CURRENCY_CODE,] }] }
];
function isValue(value) {
    return !(value == null || value === '' || value !== value);
}
/**
 * Transforms a string into a number (if needed).
 */
function strToNumber(value) {
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

/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
class AswChartConstants {
}
AswChartConstants.whiteColor = '#ffffff';
AswChartConstants.blackColor = '#000000';
AswChartConstants.fontWeight = 'normal';
AswChartConstants.fontSize12 = '12px';
AswChartConstants.fontSize14 = '14px';
AswChartConstants.fontSize16 = '16px';
AswChartConstants.innerSize = '75%';
AswChartConstants.pointer = 'pointer';
AswChartConstants.centerAlign = 'center';

/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AswChartConstants, AswCurrencyPipe, CurrencyCodeEnum, GridOptionsEnum, LegendLayoutEnum, LegendPositionEnum, LegendTypeEnum };
//# sourceMappingURL=asoftwareworld-charts-core.js.map
