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
import * as i0 from "@angular/core";
export class AswSemiCircleDonutModule {
}
AswSemiCircleDonutModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswSemiCircleDonutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AswSemiCircleDonutModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswSemiCircleDonutModule, declarations: [AswSemiCircleDonut], imports: [CommonModule], exports: [AswSemiCircleDonut] });
AswSemiCircleDonutModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswSemiCircleDonutModule, providers: [
        PercentPipe,
        CurrencyPipe,
        Document
    ], imports: [[
            CommonModule,
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswSemiCircleDonutModule, decorators: [{
            type: NgModule,
            args: [{
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
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VtaS1jaXJjbGUtZG9udXQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL2NvbXBvbmVudC9zZW1pLWNpcmNsZS1kb251dC9zZW1pLWNpcmNsZS1kb251dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7QUFrQm5FLE1BQU0sT0FBTyx3QkFBd0I7O3FIQUF4Qix3QkFBd0I7c0hBQXhCLHdCQUF3QixpQkFkN0Isa0JBQWtCLGFBR2xCLFlBQVksYUFHWixrQkFBa0I7c0hBUWIsd0JBQXdCLGFBTnRCO1FBQ1AsV0FBVztRQUNYLFlBQVk7UUFDWixRQUFRO0tBQ1gsWUFWUTtZQUNMLFlBQVk7U0FDZjsyRkFVUSx3QkFBd0I7a0JBaEJwQyxRQUFRO21CQUFDO29CQUNOLFlBQVksRUFBRTt3QkFDVixrQkFBa0I7cUJBQ3JCO29CQUNELE9BQU8sRUFBRTt3QkFDTCxZQUFZO3FCQUNmO29CQUNELE9BQU8sRUFBRTt3QkFDTCxrQkFBa0I7cUJBQ3JCO29CQUNELFNBQVMsRUFBRTt3QkFDUCxXQUFXO3dCQUNYLFlBQVk7d0JBQ1osUUFBUTtxQkFDWDtpQkFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgQVNXIChBIFNvZnR3YXJlIFdvcmxkKSBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxyXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlLCBDdXJyZW5jeVBpcGUsIFBlcmNlbnRQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgQXN3U2VtaUNpcmNsZURvbnV0IH0gZnJvbSAnLi9jb21wb25lbnQvc2VtaS1jaXJjbGUtZG9udXQnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGRlY2xhcmF0aW9uczogW1xyXG4gICAgICAgIEFzd1NlbWlDaXJjbGVEb251dFxyXG4gICAgXSxcclxuICAgIGltcG9ydHM6IFtcclxuICAgICAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBdLFxyXG4gICAgZXhwb3J0czogW1xyXG4gICAgICAgIEFzd1NlbWlDaXJjbGVEb251dFxyXG4gICAgXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIFBlcmNlbnRQaXBlLFxyXG4gICAgICAgIEN1cnJlbmN5UGlwZSxcclxuICAgICAgICBEb2N1bWVudFxyXG4gICAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXN3U2VtaUNpcmNsZURvbnV0TW9kdWxlIHsgfVxyXG4iXX0=