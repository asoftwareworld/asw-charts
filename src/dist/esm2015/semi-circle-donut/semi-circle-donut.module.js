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
export class AswSemiCircleDonutModule {
}
AswSemiCircleDonutModule.decorators = [
    { type: NgModule, args: [{
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
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VtaS1jaXJjbGUtZG9udXQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL2NvbXBvbmVudC9zZW1pLWNpcmNsZS1kb251dC9zZW1pLWNpcmNsZS1kb251dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQWtCbkUsTUFBTSxPQUFPLHdCQUF3Qjs7O1lBaEJwQyxRQUFRLFNBQUM7Z0JBQ04sWUFBWSxFQUFFO29CQUNWLGtCQUFrQjtpQkFDckI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNMLFlBQVk7aUJBQ2Y7Z0JBQ0QsT0FBTyxFQUFFO29CQUNMLGtCQUFrQjtpQkFDckI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNQLFdBQVc7b0JBQ1gsWUFBWTtvQkFDWixRQUFRO2lCQUNYO2FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IEFTVyAoQSBTb2Z0d2FyZSBXb3JsZCkgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcclxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSwgQ3VycmVuY3lQaXBlLCBQZXJjZW50UGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEFzd1NlbWlDaXJjbGVEb251dCB9IGZyb20gJy4vY29tcG9uZW50L3NlbWktY2lyY2xlLWRvbnV0JztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBkZWNsYXJhdGlvbnM6IFtcclxuICAgICAgICBBc3dTZW1pQ2lyY2xlRG9udXRcclxuICAgIF0sXHJcbiAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgXSxcclxuICAgIGV4cG9ydHM6IFtcclxuICAgICAgICBBc3dTZW1pQ2lyY2xlRG9udXRcclxuICAgIF0sXHJcbiAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBQZXJjZW50UGlwZSxcclxuICAgICAgICBDdXJyZW5jeVBpcGUsXHJcbiAgICAgICAgRG9jdW1lbnRcclxuICAgIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFzd1NlbWlDaXJjbGVEb251dE1vZHVsZSB7IH1cclxuIl19