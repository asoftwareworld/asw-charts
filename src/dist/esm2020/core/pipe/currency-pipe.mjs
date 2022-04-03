/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
import { DEFAULT_CURRENCY_CODE, Inject, LOCALE_ID, Pipe } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { invalidPipeArgumentError } from './invalid-pipe-argument-error';
import * as i0 from "@angular/core";
export class AswCurrencyPipe {
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
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DEFAULT_CURRENCY_CODE]
                }] }]; } });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3ktcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9jb21wb25lbnQvY29yZS9waXBlL2N1cnJlbmN5LXBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7O0FBSXpFLE1BQU0sT0FBTyxlQUFlO0lBQ3hCLFlBQytCLE1BQWMsRUFDRixzQkFBOEIsS0FBSztRQUQvQyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ0Ysd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFnQjtJQUFJLENBQUM7SUFPbkYsU0FBUyxDQUNMLEtBQXlDLEVBQUUsZUFBdUIsSUFBSSxDQUFDLG1CQUFtQixFQUMxRixVQUFrRSxRQUFRLEVBQUUsVUFBbUIsRUFDL0YsTUFBZTtRQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQztTQUFFO1FBRXJDLE1BQU0sR0FBRyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUUvQixJQUFJLE9BQU8sT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUM5QixPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztTQUN6QztRQUVELElBQUksUUFBUSxHQUFXLFlBQVksSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUM7UUFDaEUsSUFBSSxPQUFPLEtBQUssTUFBTSxFQUFFO1lBQ3BCLElBQUksT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssZUFBZSxFQUFFO2dCQUNyRCxRQUFRLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxFQUFFLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQzVGO2lCQUFNO2dCQUNILFFBQVEsR0FBRyxPQUFPLENBQUM7YUFDdEI7U0FDSjtRQUVELElBQUk7WUFDQSxNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0IsTUFBTSxpQkFBaUIsR0FBRyxjQUFjLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzFGLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUMvQixPQUFPLGlCQUFpQixDQUFDO1NBQzVCO1FBQUMsT0FBTyxLQUFVLEVBQUU7WUFDakIsTUFBTSx3QkFBd0IsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2xFO0lBQ0wsQ0FBQzs7NEdBdkNRLGVBQWUsa0JBRVosU0FBUyxhQUNULHFCQUFxQjswR0FIeEIsZUFBZTsyRkFBZixlQUFlO2tCQUgzQixJQUFJO21CQUFDO29CQUNGLElBQUksRUFBRSxpQkFBaUI7aUJBQzFCOzswQkFHUSxNQUFNOzJCQUFDLFNBQVM7OzBCQUNoQixNQUFNOzJCQUFDLHFCQUFxQjs7QUF1Q3JDLFNBQVMsT0FBTyxDQUFDLEtBQXlDO0lBQ3RELE9BQU8sQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxLQUFLLEVBQUUsSUFBSSxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxXQUFXLENBQUMsS0FBc0I7SUFDdkMsNkJBQTZCO0lBQzdCLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUN4RSxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4QjtJQUNELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLGtCQUFrQixDQUFDLENBQUM7S0FDL0M7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCBBU1cgKEEgU29mdHdhcmUgV29ybGQpIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXHJcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGVcclxuICovXHJcblxyXG5pbXBvcnQgeyBERUZBVUxUX0NVUlJFTkNZX0NPREUsIEluamVjdCwgTE9DQUxFX0lELCBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGZvcm1hdEN1cnJlbmN5LCBnZXRDdXJyZW5jeVN5bWJvbCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IGludmFsaWRQaXBlQXJndW1lbnRFcnJvciB9IGZyb20gJy4vaW52YWxpZC1waXBlLWFyZ3VtZW50LWVycm9yJztcclxuQFBpcGUoe1xyXG4gICAgbmFtZTogJ2Fzd0N1cnJlbmN5UGlwZScsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBc3dDdXJyZW5jeVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIGxvY2FsZTogc3RyaW5nLFxyXG4gICAgICAgIEBJbmplY3QoREVGQVVMVF9DVVJSRU5DWV9DT0RFKSBwcml2YXRlIGRlZmF1bHRDdXJyZW5jeUNvZGU6IHN0cmluZyA9ICdVU0QnKSB7IH1cclxuXHJcbiAgICB0cmFuc2Zvcm0oXHJcbiAgICAgICAgdmFsdWU6IG51bWJlciB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsIGN1cnJlbmN5Q29kZT86IHN0cmluZyxcclxuICAgICAgICBkaXNwbGF5PzogJ2NvZGUnIHwgJ3N5bWJvbCcgfCAnc3ltYm9sLW5hcnJvdycgfCBzdHJpbmcgfCBib29sZWFuLCBkaWdpdHNJbmZvPzogc3RyaW5nLFxyXG4gICAgICAgIGxvY2FsZT86IHN0cmluZyk6IHN0cmluZyB8IG51bGw7XHJcblxyXG4gICAgdHJhbnNmb3JtKFxyXG4gICAgICAgIHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLCBjdXJyZW5jeUNvZGU6IHN0cmluZyA9IHRoaXMuZGVmYXVsdEN1cnJlbmN5Q29kZSxcclxuICAgICAgICBkaXNwbGF5OiAnY29kZScgfCAnc3ltYm9sJyB8ICdzeW1ib2wtbmFycm93JyB8IHN0cmluZyB8IGJvb2xlYW4gPSAnc3ltYm9sJywgZGlnaXRzSW5mbz86IHN0cmluZyxcclxuICAgICAgICBsb2NhbGU/OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgICBpZiAoIWlzVmFsdWUodmFsdWUpKSB7IHJldHVybiBudWxsOyB9XHJcblxyXG4gICAgICAgIGxvY2FsZSA9IGxvY2FsZSB8fCB0aGlzLmxvY2FsZTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBkaXNwbGF5ID09PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgZGlzcGxheSA9IGRpc3BsYXkgPyAnc3ltYm9sJyA6ICdjb2RlJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW5jeTogc3RyaW5nID0gY3VycmVuY3lDb2RlIHx8IHRoaXMuZGVmYXVsdEN1cnJlbmN5Q29kZTtcclxuICAgICAgICBpZiAoZGlzcGxheSAhPT0gJ2NvZGUnKSB7XHJcbiAgICAgICAgICAgIGlmIChkaXNwbGF5ID09PSAnc3ltYm9sJyB8fCBkaXNwbGF5ID09PSAnc3ltYm9sLW5hcnJvdycpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbmN5ID0gZ2V0Q3VycmVuY3lTeW1ib2woY3VycmVuY3ksIGRpc3BsYXkgPT09ICdzeW1ib2wnID8gJ3dpZGUnIDogJ25hcnJvdycsIGxvY2FsZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW5jeSA9IGRpc3BsYXk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG51bSA9IHN0clRvTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICAgICAgY29uc3QgZm9ybWF0dGVkQ3VycmVuY3kgPSBmb3JtYXRDdXJyZW5jeShudW0sIGxvY2FsZSwgY3VycmVuY3ksIGN1cnJlbmN5Q29kZSwgZGlnaXRzSW5mbyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZvcm1hdHRlZEN1cnJlbmN5KTtcclxuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlZEN1cnJlbmN5O1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhyb3cgaW52YWxpZFBpcGVBcmd1bWVudEVycm9yKEFzd0N1cnJlbmN5UGlwZSwgZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1ZhbHVlKHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKTogdmFsdWUgaXMgbnVtYmVyIHwgc3RyaW5nIHtcclxuICAgIHJldHVybiAhKHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09ICcnIHx8IHZhbHVlICE9PSB2YWx1ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUcmFuc2Zvcm1zIGEgc3RyaW5nIGludG8gYSBudW1iZXIgKGlmIG5lZWRlZCkuXHJcbiAqL1xyXG5mdW5jdGlvbiBzdHJUb051bWJlcih2YWx1ZTogbnVtYmVyIHwgc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIC8vIENvbnZlcnQgc3RyaW5ncyB0byBudW1iZXJzXHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAhaXNOYU4oTnVtYmVyKHZhbHVlKSAtIHBhcnNlRmxvYXQodmFsdWUpKSkge1xyXG4gICAgICAgIHJldHVybiBOdW1iZXIodmFsdWUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dmFsdWV9IGlzIG5vdCBhIG51bWJlcmApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5cclxuLy8gdHJhbnNmb3JtKHZhbHVlOiBhbnksIGFyZ3M/OiBhbnkpOiBhbnkge1xyXG4gICAgLy8gICAgIHJldHVybiB2YWx1ZS5jaGFyQXQoMCkgPT09ICctJyA/XHJcbiAgICAvLyAgICAgICAgJygnICsgdmFsdWUuc3Vic3RyaW5nKDEsIHZhbHVlLmxlbmd0aCkgKyAnKScgOlxyXG4gICAgLy8gICAgICAgIHZhbHVlO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gdHJhbnNmb3JtKHZhbHVlOiBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkKTogYW55IHtcclxuICAgIC8vICAgICBpZiAodmFsdWUgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cclxuICAgIC8vICAgICBpZiAoaXNOYU4oTnVtYmVyKHZhbHVlKSkpIHsgcmV0dXJuIG51bGw7IH0gLy8gd2lsbCBvbmx5IHdvcmsgdmFsdWUgaXMgYSBudW1iZXJcclxuICAgIC8vICAgICBpZiAodmFsdWUgPT09IDApIHsgcmV0dXJuIG51bGw7IH1cclxuICAgIC8vICAgICBsZXQgYWJzID0gTWF0aC5hYnMoTnVtYmVyKHZhbHVlKSk7XHJcbiAgICAvLyAgICAgY29uc3Qgcm91bmRlciA9IE1hdGgucG93KDEwLCAxKTtcclxuICAgIC8vICAgICBjb25zdCBpc05lZ2F0aXZlID0gTnVtYmVyKHZhbHVlKSA8IDA7IC8vIHdpbGwgYWxzbyB3b3JrIGZvciBOZWdldGl2ZSBudW1iZXJzXHJcbiAgICAvLyAgICAgbGV0IGtleSA9ICcnO1xyXG5cclxuICAgIC8vICAgICBjb25zdCBwb3dlcnMgPSBbXHJcbiAgICAvLyAgICAgICAgIHsga2V5OiAnUScsIHZhbHVlOiBNYXRoLnBvdygxMCwgMTUpIH0sXHJcbiAgICAvLyAgICAgICAgIHsga2V5OiAnVCcsIHZhbHVlOiBNYXRoLnBvdygxMCwgMTIpIH0sXHJcbiAgICAvLyAgICAgICAgIHsga2V5OiAnQicsIHZhbHVlOiBNYXRoLnBvdygxMCwgOSkgfSxcclxuICAgIC8vICAgICAgICAgeyBrZXk6ICdNJywgdmFsdWU6IE1hdGgucG93KDEwLCA2KSB9LFxyXG4gICAgLy8gICAgICAgICB7IGtleTogJ0snLCB2YWx1ZTogMTAwMCB9XHJcbiAgICAvLyAgICAgXTtcclxuXHJcbiAgICAvLyAgICAgcG93ZXJzLmZvckVhY2gocG93ZXIgPT4ge1xyXG4gICAgLy8gICAgICAgICBsZXQgcmVkdWNlZCA9IGFicyAvIHBvd2VyLnZhbHVlO1xyXG4gICAgLy8gICAgICAgICByZWR1Y2VkID0gTWF0aC5yb3VuZChyZWR1Y2VkICogcm91bmRlcikgLyByb3VuZGVyO1xyXG4gICAgLy8gICAgICAgICBpZiAocmVkdWNlZCA+PSAxKSB7XHJcbiAgICAvLyAgICAgICAgICAgICBhYnMgPSByZWR1Y2VkO1xyXG4gICAgLy8gICAgICAgICAgICAga2V5ID0gcG93ZXIua2V5O1xyXG4gICAgLy8gICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSk7XHJcblxyXG4gICAgLy8gICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgcG93ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAvLyAgICAgLy8gICAgIGxldCByZWR1Y2VkID0gYWJzIC8gcG93ZXJzW2ldLnZhbHVlO1xyXG4gICAgLy8gICAgIC8vICAgICByZWR1Y2VkID0gTWF0aC5yb3VuZChyZWR1Y2VkICogcm91bmRlcikgLyByb3VuZGVyO1xyXG4gICAgLy8gICAgIC8vICAgICBpZiAocmVkdWNlZCA+PSAxKSB7XHJcbiAgICAvLyAgICAgLy8gICAgICAgICBhYnMgPSByZWR1Y2VkO1xyXG4gICAgLy8gICAgIC8vICAgICAgICAga2V5ID0gcG93ZXJzW2ldLmtleTtcclxuICAgIC8vICAgICAvLyAgICAgICAgIGJyZWFrO1xyXG4gICAgLy8gICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgLy8gfVxyXG4gICAgLy8gICAgIHJldHVybiAoaXNOZWdhdGl2ZSA/ICcoJyArIGFicyArICcpJyA6IGFicykgKyBrZXk7XHJcbiAgICAvLyB9XHJcbiJdfQ==