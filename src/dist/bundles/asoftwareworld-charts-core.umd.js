(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@asoftwareworld/charts/core', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.asoftwareworld = global.asoftwareworld || {}, global.asoftwareworld.charts = global.asoftwareworld.charts || {}, global.asoftwareworld.charts.core = {}), global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    /**
     * @license
     * Copyright ASW (A Software World) All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file
     */
    exports.CurrencyCodeEnum = void 0;
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
    })(exports.CurrencyCodeEnum || (exports.CurrencyCodeEnum = {}));

    /**
     * @license
     * Copyright ASW (A Software World) All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file
     */
    exports.GridOptionsEnum = void 0;
    (function (GridOptionsEnum) {
        GridOptionsEnum["ExtraSmall"] = "xs";
        GridOptionsEnum["Small"] = "sm";
        GridOptionsEnum["Medium"] = "md";
        GridOptionsEnum["Large"] = "lg";
        GridOptionsEnum["ExtraLarge"] = "xl";
        GridOptionsEnum["ExtraExtraLarge"] = "xxl";
    })(exports.GridOptionsEnum || (exports.GridOptionsEnum = {}));

    /**
     * @license
     * Copyright ASW (A Software World) All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file
     */
    exports.LegendTypeEnum = void 0;
    (function (LegendTypeEnum) {
        LegendTypeEnum["Default"] = "default";
        LegendTypeEnum["Percentage"] = "percentage";
        LegendTypeEnum["Value"] = "value";
        LegendTypeEnum["Both"] = "both";
    })(exports.LegendTypeEnum || (exports.LegendTypeEnum = {}));
    exports.LegendLayoutEnum = void 0;
    (function (LegendLayoutEnum) {
        LegendLayoutEnum["Vertical"] = "vertical";
        LegendLayoutEnum["Horizontal"] = "horizontal";
        LegendLayoutEnum["Proximate"] = "proximate";
    })(exports.LegendLayoutEnum || (exports.LegendLayoutEnum = {}));
    exports.LegendPositionEnum = void 0;
    (function (LegendPositionEnum) {
        LegendPositionEnum["Left"] = "left";
        LegendPositionEnum["Right"] = "right";
        LegendPositionEnum["Bottom"] = "bottom";
    })(exports.LegendPositionEnum || (exports.LegendPositionEnum = {}));

    /**
     * @license
     * Copyright ASW (A Software World) All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file
     */
    function invalidPipeArgumentError(type, value) {
        return Error("InvalidPipeArgument: '" + value + "' for pipe '" + core.ɵstringify(type) + "'");
    }

    /**
     * @license
     * Copyright ASW (A Software World) All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file
     */
    var AswCurrencyPipe = /** @class */ (function () {
        function AswCurrencyPipe(locale, defaultCurrencyCode) {
            if (defaultCurrencyCode === void 0) { defaultCurrencyCode = 'USD'; }
            this.locale = locale;
            this.defaultCurrencyCode = defaultCurrencyCode;
        }
        AswCurrencyPipe.prototype.transform = function (value, currencyCode, display, digitsInfo, locale) {
            if (currencyCode === void 0) { currencyCode = this.defaultCurrencyCode; }
            if (display === void 0) { display = 'symbol'; }
            if (!isValue(value)) {
                return null;
            }
            locale = locale || this.locale;
            if (typeof display === 'boolean') {
                display = display ? 'symbol' : 'code';
            }
            var currency = currencyCode || this.defaultCurrencyCode;
            if (display !== 'code') {
                if (display === 'symbol' || display === 'symbol-narrow') {
                    currency = common.getCurrencySymbol(currency, display === 'symbol' ? 'wide' : 'narrow', locale);
                }
                else {
                    currency = display;
                }
            }
            try {
                var num = strToNumber(value);
                var formattedCurrency = common.formatCurrency(num, locale, currency, currencyCode, digitsInfo);
                console.log(formattedCurrency);
                return formattedCurrency;
            }
            catch (error) {
                throw invalidPipeArgumentError(AswCurrencyPipe, error.message);
            }
        };
        return AswCurrencyPipe;
    }());
    AswCurrencyPipe.decorators = [
        { type: core.Pipe, args: [{
                    name: 'aswCurrencyPipe',
                },] }
    ];
    AswCurrencyPipe.ctorParameters = function () { return [
        { type: String, decorators: [{ type: core.Inject, args: [core.LOCALE_ID,] }] },
        { type: String, decorators: [{ type: core.Inject, args: [core.DEFAULT_CURRENCY_CODE,] }] }
    ]; };
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
            throw new Error(value + " is not a number");
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
    var AswChartConstants = /** @class */ (function () {
        function AswChartConstants() {
        }
        return AswChartConstants;
    }());
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

    exports.AswChartConstants = AswChartConstants;
    exports.AswCurrencyPipe = AswCurrencyPipe;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=asoftwareworld-charts-core.umd.js.map
