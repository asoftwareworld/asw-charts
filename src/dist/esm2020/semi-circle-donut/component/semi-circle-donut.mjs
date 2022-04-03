import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AswChartConstants, CurrencyCodeEnum, GridOptionsEnum } from '@asoftwareworld/charts/core';
import * as Highcharts from 'highcharts';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const HighchartsMore = require('highcharts/highcharts-more.src');
HighchartsMore(Highcharts);
const HighchartsSolidGauge = require('highcharts/modules/solid-gauge.src');
HighchartsSolidGauge(Highcharts);
export class AswSemiCircleDonut {
    constructor(percentPipe, currencyPipe) {
        this.percentPipe = percentPipe;
        this.currencyPipe = currencyPipe;
        this.deviceSize = GridOptionsEnum.Large;
        this.viewInitialized = false;
        this.isLegendSort = true;
        this.isMute = false;
        this.isLegendDisplay = true;
        // @Input() chartType: ChartTypeEnum = ChartTypeEnum.Donut;
        this.currencyCode = CurrencyCodeEnum.INR;
        // @Input() legendPosition: LegendPositionEnum = LegendPositionEnum.Right;
        // @Input() legendType: LegendTypeEnum = LegendTypeEnum.Both;
        this.legendWidthPx = 250;
        this.donutSliceClick = new EventEmitter();
    }
    ngOnChanges() {
        if (!this.viewInitialized) {
            return;
        }
        this.initializeChart();
    }
    ngAfterViewInit() {
        this.viewInitialized = true;
        this.initializeChart();
    }
    initializeChart() {
        if (this.config) {
            this.cloneConfiguration = this.config;
            // const containerWidth = this.semiCircleDonutChart.nativeElement.clientWidth;
            // this.deviceSize = ObjectUtils.findDeviceSize(containerWidth);
            // this.findDeviceSize();
            // this.removeChartCredit();
            // this.setSemiDonutChartTooltip();
            // const series: SeriesPieOptions[] = this.cloneConfiguration.series as SeriesPieOptions[];
            // this.setDonutChartSeriesOptions(series);
            // this.setDonutChartLegendOption(this.legendWidthPx);
            // // if (this.chartType === ChartTypeEnum.Donut) {
            // //     this.setDonutChartInnerText();
            // // }
            // this.donutChartSliceClick();
            Highcharts.chart(this.semiCircleDonutChart.nativeElement, this.cloneConfiguration);
        }
    }
    removeChartCredit() {
        this.cloneConfiguration.credits = {
            enabled: false
        };
    }
    setSemiDonutChartTooltip() {
        const this$ = this;
        this.cloneConfiguration.tooltip = {
            useHTML: true,
            split: false,
            backgroundColor: AswChartConstants.blackColor,
            borderColor: AswChartConstants.blackColor,
            style: {
                color: AswChartConstants.whiteColor,
                fontWeight: AswChartConstants.fontWeight
            },
            borderRadius: 0,
            enabled: this.isMute ? false : true,
            formatter() {
                const percentage = this.point.percentage;
                debugger;
                return `
                     <div class="row">
                         <div class="col-md-12 text-end">
                             <span style="color: ${this.point.color}">\u25A0</span>
                             <strong>${this.point.name}</strong>
                         </div>
                         <div class="col-md-12 text-end">
                             ${this$.percentPipe.transform(percentage / 100, '.2')}
                         </div>
                     </div>
                 `;
            }
        };
    }
    donutChartSliceClick() {
        if (this.isMute) {
            return;
        }
        this.cloneConfiguration.plotOptions = {
            series: {
                dataLabels: {
                    enabled: false
                },
                point: {
                    events: {
                        click: ((event) => {
                            // const pointClickEvent: PointClickEvent = {
                            //     name: event.point.name,
                            //     id: event.point.options.id,
                            //     percentage: event.point.percentage,
                            //     value: event.point.options.value,
                            //     target: event.point.options.target
                            // };
                            // this.donutSliceClick.emit(pointClickEvent);
                        })
                    }
                }
            }
        };
    }
    setDonutChartSeriesOptions(series) {
        series.forEach((seriesOption) => {
            seriesOption.allowPointSelect = true;
            seriesOption.showInLegend = true;
            // if (this.chartType === ChartTypeEnum.Donut) {
            //     seriesOption.innerSize = AswChartConstants.innerSize;
            // }
            if (this.isMute) {
                seriesOption.opacity = 0.35;
                seriesOption.states = {
                    hover: {
                        enabled: false
                    },
                    inactive: {
                        enabled: false
                    }
                };
                seriesOption.slicedOffset = 0;
            }
            seriesOption.cursor = AswChartConstants.pointer;
            const data = seriesOption.data;
            this.handleNegativeSeriesData(data);
            const sortedSeriesOptionData = this.isLegendSort ? this.sortSeriesData(data) : data;
            seriesOption.data = sortedSeriesOptionData;
        });
    }
    sortSeriesData(data) {
        // if (this.legendType === LegendTypeEnum.Default) {
        //     data.sort((a: any, b: any) => {
        //         return ('' + a.name).localeCompare(b.name);
        //     });
        //     return data;
        // } else {
        data.sort((a, b) => {
            if (a.y && b.y) {
                return a.value - b.value;
            }
            else {
                return 0;
            }
        });
        data.reverse();
        return data;
        // }
    }
    handleNegativeSeriesData(data) {
        data.forEach((element) => {
            element.value = element.y;
            element.y = element.y ? Math.abs(element.y) : 0.001;
        });
    }
    setDonutChartLegendOption(legendWidthPx) {
        const this$ = this;
        this.cloneConfiguration.legend = {
            useHTML: true,
            enabled: this.isMute ? false : this.isLegendDisplay,
            floating: false,
            // navigation: {
            //     arrowSize: 12
            // },
            align: this.setLegendAlignment(),
            layout: 'vertical',
            verticalAlign: this.setLegendVerticalAlignment(),
            symbolHeight: 10,
            symbolWidth: 10,
            symbolRadius: 0,
            itemMarginTop: 3,
            itemMarginBottom: 3,
            itemStyle: {
                fontSize: this.deviceSize === GridOptionsEnum.ExtraSmall ? '12px' : '14px',
                fontWeight: AswChartConstants.fontWeight
            },
            width: legendWidthPx + 15,
            title: {
                text: this$.setDonutChartLegendWithHeader(legendWidthPx + 15),
                style: {
                    fontSize: this.deviceSize === GridOptionsEnum.ExtraSmall
                        ? AswChartConstants.fontSize12 : AswChartConstants.fontSize14,
                    color: '#6c757d',
                    fontWeight: AswChartConstants.fontWeight,
                    fontFamily: '500 14px/20px Google Sans Text,Arial,Helvetica,sans-serif'
                }
            },
            labelFormatter() {
                const point = this;
                return this$.setDonutChartLegendWithHeader(legendWidthPx, point.name, point.percentage, point.options.value);
            }
        };
    }
    setFontSize() {
        return this.deviceSize === GridOptionsEnum.ExtraSmall ? AswChartConstants.fontSize14 : AswChartConstants.fontSize16;
    }
    setLegendAlignment() {
        if (this.deviceSize === GridOptionsEnum.ExtraSmall) {
            return 'center';
        }
        // else if (this.legendPosition === LegendPositionEnum.Right) {
        //     return LegendPositionEnum.Right;
        // } else if (this.legendPosition === LegendPositionEnum.Left) {
        //     return LegendPositionEnum.Left;
        // }
        else {
            return 'center';
        }
    }
    setLegendVerticalAlignment() {
        // if (this.deviceSize === GridOptionsEnum.ExtraSmall) {
        //     return LegendPositionEnum.Bottom;
        // } else if (this.legendPosition === LegendPositionEnum.Right) {
        //     return 'middle';
        // } else if (this.legendPosition === LegendPositionEnum.Left) {
        //     return 'middle';
        // } else {
        //     return LegendPositionEnum.Bottom;
        // }
        return 'bottom';
    }
    setDonutChartLegendWithHeader(legendWidthPx, name, percentage, value) {
        // let legendCategoryWidthPx: number;
        // let legendValueWidthPx: number;
        // let legendPercentageWidthPx: number;
        // switch (this.legendType) {
        //     case LegendTypeEnum.Default:
        //         return `
        //          <div style="width:${legendWidthPx}px">
        //              <div class="row">
        //                  <div class="col-md-12 col-sm-12 col-12">
        //                      ${name ? name : 'Category'}
        //                  </div>
        //              </div>
        //          </div>
        //          `;
        //     case LegendTypeEnum.Percentage:
        //         legendCategoryWidthPx = legendWidthPx * 0.9;
        //         legendPercentageWidthPx = legendWidthPx * 0.1;
        //         return `
        //          <div style="width:${legendCategoryWidthPx + legendPercentageWidthPx}px">
        //              <div class="row">
        //                  <div class="col-md-8 col-sm-8 col-8">
        //                      ${name ? name : 'Category'}
        //                  </div>
        //                  <div class="col-md-4 col-sm-4 col-4 text-end">
        //                      ${percentage ? this.percentPipe.transform(percentage / 100, '.0') : '%'}
        //                  </div>
        //              </div>
        //          </div>
        //          `;
        //     case LegendTypeEnum.Value:
        //         legendCategoryWidthPx = legendWidthPx * 0.5;
        //         legendValueWidthPx = legendWidthPx * 0.5;
        //         return `
        //          <div style="width:${legendCategoryWidthPx + legendValueWidthPx}px">
        //              <div class="row">
        //                  <div class="col-md-6 col-sm-6 col-6">
        //                      ${name ? name : 'Category'}
        //                  </div>
        //                  <div class="col-md-6 col-sm-6 col-6 text-end">
        //                      ${value ? this.currencyPipe.transform(value, 'INR') : 'Total'}
        //                  </div>
        //              </div>
        //          </div>
        //          `;
        //     default:
        //         legendCategoryWidthPx = legendWidthPx * 0.5;
        //         legendPercentageWidthPx = legendWidthPx * 0.1;
        //         legendValueWidthPx = legendWidthPx * 0.4;
        //         return `
        //          <div style="width:${legendCategoryWidthPx + legendPercentageWidthPx + legendValueWidthPx}px">
        //              <div class="row">
        //                  <div class="col-md-5 col-sm-5 col-5">
        //                      ${name ? name : 'Category'}
        //                  </div>
        //                  <div class="col-md-2 col-xs-2 col-2 text-end">
        //                      ${percentage ? this.percentPipe.transform(percentage / 100) : '%'}
        //                  </div>
        //                  <div class="col-md-5 col-sm-5 col-5 text-end">
        //                      ${value ? this.currencyPipe.transform(value, this.currencyCode) : 'Total'}
        //                  </div>
        //              </div>
        //          </div>
        //          `;
        // }
        return '';
    }
    findDeviceSize() {
        const containerWidth = this.semiCircleDonutChart.nativeElement.clientWidth;
        if (containerWidth >= 1400) {
            this.deviceSize = GridOptionsEnum.ExtraExtraLarge;
        }
        else if (containerWidth >= 1200) {
            this.deviceSize = GridOptionsEnum.ExtraLarge;
        }
        else if (containerWidth >= 992) {
            this.deviceSize = GridOptionsEnum.Large;
        }
        else if (containerWidth >= 768) {
            this.deviceSize = GridOptionsEnum.Medium;
        }
        else if (containerWidth >= 576) {
            this.deviceSize = GridOptionsEnum.Small;
        }
        else if (containerWidth < 576) {
            this.deviceSize = GridOptionsEnum.ExtraSmall;
        }
    }
    setDonutChartInnerText() {
        const this$ = this;
        this.cloneConfiguration.chart = {
            events: {
                load() {
                    let centerX;
                    let centerY;
                    let itemWidth;
                    this.series.forEach((element) => {
                        const points = element.points.slice(0, 1);
                        points.forEach((point) => {
                            centerX = this.plotLeft + (point.shapeArgs.x - point.shapeArgs.innerR) + 8;
                            centerY = this.plotTop + point.shapeArgs.y - 14;
                            itemWidth = (point.shapeArgs.innerR * 2) - 20;
                        });
                        if (this$.icon) {
                            this.renderer.label(this$.setInnerTextIcon(itemWidth), centerX, this$.deviceSize === GridOptionsEnum.ExtraSmall ? centerY - 20 : centerY - 25, undefined, 30, 30, true).css({
                                fontSize: this$.setFontSize(),
                                textAlign: AswChartConstants.centerAlign,
                                fontWeight: AswChartConstants.fontWeight
                            }).add();
                            this.renderer.label(this$.setInnerTextLabel(itemWidth), centerX, centerY, undefined, 30, 30, true).css({
                                fontSize: this$.setFontSize(),
                                textAlign: AswChartConstants.centerAlign,
                                fontWeight: AswChartConstants.fontWeight
                            }).add();
                            this.renderer.label(this$.setInnerTextValue(itemWidth), centerX, this$.deviceSize === GridOptionsEnum.ExtraSmall ? centerY + 20 : centerY + 25, undefined, 30, 30, true).css({
                                fontSize: this$.setFontSize(),
                                textAlign: AswChartConstants.centerAlign,
                                fontWeight: AswChartConstants.fontWeight
                            }).add();
                        }
                        else {
                            this.renderer.label(this$.setInnerTextLabel(itemWidth), centerX, this$.deviceSize === GridOptionsEnum.ExtraSmall ? centerY - 20 : centerY - 25, undefined, 30, 30, true).css({
                                fontSize: this$.setFontSize(),
                                textAlign: AswChartConstants.centerAlign,
                                fontWeight: AswChartConstants.fontWeight
                            }).add();
                            this.renderer.label(this$.setInnerTextValue(itemWidth), centerX, centerY, undefined, 30, 30, true).css({
                                fontSize: this$.setFontSize(),
                                textAlign: AswChartConstants.centerAlign,
                                fontWeight: AswChartConstants.fontWeight
                            }).add();
                            this.renderer.label(this$.setInnerTextTarget(itemWidth), centerX, this$.deviceSize === GridOptionsEnum.ExtraSmall ? centerY + 20 : centerY + 25, undefined, 30, 30, true).css({
                                fontSize: this$.setFontSize(),
                                textAlign: AswChartConstants.centerAlign,
                                fontWeight: AswChartConstants.fontWeight
                            }).add();
                        }
                    });
                }
            }
        };
    }
    setInnerTextLabel(width) {
        return `
         <div style="width: ${width}px; opacity: ${this.isMute ? 0.35 : 1}">
             <div class="row">
                 <div class="col-md-12 text-truncate">
                     ${this.label}
                 </div>
             </div>
         </div>
         `;
    }
    setInnerTextIcon(width) {
        return `
         <div style="width: ${width}px; opacity: ${this.isMute ? 0.35 : 1}">
             <div class="row">
                 <div class="col-md-12 text-truncate">
                     ${this.icon}
                 </div>
             </div>
         </div>
         `;
    }
    setInnerTextValue(width) {
        return `
         <div style="width: ${width}px; opacity: ${this.isMute ? 0.35 : 1}">
             <div class="row">
                 <div class="col-md-12 text-truncate">
                     <strong>${this.currencyPipe.transform(this.amount, this.currencyCode)}</strong>
                 </div>
             </div>
         </div>
         `;
    }
    setInnerTextTarget(width) {
        return `
         <div style="width: ${width}px; opacity: ${this.isMute ? 0.35 : 1}">
             <div class="row">
                 <div class="col-md-12 text-truncate">
                     ${this.target ? this.target : ''}
                 </div>
             </div>
         </div>
         `;
    }
}
AswSemiCircleDonut.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswSemiCircleDonut, deps: [{ token: i1.PercentPipe }, { token: i1.CurrencyPipe }], target: i0.ɵɵFactoryTarget.Component });
AswSemiCircleDonut.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: AswSemiCircleDonut, selector: "asw-semi-circle-donut", inputs: { config: "config", isLegendSort: "isLegendSort", isMute: "isMute", isLegendDisplay: "isLegendDisplay", icon: "icon", label: "label", amount: "amount", target: "target", currencyCode: "currencyCode", legendWidthPx: "legendWidthPx" }, outputs: { donutSliceClick: "donutSliceClick" }, viewQueries: [{ propertyName: "semiCircleDonutChart", first: true, predicate: ["semiCircleDonutChart"], descendants: true, static: true }, { propertyName: "chartId", first: true, predicate: ["chartId"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: "<div #semiCircleDonutChart></div>", styles: [""] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswSemiCircleDonut, decorators: [{
            type: Component,
            args: [{ selector: 'asw-semi-circle-donut', template: "<div #semiCircleDonutChart></div>", styles: [""] }]
        }], ctorParameters: function () { return [{ type: i1.PercentPipe }, { type: i1.CurrencyPipe }]; }, propDecorators: { config: [{
                type: Input
            }], isLegendSort: [{
                type: Input
            }], isMute: [{
                type: Input
            }], isLegendDisplay: [{
                type: Input
            }], icon: [{
                type: Input
            }], label: [{
                type: Input
            }], amount: [{
                type: Input
            }], target: [{
                type: Input
            }], currencyCode: [{
                type: Input
            }], legendWidthPx: [{
                type: Input
            }], donutSliceClick: [{
                type: Output
            }], semiCircleDonutChart: [{
                type: ViewChild,
                args: ['semiCircleDonutChart', { static: true }]
            }], chartId: [{
                type: ViewChild,
                args: ['chartId', { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VtaS1jaXJjbGUtZG9udXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hcHAvY29tcG9uZW50L3NlbWktY2lyY2xlLWRvbnV0L2NvbXBvbmVudC9zZW1pLWNpcmNsZS1kb251dC50cyIsIi4uLy4uLy4uLy4uL2FwcC9jb21wb25lbnQvc2VtaS1jaXJjbGUtZG9udXQvY29tcG9uZW50L3NlbWktY2lyY2xlLWRvbnV0Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsT0FBTyxFQUFpQixTQUFTLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFBYSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hILE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUVuRyxPQUFPLEtBQUssVUFBVSxNQUFNLFlBQVksQ0FBQzs7O0FBRXpDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ2pFLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMzQixNQUFNLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBQzNFLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBb0JqQyxNQUFNLE9BQU8sa0JBQWtCO0lBdUIzQixZQUNZLFdBQXdCLEVBQ3hCLFlBQTBCO1FBRDFCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBdEIvQixlQUFVLEdBQW9CLGVBQWUsQ0FBQyxLQUFLLENBQUM7UUFDbkQsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFFdkIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLG9CQUFlLEdBQUcsSUFBSSxDQUFDO1FBS2hDLDJEQUEyRDtRQUNsRCxpQkFBWSxHQUFxQixnQkFBZ0IsQ0FBQyxHQUFHLENB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S0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csZUFBZTtzQkFBdkIsS0FBSztnQkFDRyxJQUFJO3NCQUFaLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBRUcsWUFBWTtzQkFBcEIsS0FBSztnQkFHRyxhQUFhO3NCQUFyQixLQUFLO2dCQUVJLGVBQWU7c0JBQXhCLE1BQU07Z0JBRThDLG9CQUFvQjtzQkFBeEUsU0FBUzt1QkFBQyxzQkFBc0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBQ1gsT0FBTztzQkFBOUMsU0FBUzt1QkFBQyxTQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCBBU1cgKEEgU29mdHdhcmUgV29ybGQpIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXHJcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGVcclxuICovXHJcblxyXG5pbXBvcnQgeyBDdXJyZW5jeVBpcGUsIFBlcmNlbnRQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkNoYW5nZXMsIE91dHB1dCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFzd0NoYXJ0Q29uc3RhbnRzLCBDdXJyZW5jeUNvZGVFbnVtLCBHcmlkT3B0aW9uc0VudW0gfSBmcm9tICdAYXNvZnR3YXJld29ybGQvY2hhcnRzL2NvcmUnO1xyXG5pbXBvcnQgeyBPYmplY3RVdGlscyB9IGZyb20gJ0Bhc29mdHdhcmV3b3JsZC9jaGFydHMvdXRpbHMnO1xyXG5pbXBvcnQgKiBhcyBIaWdoY2hhcnRzIGZyb20gJ2hpZ2hjaGFydHMnO1xyXG5kZWNsYXJlIHZhciByZXF1aXJlOiBhbnk7XHJcbmNvbnN0IEhpZ2hjaGFydHNNb3JlID0gcmVxdWlyZSgnaGlnaGNoYXJ0cy9oaWdoY2hhcnRzLW1vcmUuc3JjJyk7XHJcbkhpZ2hjaGFydHNNb3JlKEhpZ2hjaGFydHMpO1xyXG5jb25zdCBIaWdoY2hhcnRzU29saWRHYXVnZSA9IHJlcXVpcmUoJ2hpZ2hjaGFydHMvbW9kdWxlcy9zb2xpZC1nYXVnZS5zcmMnKTtcclxuSGlnaGNoYXJ0c1NvbGlkR2F1Z2UoSGlnaGNoYXJ0cyk7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgQWxpZ25WYWx1ZSxcclxuICAgIE9wdGlvbnMsXHJcbiAgICBQb2ludENsaWNrRXZlbnRPYmplY3QsXHJcbiAgICBQb2ludE9wdGlvbnNPYmplY3QsXHJcbiAgICBQb2ludCxcclxuICAgIFNlcmllcyxcclxuICAgIFNlcmllc1BpZU9wdGlvbnMsXHJcbiAgICBWZXJ0aWNhbEFsaWduVmFsdWVcclxufSBmcm9tICdoaWdoY2hhcnRzJztcclxuXHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2Fzdy1zZW1pLWNpcmNsZS1kb251dCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vc2VtaS1jaXJjbGUtZG9udXQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9zZW1pLWNpcmNsZS1kb251dC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEFzd1NlbWlDaXJjbGVEb251dCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XHJcblxyXG4gICAgcHJpdmF0ZSBjbG9uZUNvbmZpZ3VyYXRpb24hOiBPcHRpb25zO1xyXG4gICAgcHVibGljIGRldmljZVNpemU6IEdyaWRPcHRpb25zRW51bSA9IEdyaWRPcHRpb25zRW51bS5MYXJnZTtcclxuICAgIHByaXZhdGUgdmlld0luaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKSBjb25maWchOiBPcHRpb25zO1xyXG4gICAgQElucHV0KCkgaXNMZWdlbmRTb3J0ID0gdHJ1ZTtcclxuICAgIEBJbnB1dCgpIGlzTXV0ZSA9IGZhbHNlO1xyXG4gICAgQElucHV0KCkgaXNMZWdlbmREaXNwbGF5ID0gdHJ1ZTtcclxuICAgIEBJbnB1dCgpIGljb24hOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBsYWJlbDogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgQElucHV0KCkgYW1vdW50OiBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkO1xyXG4gICAgQElucHV0KCkgdGFyZ2V0ITogc3RyaW5nO1xyXG4gICAgLy8gQElucHV0KCkgY2hhcnRUeXBlOiBDaGFydFR5cGVFbnVtID0gQ2hhcnRUeXBlRW51bS5Eb251dDtcclxuICAgIEBJbnB1dCgpIGN1cnJlbmN5Q29kZTogQ3VycmVuY3lDb2RlRW51bSA9IEN1cnJlbmN5Q29kZUVudW0uSU5SO1xyXG4gICAgLy8gQElucHV0KCkgbGVnZW5kUG9zaXRpb246IExlZ2VuZFBvc2l0aW9uRW51bSA9IExlZ2VuZFBvc2l0aW9uRW51bS5SaWdodDtcclxuICAgIC8vIEBJbnB1dCgpIGxlZ2VuZFR5cGU6IExlZ2VuZFR5cGVFbnVtID0gTGVnZW5kVHlwZUVudW0uQm90aDtcclxuICAgIEBJbnB1dCgpIGxlZ2VuZFdpZHRoUHggPSAyNTA7XHJcblxyXG4gICAgQE91dHB1dCgpIGRvbnV0U2xpY2VDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgICBAVmlld0NoaWxkKCdzZW1pQ2lyY2xlRG9udXRDaGFydCcsIHsgc3RhdGljOiB0cnVlIH0pIHNlbWlDaXJjbGVEb251dENoYXJ0ITogRWxlbWVudFJlZjtcclxuICAgIEBWaWV3Q2hpbGQoJ2NoYXJ0SWQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBjaGFydElkITogRWxlbWVudFJlZjtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgcGVyY2VudFBpcGU6IFBlcmNlbnRQaXBlLFxyXG4gICAgICAgIHByaXZhdGUgY3VycmVuY3lQaXBlOiBDdXJyZW5jeVBpcGUpIHsgfVxyXG5cclxuICAgIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy52aWV3SW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluaXRpYWxpemVDaGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnZpZXdJbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2hhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0aWFsaXplQ2hhcnQoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvbmVDb25maWd1cmF0aW9uID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gdGhpcy5zZW1pQ2lyY2xlRG9udXRDaGFydC5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmRldmljZVNpemUgPSBPYmplY3RVdGlscy5maW5kRGV2aWNlU2l6ZShjb250YWluZXJXaWR0aCk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuZmluZERldmljZVNpemUoKTtcclxuICAgICAgICAgICAgLy8gdGhpcy5yZW1vdmVDaGFydENyZWRpdCgpO1xyXG4gICAgICAgICAgIC8vIHRoaXMuc2V0U2VtaURvbnV0Q2hhcnRUb29sdGlwKCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHNlcmllczogU2VyaWVzUGllT3B0aW9uc1tdID0gdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24uc2VyaWVzIGFzIFNlcmllc1BpZU9wdGlvbnNbXTtcclxuICAgICAgICAgICAgLy8gdGhpcy5zZXREb251dENoYXJ0U2VyaWVzT3B0aW9ucyhzZXJpZXMpO1xyXG4gICAgICAgICAgICAvLyB0aGlzLnNldERvbnV0Q2hhcnRMZWdlbmRPcHRpb24odGhpcy5sZWdlbmRXaWR0aFB4KTtcclxuICAgICAgICAgICAgLy8gLy8gaWYgKHRoaXMuY2hhcnRUeXBlID09PSBDaGFydFR5cGVFbnVtLkRvbnV0KSB7XHJcbiAgICAgICAgICAgIC8vIC8vICAgICB0aGlzLnNldERvbnV0Q2hhcnRJbm5lclRleHQoKTtcclxuICAgICAgICAgICAgLy8gLy8gfVxyXG4gICAgICAgICAgICAvLyB0aGlzLmRvbnV0Q2hhcnRTbGljZUNsaWNrKCk7XHJcbiAgICAgICAgICAgIEhpZ2hjaGFydHMuY2hhcnQodGhpcy5zZW1pQ2lyY2xlRG9udXRDaGFydC5uYXRpdmVFbGVtZW50LCB0aGlzLmNsb25lQ29uZmlndXJhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlQ2hhcnRDcmVkaXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24uY3JlZGl0cyA9IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0U2VtaURvbnV0Q2hhcnRUb29sdGlwKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHRoaXMkOiB0aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmNsb25lQ29uZmlndXJhdGlvbi50b29sdGlwID0ge1xyXG4gICAgICAgICAgICB1c2VIVE1MOiB0cnVlLFxyXG4gICAgICAgICAgICBzcGxpdDogZmFsc2UsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogQXN3Q2hhcnRDb25zdGFudHMuYmxhY2tDb2xvcixcclxuICAgICAgICAgICAgYm9yZGVyQ29sb3I6IEFzd0NoYXJ0Q29uc3RhbnRzLmJsYWNrQ29sb3IsXHJcbiAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogQXN3Q2hhcnRDb25zdGFudHMud2hpdGVDb2xvcixcclxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAwLFxyXG4gICAgICAgICAgICBlbmFibGVkOiB0aGlzLmlzTXV0ZSA/IGZhbHNlIDogdHJ1ZSxcclxuICAgICAgICAgICAgZm9ybWF0dGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlOiBudW1iZXIgPSB0aGlzLnBvaW50LnBlcmNlbnRhZ2UgYXMgbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtZW5kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJjb2xvcjogJHt0aGlzLnBvaW50LmNvbG9yfVwiPlxcdTI1QTA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz4ke3RoaXMucG9pbnQubmFtZX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LWVuZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcyQucGVyY2VudFBpcGUudHJhbnNmb3JtKHBlcmNlbnRhZ2UgLyAxMDAsICcuMicpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZG9udXRDaGFydFNsaWNlQ2xpY2soKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNNdXRlKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuY2xvbmVDb25maWd1cmF0aW9uLnBsb3RPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBzZXJpZXM6IHtcclxuICAgICAgICAgICAgICAgIGRhdGFMYWJlbHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHBvaW50OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKGV2ZW50OiBQb2ludENsaWNrRXZlbnRPYmplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IHBvaW50Q2xpY2tFdmVudDogUG9pbnRDbGlja0V2ZW50ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIG5hbWU6IGV2ZW50LnBvaW50Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWQ6IGV2ZW50LnBvaW50Lm9wdGlvbnMuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgcGVyY2VudGFnZTogZXZlbnQucG9pbnQucGVyY2VudGFnZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB2YWx1ZTogZXZlbnQucG9pbnQub3B0aW9ucy52YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB0YXJnZXQ6IGV2ZW50LnBvaW50Lm9wdGlvbnMudGFyZ2V0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5kb251dFNsaWNlQ2xpY2suZW1pdChwb2ludENsaWNrRXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXREb251dENoYXJ0U2VyaWVzT3B0aW9ucyhzZXJpZXM6IFNlcmllc1BpZU9wdGlvbnNbXSk6IHZvaWQge1xyXG4gICAgICAgIHNlcmllcy5mb3JFYWNoKChzZXJpZXNPcHRpb246IFNlcmllc1BpZU9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgc2VyaWVzT3B0aW9uLmFsbG93UG9pbnRTZWxlY3QgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZXJpZXNPcHRpb24uc2hvd0luTGVnZW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy8gaWYgKHRoaXMuY2hhcnRUeXBlID09PSBDaGFydFR5cGVFbnVtLkRvbnV0KSB7XHJcbiAgICAgICAgICAgIC8vICAgICBzZXJpZXNPcHRpb24uaW5uZXJTaXplID0gQXN3Q2hhcnRDb25zdGFudHMuaW5uZXJTaXplO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTXV0ZSkge1xyXG4gICAgICAgICAgICAgICAgc2VyaWVzT3B0aW9uLm9wYWNpdHkgPSAwLjM1O1xyXG4gICAgICAgICAgICAgICAgc2VyaWVzT3B0aW9uLnN0YXRlcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBob3Zlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaW5hY3RpdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgc2VyaWVzT3B0aW9uLnNsaWNlZE9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VyaWVzT3B0aW9uLmN1cnNvciA9IEFzd0NoYXJ0Q29uc3RhbnRzLnBvaW50ZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IFBvaW50T3B0aW9uc09iamVjdFtdID0gc2VyaWVzT3B0aW9uLmRhdGEgYXMgUG9pbnRPcHRpb25zT2JqZWN0W107XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlTmVnYXRpdmVTZXJpZXNEYXRhKGRhdGEpO1xyXG4gICAgICAgICAgICBjb25zdCBzb3J0ZWRTZXJpZXNPcHRpb25EYXRhOiBQb2ludE9wdGlvbnNPYmplY3RbXSA9IHRoaXMuaXNMZWdlbmRTb3J0ID8gdGhpcy5zb3J0U2VyaWVzRGF0YShkYXRhKSA6IGRhdGE7XHJcbiAgICAgICAgICAgIHNlcmllc09wdGlvbi5kYXRhID0gc29ydGVkU2VyaWVzT3B0aW9uRGF0YTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNvcnRTZXJpZXNEYXRhKGRhdGE6IFBvaW50T3B0aW9uc09iamVjdFtdKTogUG9pbnRPcHRpb25zT2JqZWN0W10ge1xyXG4gICAgICAgIC8vIGlmICh0aGlzLmxlZ2VuZFR5cGUgPT09IExlZ2VuZFR5cGVFbnVtLkRlZmF1bHQpIHtcclxuICAgICAgICAvLyAgICAgZGF0YS5zb3J0KChhOiBhbnksIGI6IGFueSkgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuICgnJyArIGEubmFtZSkubG9jYWxlQ29tcGFyZShiLm5hbWUpO1xyXG4gICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAgICAgZGF0YS5zb3J0KChhOiBhbnksIGI6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGEueSAmJiBiLnkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS52YWx1ZSAtIGIudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZGF0YS5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZU5lZ2F0aXZlU2VyaWVzRGF0YShkYXRhOiBQb2ludE9wdGlvbnNPYmplY3RbXSk6IHZvaWQge1xyXG4gICAgICAgIGRhdGEuZm9yRWFjaCgoZWxlbWVudDogUG9pbnRPcHRpb25zT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSBlbGVtZW50Lnk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQueSA9IGVsZW1lbnQueSA/IE1hdGguYWJzKGVsZW1lbnQueSkgOiAwLjAwMTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldERvbnV0Q2hhcnRMZWdlbmRPcHRpb24obGVnZW5kV2lkdGhQeDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgdGhpcyQ6IHRoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2xvbmVDb25maWd1cmF0aW9uLmxlZ2VuZCA9IHtcclxuICAgICAgICAgICAgdXNlSFRNTDogdHJ1ZSxcclxuICAgICAgICAgICAgZW5hYmxlZDogdGhpcy5pc011dGUgPyBmYWxzZSA6IHRoaXMuaXNMZWdlbmREaXNwbGF5LFxyXG4gICAgICAgICAgICBmbG9hdGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgIC8vIG5hdmlnYXRpb246IHtcclxuICAgICAgICAgICAgLy8gICAgIGFycm93U2l6ZTogMTJcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgYWxpZ246IHRoaXMuc2V0TGVnZW5kQWxpZ25tZW50KCksXHJcbiAgICAgICAgICAgIGxheW91dDogJ3ZlcnRpY2FsJyxcclxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5zZXRMZWdlbmRWZXJ0aWNhbEFsaWdubWVudCgpLFxyXG4gICAgICAgICAgICBzeW1ib2xIZWlnaHQ6IDEwLFxyXG4gICAgICAgICAgICBzeW1ib2xXaWR0aDogMTAsXHJcbiAgICAgICAgICAgIHN5bWJvbFJhZGl1czogMCxcclxuICAgICAgICAgICAgaXRlbU1hcmdpblRvcDogMywgLy8gU3BhY2UgYmV0d2VlbiBlYWNoIGNhdGVnb3J5IGluIHRoZSBsZWdlbmRcclxuICAgICAgICAgICAgaXRlbU1hcmdpbkJvdHRvbTogMyxcclxuICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcy5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCA/ICcxMnB4JyA6ICcxNHB4JyxcclxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgd2lkdGg6IGxlZ2VuZFdpZHRoUHggKyAxNSxcclxuICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMkLnNldERvbnV0Q2hhcnRMZWdlbmRXaXRoSGVhZGVyKGxlZ2VuZFdpZHRoUHggKyAxNSksXHJcbiAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gQXN3Q2hhcnRDb25zdGFudHMuZm9udFNpemUxMiA6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRTaXplMTQsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNmM3NTdkJyxcclxuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICc1MDAgMTRweC8yMHB4IEdvb2dsZSBTYW5zIFRleHQsQXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWYnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxhYmVsRm9ybWF0dGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb2ludDogUG9pbnQgPSB0aGlzIGFzIFBvaW50O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMkLnNldERvbnV0Q2hhcnRMZWdlbmRXaXRoSGVhZGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZFdpZHRoUHgsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBwb2ludC5wZXJjZW50YWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50Lm9wdGlvbnMudmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEZvbnRTaXplKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGwgPyBBc3dDaGFydENvbnN0YW50cy5mb250U2l6ZTE0IDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFNpemUxNjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldExlZ2VuZEFsaWdubWVudCgpOiBBbGlnblZhbHVlIHtcclxuICAgICAgICBpZiAodGhpcy5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2NlbnRlcic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGVsc2UgaWYgKHRoaXMubGVnZW5kUG9zaXRpb24gPT09IExlZ2VuZFBvc2l0aW9uRW51bS5SaWdodCkge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gTGVnZW5kUG9zaXRpb25FbnVtLlJpZ2h0O1xyXG4gICAgICAgIC8vIH0gZWxzZSBpZiAodGhpcy5sZWdlbmRQb3NpdGlvbiA9PT0gTGVnZW5kUG9zaXRpb25FbnVtLkxlZnQpIHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIExlZ2VuZFBvc2l0aW9uRW51bS5MZWZ0O1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuICdjZW50ZXInO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldExlZ2VuZFZlcnRpY2FsQWxpZ25tZW50KCk6IFZlcnRpY2FsQWxpZ25WYWx1ZSB7XHJcbiAgICAgICAgLy8gaWYgKHRoaXMuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGwpIHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIExlZ2VuZFBvc2l0aW9uRW51bS5Cb3R0b207XHJcbiAgICAgICAgLy8gfSBlbHNlIGlmICh0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSBMZWdlbmRQb3NpdGlvbkVudW0uUmlnaHQpIHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuICdtaWRkbGUnO1xyXG4gICAgICAgIC8vIH0gZWxzZSBpZiAodGhpcy5sZWdlbmRQb3NpdGlvbiA9PT0gTGVnZW5kUG9zaXRpb25FbnVtLkxlZnQpIHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuICdtaWRkbGUnO1xyXG4gICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiBMZWdlbmRQb3NpdGlvbkVudW0uQm90dG9tO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICByZXR1cm4gJ2JvdHRvbSc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXREb251dENoYXJ0TGVnZW5kV2l0aEhlYWRlcihcclxuICAgICAgICBsZWdlbmRXaWR0aFB4OiBudW1iZXIsXHJcbiAgICAgICAgbmFtZT86IHN0cmluZyB8IG51bGwsXHJcbiAgICAgICAgcGVyY2VudGFnZT86IG51bWJlciB8IHVuZGVmaW5lZCxcclxuICAgICAgICB2YWx1ZT86IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xyXG4gICAgICAgIC8vIGxldCBsZWdlbmRDYXRlZ29yeVdpZHRoUHg6IG51bWJlcjtcclxuICAgICAgICAvLyBsZXQgbGVnZW5kVmFsdWVXaWR0aFB4OiBudW1iZXI7XHJcbiAgICAgICAgLy8gbGV0IGxlZ2VuZFBlcmNlbnRhZ2VXaWR0aFB4OiBudW1iZXI7XHJcbiAgICAgICAgLy8gc3dpdGNoICh0aGlzLmxlZ2VuZFR5cGUpIHtcclxuICAgICAgICAvLyAgICAgY2FzZSBMZWdlbmRUeXBlRW51bS5EZWZhdWx0OlxyXG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAvLyAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6JHtsZWdlbmRXaWR0aFB4fXB4XCI+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgY29sLXNtLTEyIGNvbC0xMlwiPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICR7bmFtZSA/IG5hbWUgOiAnQ2F0ZWdvcnknfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgICAgICAgIGA7XHJcbiAgICAgICAgLy8gICAgIGNhc2UgTGVnZW5kVHlwZUVudW0uUGVyY2VudGFnZTpcclxuICAgICAgICAvLyAgICAgICAgIGxlZ2VuZENhdGVnb3J5V2lkdGhQeCA9IGxlZ2VuZFdpZHRoUHggKiAwLjk7XHJcbiAgICAgICAgLy8gICAgICAgICBsZWdlbmRQZXJjZW50YWdlV2lkdGhQeCA9IGxlZ2VuZFdpZHRoUHggKiAwLjE7XHJcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgIC8vICAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDoke2xlZ2VuZENhdGVnb3J5V2lkdGhQeCArIGxlZ2VuZFBlcmNlbnRhZ2VXaWR0aFB4fXB4XCI+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtOCBjb2wtc20tOCBjb2wtOFwiPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICR7bmFtZSA/IG5hbWUgOiAnQ2F0ZWdvcnknfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTQgY29sLXNtLTQgY29sLTQgdGV4dC1lbmRcIj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAke3BlcmNlbnRhZ2UgPyB0aGlzLnBlcmNlbnRQaXBlLnRyYW5zZm9ybShwZXJjZW50YWdlIC8gMTAwLCAnLjAnKSA6ICclJ31cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAvLyAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAvLyAgICAgICAgICBgO1xyXG4gICAgICAgIC8vICAgICBjYXNlIExlZ2VuZFR5cGVFbnVtLlZhbHVlOlxyXG4gICAgICAgIC8vICAgICAgICAgbGVnZW5kQ2F0ZWdvcnlXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuNTtcclxuICAgICAgICAvLyAgICAgICAgIGxlZ2VuZFZhbHVlV2lkdGhQeCA9IGxlZ2VuZFdpZHRoUHggKiAwLjU7XHJcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgIC8vICAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDoke2xlZ2VuZENhdGVnb3J5V2lkdGhQeCArIGxlZ2VuZFZhbHVlV2lkdGhQeH1weFwiPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTYgY29sLXNtLTYgY29sLTZcIj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAke25hbWUgPyBuYW1lIDogJ0NhdGVnb3J5J31cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC02IGNvbC1zbS02IGNvbC02IHRleHQtZW5kXCI+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgJHt2YWx1ZSA/IHRoaXMuY3VycmVuY3lQaXBlLnRyYW5zZm9ybSh2YWx1ZSwgJ0lOUicpIDogJ1RvdGFsJ31cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAvLyAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAvLyAgICAgICAgICBgO1xyXG4gICAgICAgIC8vICAgICBkZWZhdWx0OlxyXG4gICAgICAgIC8vICAgICAgICAgbGVnZW5kQ2F0ZWdvcnlXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuNTtcclxuICAgICAgICAvLyAgICAgICAgIGxlZ2VuZFBlcmNlbnRhZ2VXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuMTtcclxuICAgICAgICAvLyAgICAgICAgIGxlZ2VuZFZhbHVlV2lkdGhQeCA9IGxlZ2VuZFdpZHRoUHggKiAwLjQ7XHJcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgIC8vICAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDoke2xlZ2VuZENhdGVnb3J5V2lkdGhQeCArIGxlZ2VuZFBlcmNlbnRhZ2VXaWR0aFB4ICsgbGVnZW5kVmFsdWVXaWR0aFB4fXB4XCI+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNSBjb2wtc20tNSBjb2wtNVwiPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICR7bmFtZSA/IG5hbWUgOiAnQ2F0ZWdvcnknfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTIgY29sLXhzLTIgY29sLTIgdGV4dC1lbmRcIj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAke3BlcmNlbnRhZ2UgPyB0aGlzLnBlcmNlbnRQaXBlLnRyYW5zZm9ybShwZXJjZW50YWdlIC8gMTAwKSA6ICclJ31cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC01IGNvbC1zbS01IGNvbC01IHRleHQtZW5kXCI+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgJHt2YWx1ZSA/IHRoaXMuY3VycmVuY3lQaXBlLnRyYW5zZm9ybSh2YWx1ZSwgdGhpcy5jdXJyZW5jeUNvZGUpIDogJ1RvdGFsJ31cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAvLyAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAvLyAgICAgICAgICBgO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaW5kRGV2aWNlU2l6ZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IHRoaXMuc2VtaUNpcmNsZURvbnV0Q2hhcnQubmF0aXZlRWxlbWVudC5jbGllbnRXaWR0aDtcclxuICAgICAgICBpZiAoY29udGFpbmVyV2lkdGggPj0gMTQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRldmljZVNpemUgPSBHcmlkT3B0aW9uc0VudW0uRXh0cmFFeHRyYUxhcmdlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGFpbmVyV2lkdGggPj0gMTIwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRldmljZVNpemUgPSBHcmlkT3B0aW9uc0VudW0uRXh0cmFMYXJnZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRhaW5lcldpZHRoID49IDk5Mikge1xyXG4gICAgICAgICAgICB0aGlzLmRldmljZVNpemUgPSBHcmlkT3B0aW9uc0VudW0uTGFyZ2U7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250YWluZXJXaWR0aCA+PSA3NjgpIHtcclxuICAgICAgICAgICAgdGhpcy5kZXZpY2VTaXplID0gR3JpZE9wdGlvbnNFbnVtLk1lZGl1bTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRhaW5lcldpZHRoID49IDU3Nikge1xyXG4gICAgICAgICAgICB0aGlzLmRldmljZVNpemUgPSBHcmlkT3B0aW9uc0VudW0uU21hbGw7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250YWluZXJXaWR0aCA8IDU3Nikge1xyXG4gICAgICAgICAgICB0aGlzLmRldmljZVNpemUgPSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXREb251dENoYXJ0SW5uZXJUZXh0KCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHRoaXMkOiB0aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmNsb25lQ29uZmlndXJhdGlvbi5jaGFydCA9IHtcclxuICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICBsb2FkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjZW50ZXJYOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNlbnRlclk6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbVdpZHRoOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJpZXMuZm9yRWFjaCgoZWxlbWVudDogU2VyaWVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50czogUG9pbnRbXSA9IGVsZW1lbnQucG9pbnRzLnNsaWNlKDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMuZm9yRWFjaCgocG9pbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyWCA9IHRoaXMucGxvdExlZnQgKyAocG9pbnQuc2hhcGVBcmdzLnggLSBwb2ludC5zaGFwZUFyZ3MuaW5uZXJSKSArIDg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXJZID0gdGhpcy5wbG90VG9wICsgcG9pbnQuc2hhcGVBcmdzLnkgLSAxNDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1XaWR0aCA9IChwb2ludC5zaGFwZUFyZ3MuaW5uZXJSICogMikgLSAyMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzJC5pY29uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmxhYmVsKHRoaXMkLnNldElubmVyVGV4dEljb24oaXRlbVdpZHRoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXJYLCB0aGlzJC5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCA/IGNlbnRlclkgLSAyMCA6IGNlbnRlclkgLSAyNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsIDMwLCAzMCwgdHJ1ZSkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IHRoaXMkLnNldEZvbnRTaXplKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogQXN3Q2hhcnRDb25zdGFudHMuY2VudGVyQWxpZ24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5hZGQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGFiZWwodGhpcyQuc2V0SW5uZXJUZXh0TGFiZWwoaXRlbVdpZHRoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB1bmRlZmluZWQsIDMwLCAzMCwgdHJ1ZSkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IHRoaXMkLnNldEZvbnRTaXplKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogQXN3Q2hhcnRDb25zdGFudHMuY2VudGVyQWxpZ24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5hZGQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGFiZWwodGhpcyQuc2V0SW5uZXJUZXh0VmFsdWUoaXRlbVdpZHRoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXJYLCB0aGlzJC5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCA/IGNlbnRlclkgKyAyMCA6IGNlbnRlclkgKyAyNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsIDMwLCAzMCwgdHJ1ZSkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IHRoaXMkLnNldEZvbnRTaXplKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogQXN3Q2hhcnRDb25zdGFudHMuY2VudGVyQWxpZ24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5hZGQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGFiZWwodGhpcyQuc2V0SW5uZXJUZXh0TGFiZWwoaXRlbVdpZHRoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXJYLCB0aGlzJC5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCA/IGNlbnRlclkgLSAyMCA6IGNlbnRlclkgLSAyNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsIDMwLCAzMCwgdHJ1ZSkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IHRoaXMkLnNldEZvbnRTaXplKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogQXN3Q2hhcnRDb25zdGFudHMuY2VudGVyQWxpZ24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5hZGQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGFiZWwodGhpcyQuc2V0SW5uZXJUZXh0VmFsdWUoaXRlbVdpZHRoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXJYLCBjZW50ZXJZLCB1bmRlZmluZWQsIDMwLCAzMCwgdHJ1ZSkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IHRoaXMkLnNldEZvbnRTaXplKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogQXN3Q2hhcnRDb25zdGFudHMuY2VudGVyQWxpZ24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5hZGQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGFiZWwodGhpcyQuc2V0SW5uZXJUZXh0VGFyZ2V0KGl0ZW1XaWR0aCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyWCwgdGhpcyQuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGwgPyBjZW50ZXJZICsgMjAgOiBjZW50ZXJZICsgMjUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLCAzMCwgMzAsIHRydWUpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzJC5zZXRGb250U2l6ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IEFzd0NoYXJ0Q29uc3RhbnRzLmNlbnRlckFsaWduLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuYWRkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRJbm5lclRleHRMYWJlbCh3aWR0aDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6ICR7d2lkdGh9cHg7IG9wYWNpdHk6ICR7dGhpcy5pc011dGUgPyAwLjM1IDogMX1cIj5cclxuICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtdHJ1bmNhdGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgJHt0aGlzLmxhYmVsfVxyXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0SW5uZXJUZXh0SWNvbih3aWR0aDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6ICR7d2lkdGh9cHg7IG9wYWNpdHk6ICR7dGhpcy5pc011dGUgPyAwLjM1IDogMX1cIj5cclxuICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtdHJ1bmNhdGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgJHt0aGlzLmljb259XHJcbiAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRJbm5lclRleHRWYWx1ZSh3aWR0aDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6ICR7d2lkdGh9cHg7IG9wYWNpdHk6ICR7dGhpcy5pc011dGUgPyAwLjM1IDogMX1cIj5cclxuICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtdHJ1bmNhdGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz4ke3RoaXMuY3VycmVuY3lQaXBlLnRyYW5zZm9ybSh0aGlzLmFtb3VudCwgdGhpcy5jdXJyZW5jeUNvZGUpfTwvc3Ryb25nPlxyXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0SW5uZXJUZXh0VGFyZ2V0KHdpZHRoOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogJHt3aWR0aH1weDsgb3BhY2l0eTogJHt0aGlzLmlzTXV0ZSA/IDAuMzUgOiAxfVwiPlxyXG4gICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC10cnVuY2F0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAke3RoaXMudGFyZ2V0ID8gdGhpcy50YXJnZXQgOiAnJ31cclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgYDtcclxuICAgIH1cclxufVxyXG4iLCI8ZGl2ICNzZW1pQ2lyY2xlRG9udXRDaGFydD48L2Rpdj4iXX0=