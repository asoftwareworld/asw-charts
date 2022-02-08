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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3ktcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9jb21wb25lbnQvY29yZS9waXBlL2N1cnJlbmN5LXBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFJekUsTUFBTSxPQUFPLGVBQWU7SUFDeEIsWUFDK0IsTUFBYyxFQUNGLHNCQUE4QixLQUFLO1FBRC9DLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDRix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQWdCO0lBQUksQ0FBQztJQU9uRixTQUFTLENBQ0wsS0FBeUMsRUFBRSxlQUF1QixJQUFJLENBQUMsbUJBQW1CLEVBQzFGLFVBQWtFLFFBQVEsRUFBRSxVQUFtQixFQUMvRixNQUFlO1FBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDO1NBQUU7UUFFckMsTUFBTSxHQUFHLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRS9CLElBQUksT0FBTyxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQzlCLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1NBQ3pDO1FBRUQsSUFBSSxRQUFRLEdBQVcsWUFBWSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztRQUNoRSxJQUFJLE9BQU8sS0FBSyxNQUFNLEVBQUU7WUFDcEIsSUFBSSxPQUFPLEtBQUssUUFBUSxJQUFJLE9BQU8sS0FBSyxlQUFlLEVBQUU7Z0JBQ3JELFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDNUY7aUJBQU07Z0JBQ0gsUUFBUSxHQUFHLE9BQU8sQ0FBQzthQUN0QjtTQUNKO1FBRUQsSUFBSTtZQUNBLE1BQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixNQUFNLGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDMUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQy9CLE9BQU8saUJBQWlCLENBQUM7U0FDNUI7UUFBQyxPQUFPLEtBQVUsRUFBRTtZQUNqQixNQUFNLHdCQUF3QixDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbEU7SUFDTCxDQUFDOzs7WUExQ0osSUFBSSxTQUFDO2dCQUNGLElBQUksRUFBRSxpQkFBaUI7YUFDMUI7Ozt5Q0FHUSxNQUFNLFNBQUMsU0FBUzt5Q0FDaEIsTUFBTSxTQUFDLHFCQUFxQjs7QUF1Q3JDLFNBQVMsT0FBTyxDQUFDLEtBQXlDO0lBQ3RELE9BQU8sQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxLQUFLLEVBQUUsSUFBSSxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxXQUFXLENBQUMsS0FBc0I7SUFDdkMsNkJBQTZCO0lBQzdCLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUN4RSxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4QjtJQUNELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1FBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLGtCQUFrQixDQUFDLENBQUM7S0FDL0M7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBR0QsMkNBQTJDO0FBQ3ZDLHVDQUF1QztBQUN2Qyx3REFBd0Q7QUFDeEQsZ0JBQWdCO0FBQ2hCLElBQUk7QUFDSixxREFBcUQ7QUFDckQsMkNBQTJDO0FBQzNDLHFGQUFxRjtBQUNyRix3Q0FBd0M7QUFDeEMseUNBQXlDO0FBQ3pDLHVDQUF1QztBQUN2QyxtRkFBbUY7QUFDbkYsb0JBQW9CO0FBRXBCLHVCQUF1QjtBQUN2QixpREFBaUQ7QUFDakQsaURBQWlEO0FBQ2pELGdEQUFnRDtBQUNoRCxnREFBZ0Q7QUFDaEQsb0NBQW9DO0FBQ3BDLFNBQVM7QUFFVCxnQ0FBZ0M7QUFDaEMsMkNBQTJDO0FBQzNDLDZEQUE2RDtBQUM3RCw4QkFBOEI7QUFDOUIsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUMvQixzQkFBc0I7QUFDdEIsWUFBWTtBQUNaLFVBQVU7QUFFVixtREFBbUQ7QUFDbkQsa0RBQWtEO0FBQ2xELGdFQUFnRTtBQUNoRSxpQ0FBaUM7QUFDakMsZ0NBQWdDO0FBQ2hDLHNDQUFzQztBQUN0Qyx3QkFBd0I7QUFDeEIsZUFBZTtBQUNmLFdBQVc7QUFDWCx5REFBeUQ7QUFDekQsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgQVNXIChBIFNvZnR3YXJlIFdvcmxkKSBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxyXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgREVGQVVMVF9DVVJSRU5DWV9DT0RFLCBJbmplY3QsIExPQ0FMRV9JRCwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBmb3JtYXRDdXJyZW5jeSwgZ2V0Q3VycmVuY3lTeW1ib2wgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBpbnZhbGlkUGlwZUFyZ3VtZW50RXJyb3IgfSBmcm9tICcuL2ludmFsaWQtcGlwZS1hcmd1bWVudC1lcnJvcic7XHJcbkBQaXBlKHtcclxuICAgIG5hbWU6ICdhc3dDdXJyZW5jeVBpcGUnLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXN3Q3VycmVuY3lQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBASW5qZWN0KExPQ0FMRV9JRCkgcHJpdmF0ZSBsb2NhbGU6IHN0cmluZyxcclxuICAgICAgICBASW5qZWN0KERFRkFVTFRfQ1VSUkVOQ1lfQ09ERSkgcHJpdmF0ZSBkZWZhdWx0Q3VycmVuY3lDb2RlOiBzdHJpbmcgPSAnVVNEJykgeyB9XHJcblxyXG4gICAgdHJhbnNmb3JtKFxyXG4gICAgICAgIHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkLCBjdXJyZW5jeUNvZGU/OiBzdHJpbmcsXHJcbiAgICAgICAgZGlzcGxheT86ICdjb2RlJyB8ICdzeW1ib2wnIHwgJ3N5bWJvbC1uYXJyb3cnIHwgc3RyaW5nIHwgYm9vbGVhbiwgZGlnaXRzSW5mbz86IHN0cmluZyxcclxuICAgICAgICBsb2NhbGU/OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsO1xyXG5cclxuICAgIHRyYW5zZm9ybShcclxuICAgICAgICB2YWx1ZTogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCwgY3VycmVuY3lDb2RlOiBzdHJpbmcgPSB0aGlzLmRlZmF1bHRDdXJyZW5jeUNvZGUsXHJcbiAgICAgICAgZGlzcGxheTogJ2NvZGUnIHwgJ3N5bWJvbCcgfCAnc3ltYm9sLW5hcnJvdycgfCBzdHJpbmcgfCBib29sZWFuID0gJ3N5bWJvbCcsIGRpZ2l0c0luZm8/OiBzdHJpbmcsXHJcbiAgICAgICAgbG9jYWxlPzogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgICAgaWYgKCFpc1ZhbHVlKHZhbHVlKSkgeyByZXR1cm4gbnVsbDsgfVxyXG5cclxuICAgICAgICBsb2NhbGUgPSBsb2NhbGUgfHwgdGhpcy5sb2NhbGU7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgZGlzcGxheSA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXkgPSBkaXNwbGF5ID8gJ3N5bWJvbCcgOiAnY29kZSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY3VycmVuY3k6IHN0cmluZyA9IGN1cnJlbmN5Q29kZSB8fCB0aGlzLmRlZmF1bHRDdXJyZW5jeUNvZGU7XHJcbiAgICAgICAgaWYgKGRpc3BsYXkgIT09ICdjb2RlJykge1xyXG4gICAgICAgICAgICBpZiAoZGlzcGxheSA9PT0gJ3N5bWJvbCcgfHwgZGlzcGxheSA9PT0gJ3N5bWJvbC1uYXJyb3cnKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW5jeSA9IGdldEN1cnJlbmN5U3ltYm9sKGN1cnJlbmN5LCBkaXNwbGF5ID09PSAnc3ltYm9sJyA/ICd3aWRlJyA6ICduYXJyb3cnLCBsb2NhbGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY3VycmVuY3kgPSBkaXNwbGF5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBudW0gPSBzdHJUb051bWJlcih2YWx1ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZEN1cnJlbmN5ID0gZm9ybWF0Q3VycmVuY3kobnVtLCBsb2NhbGUsIGN1cnJlbmN5LCBjdXJyZW5jeUNvZGUsIGRpZ2l0c0luZm8pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmb3JtYXR0ZWRDdXJyZW5jeSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXR0ZWRDdXJyZW5jeTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgIHRocm93IGludmFsaWRQaXBlQXJndW1lbnRFcnJvcihBc3dDdXJyZW5jeVBpcGUsIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNWYWx1ZSh2YWx1ZTogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHZhbHVlIGlzIG51bWJlciB8IHN0cmluZyB7XHJcbiAgICByZXR1cm4gISh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSAnJyB8fCB2YWx1ZSAhPT0gdmFsdWUpO1xyXG59XHJcblxyXG4vKipcclxuICogVHJhbnNmb3JtcyBhIHN0cmluZyBpbnRvIGEgbnVtYmVyIChpZiBuZWVkZWQpLlxyXG4gKi9cclxuZnVuY3Rpb24gc3RyVG9OdW1iZXIodmFsdWU6IG51bWJlciB8IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAvLyBDb252ZXJ0IHN0cmluZ3MgdG8gbnVtYmVyc1xyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgIWlzTmFOKE51bWJlcih2YWx1ZSkgLSBwYXJzZUZsb2F0KHZhbHVlKSkpIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyKHZhbHVlKTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3ZhbHVlfSBpcyBub3QgYSBudW1iZXJgKTtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuXHJcbi8vIHRyYW5zZm9ybSh2YWx1ZTogYW55LCBhcmdzPzogYW55KTogYW55IHtcclxuICAgIC8vICAgICByZXR1cm4gdmFsdWUuY2hhckF0KDApID09PSAnLScgP1xyXG4gICAgLy8gICAgICAgICcoJyArIHZhbHVlLnN1YnN0cmluZygxLCB2YWx1ZS5sZW5ndGgpICsgJyknIDpcclxuICAgIC8vICAgICAgICB2YWx1ZTtcclxuICAgIC8vIH1cclxuICAgIC8vIHRyYW5zZm9ybSh2YWx1ZTogbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGFueSB7XHJcbiAgICAvLyAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XHJcbiAgICAvLyAgICAgaWYgKGlzTmFOKE51bWJlcih2YWx1ZSkpKSB7IHJldHVybiBudWxsOyB9IC8vIHdpbGwgb25seSB3b3JrIHZhbHVlIGlzIGEgbnVtYmVyXHJcbiAgICAvLyAgICAgaWYgKHZhbHVlID09PSAwKSB7IHJldHVybiBudWxsOyB9XHJcbiAgICAvLyAgICAgbGV0IGFicyA9IE1hdGguYWJzKE51bWJlcih2YWx1ZSkpO1xyXG4gICAgLy8gICAgIGNvbnN0IHJvdW5kZXIgPSBNYXRoLnBvdygxMCwgMSk7XHJcbiAgICAvLyAgICAgY29uc3QgaXNOZWdhdGl2ZSA9IE51bWJlcih2YWx1ZSkgPCAwOyAvLyB3aWxsIGFsc28gd29yayBmb3IgTmVnZXRpdmUgbnVtYmVyc1xyXG4gICAgLy8gICAgIGxldCBrZXkgPSAnJztcclxuXHJcbiAgICAvLyAgICAgY29uc3QgcG93ZXJzID0gW1xyXG4gICAgLy8gICAgICAgICB7IGtleTogJ1EnLCB2YWx1ZTogTWF0aC5wb3coMTAsIDE1KSB9LFxyXG4gICAgLy8gICAgICAgICB7IGtleTogJ1QnLCB2YWx1ZTogTWF0aC5wb3coMTAsIDEyKSB9LFxyXG4gICAgLy8gICAgICAgICB7IGtleTogJ0InLCB2YWx1ZTogTWF0aC5wb3coMTAsIDkpIH0sXHJcbiAgICAvLyAgICAgICAgIHsga2V5OiAnTScsIHZhbHVlOiBNYXRoLnBvdygxMCwgNikgfSxcclxuICAgIC8vICAgICAgICAgeyBrZXk6ICdLJywgdmFsdWU6IDEwMDAgfVxyXG4gICAgLy8gICAgIF07XHJcblxyXG4gICAgLy8gICAgIHBvd2Vycy5mb3JFYWNoKHBvd2VyID0+IHtcclxuICAgIC8vICAgICAgICAgbGV0IHJlZHVjZWQgPSBhYnMgLyBwb3dlci52YWx1ZTtcclxuICAgIC8vICAgICAgICAgcmVkdWNlZCA9IE1hdGgucm91bmQocmVkdWNlZCAqIHJvdW5kZXIpIC8gcm91bmRlcjtcclxuICAgIC8vICAgICAgICAgaWYgKHJlZHVjZWQgPj0gMSkge1xyXG4gICAgLy8gICAgICAgICAgICAgYWJzID0gcmVkdWNlZDtcclxuICAgIC8vICAgICAgICAgICAgIGtleSA9IHBvd2VyLmtleTtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybjtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0pO1xyXG5cclxuICAgIC8vICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHBvd2Vycy5sZW5ndGg7IGkrKykge1xyXG4gICAgLy8gICAgIC8vICAgICBsZXQgcmVkdWNlZCA9IGFicyAvIHBvd2Vyc1tpXS52YWx1ZTtcclxuICAgIC8vICAgICAvLyAgICAgcmVkdWNlZCA9IE1hdGgucm91bmQocmVkdWNlZCAqIHJvdW5kZXIpIC8gcm91bmRlcjtcclxuICAgIC8vICAgICAvLyAgICAgaWYgKHJlZHVjZWQgPj0gMSkge1xyXG4gICAgLy8gICAgIC8vICAgICAgICAgYWJzID0gcmVkdWNlZDtcclxuICAgIC8vICAgICAvLyAgICAgICAgIGtleSA9IHBvd2Vyc1tpXS5rZXk7XHJcbiAgICAvLyAgICAgLy8gICAgICAgICBicmVhaztcclxuICAgIC8vICAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIC8vIH1cclxuICAgIC8vICAgICByZXR1cm4gKGlzTmVnYXRpdmUgPyAnKCcgKyBhYnMgKyAnKScgOiBhYnMpICsga2V5O1xyXG4gICAgLy8gfVxyXG4iXX0=