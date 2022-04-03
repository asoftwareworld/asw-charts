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
import * as i0 from "@angular/core";
export class AswPieDonutModule {
}
AswPieDonutModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswPieDonutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AswPieDonutModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswPieDonutModule, declarations: [AswPieDonut], imports: [CommonModule], exports: [AswPieDonut] });
AswPieDonutModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswPieDonutModule, providers: [
        PercentPipe,
        AswCurrencyPipe,
        CurrencyPipe,
        Document
    ], imports: [[
            CommonModule,
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswPieDonutModule, decorators: [{
            type: NgModule,
            args: [{
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
                        CurrencyPipe,
                        Document
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllLWRvbnV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9jb21wb25lbnQvcGllLWRvbnV0L3BpZS1kb251dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDcEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDOztBQW1COUQsTUFBTSxPQUFPLGlCQUFpQjs7OEdBQWpCLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQWZ0QixXQUFXLGFBR1gsWUFBWSxhQUdaLFdBQVc7K0dBU04saUJBQWlCLGFBUGY7UUFDUCxXQUFXO1FBQ1gsZUFBZTtRQUNmLFlBQVk7UUFDWixRQUFRO0tBQ1gsWUFYUTtZQUNMLFlBQVk7U0FDZjsyRkFXUSxpQkFBaUI7a0JBakI3QixRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDVixXQUFXO3FCQUNkO29CQUNELE9BQU8sRUFBRTt3QkFDTCxZQUFZO3FCQUNmO29CQUNELE9BQU8sRUFBRTt3QkFDTCxXQUFXO3FCQUNkO29CQUNELFNBQVMsRUFBRTt3QkFDUCxXQUFXO3dCQUNYLGVBQWU7d0JBQ2YsWUFBWTt3QkFDWixRQUFRO3FCQUNYO2lCQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCBBU1cgKEEgU29mdHdhcmUgV29ybGQpIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXHJcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGVcclxuICovXHJcblxyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUsIEN1cnJlbmN5UGlwZSwgUGVyY2VudFBpcGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBBc3dQaWVEb251dCB9IGZyb20gJy4vY29tcG9uZW50L3BpZS1kb251dCc7XHJcbmltcG9ydCB7IEFzd0N1cnJlbmN5UGlwZSB9IGZyb20gJ0Bhc29mdHdhcmV3b3JsZC9jaGFydHMvY29yZSc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICAgICAgQXN3UGllRG9udXRcclxuICAgIF0sXHJcbiAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgXSxcclxuICAgIGV4cG9ydHM6IFtcclxuICAgICAgICBBc3dQaWVEb251dFxyXG4gICAgXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIFBlcmNlbnRQaXBlLFxyXG4gICAgICAgIEFzd0N1cnJlbmN5UGlwZSxcclxuICAgICAgICBDdXJyZW5jeVBpcGUsXHJcbiAgICAgICAgRG9jdW1lbnRcclxuICAgIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFzd1BpZURvbnV0TW9kdWxlIHsgfVxyXG4iXX0=