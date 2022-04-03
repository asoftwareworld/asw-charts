import * as i0 from '@angular/core';
import { ɵstringify, LOCALE_ID, DEFAULT_CURRENCY_CODE, Pipe, Inject } from '@angular/core';
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
    CurrencyCodeEnum["Blank"] = "";
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
var PieLegendTypeEnum;
(function (PieLegendTypeEnum) {
    PieLegendTypeEnum["Default"] = "default";
    PieLegendTypeEnum["Percentage"] = "percentage";
    PieLegendTypeEnum["Value"] = "value";
    PieLegendTypeEnum["Both"] = "both";
})(PieLegendTypeEnum || (PieLegendTypeEnum = {}));
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
var ChartLegendTypeEnum;
(function (ChartLegendTypeEnum) {
    ChartLegendTypeEnum["Default"] = "default";
    ChartLegendTypeEnum["Both"] = "both";
})(ChartLegendTypeEnum || (ChartLegendTypeEnum = {}));

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
AswCurrencyPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswCurrencyPipe, deps: [{ token: LOCALE_ID }, { token: DEFAULT_CURRENCY_CODE }], target: i0.ɵɵFactoryTarget.Pipe });
AswCurrencyPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswCurrencyPipe, name: "aswCurrencyPipe" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswCurrencyPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'aswCurrencyPipe',
                }]
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Inject,
                        args: [LOCALE_ID]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DEFAULT_CURRENCY_CODE]
                    }] }];
    } });
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

export { AswChartConstants, AswCurrencyPipe, ChartLegendTypeEnum, CurrencyCodeEnum, GridOptionsEnum, LegendLayoutEnum, LegendPositionEnum, PieLegendTypeEnum };
//# sourceMappingURL=asoftwareworld-charts-core.mjs.map
