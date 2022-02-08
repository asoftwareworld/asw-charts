/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AswChartConstants, CurrencyCodeEnum, GridOptionsEnum } from '@asoftwareworld/charts/core';
import { ObjectUtils } from '@asoftwareworld/charts/utils';
import * as Highcharts from 'highcharts';
const HighchartsMore = require('highcharts/highcharts-more.src');
HighchartsMore(Highcharts);
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
            const containerWidth = this.semiCircleDonutChart.nativeElement.clientWidth;
            this.deviceSize = ObjectUtils.findDeviceSize(containerWidth);
            // this.findDeviceSize();
            // this.removeChartCredit();
            // this.setDonutChartTooltip();
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
    setDonutChartTooltip() {
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
                return `
                     <div class="row">
                         <div class="col-md-12 text-end">
                             <span style="color: ${this.point.color}">\u25A0</span>
                             <strong>${this.point.name}</strong>
                         </div>
                         <div class="col-md-12 text-end">
                             ${this$.percentPipe.transform(percentage / 100, '.2')}
                         </div>
                         <div class="col-md-12 text-end">
                             ${this$.currencyPipe.transform(this.point.options.value, this$.currencyCode)}
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
AswSemiCircleDonut.decorators = [
    { type: Component, args: [{
                selector: 'asw-semi-circle-donut',
                template: "<div #semiCircleDonutChart></div>",
                styles: [""]
            },] }
];
AswSemiCircleDonut.ctorParameters = () => [
    { type: PercentPipe },
    { type: CurrencyPipe }
];
AswSemiCircleDonut.propDecorators = {
    config: [{ type: Input }],
    isLegendSort: [{ type: Input }],
    isMute: [{ type: Input }],
    isLegendDisplay: [{ type: Input }],
    icon: [{ type: Input }],
    label: [{ type: Input }],
    amount: [{ type: Input }],
    target: [{ type: Input }],
    currencyCode: [{ type: Input }],
    legendWidthPx: [{ type: Input }],
    donutSliceClick: [{ type: Output }],
    semiCircleDonutChart: [{ type: ViewChild, args: ['semiCircleDonutChart', { static: true },] }],
    chartId: [{ type: ViewChild, args: ['chartId', { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VtaS1jaXJjbGUtZG9udXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hcHAvY29tcG9uZW50L3NlbWktY2lyY2xlLWRvbnV0L2NvbXBvbmVudC9zZW1pLWNpcmNsZS1kb251dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVELE9BQU8sRUFBaUIsU0FBUyxFQUFjLFlBQVksRUFBRSxLQUFLLEVBQWEsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4SCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDbkcsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzNELE9BQU8sS0FBSyxVQUFVLE1BQU0sWUFBWSxDQUFDO0FBRXpDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ2pFLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQW9CM0IsTUFBTSxPQUFPLGtCQUFrQjtJQXVCM0IsWUFDWSxXQUF3QixFQUN4QixZQUEwQjtRQUQxQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQXRCL0IsZUFBVSxHQUFvQixlQUFlLENBQUMsS0FBSyxDQUFDO1FBQ25ELG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBRXZCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZixvQkFBZSxHQUFHLElBQUksQ0FBQztRQUtoQywyREFBMkQ7UUFDbEQsaUJBQVksR0FBcUIsZ0JBQWdCLENBQUMsR0FBRyxDQUFDO1FBQy9ELDBFQUEwRTtRQUMxRSw2REFBNkQ7UUFDcEQsa0JBQWEsR0FBRyxHQUFHLENB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Qzs7O1lBcmNKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyw2Q0FBdUM7O2FBRTFDOzs7WUExQnNCLFdBQVc7WUFBekIsWUFBWTs7O3FCQWdDaEIsS0FBSzsyQkFDTCxLQUFLO3FCQUNMLEtBQUs7OEJBQ0wsS0FBSzttQkFDTCxLQUFLO29CQUNMLEtBQUs7cUJBQ0wsS0FBSztxQkFDTCxLQUFLOzJCQUVMLEtBQUs7NEJBR0wsS0FBSzs4QkFFTCxNQUFNO21DQUVOLFNBQVMsU0FBQyxzQkFBc0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7c0JBQ2xELFNBQVMsU0FBQyxTQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCBBU1cgKEEgU29mdHdhcmUgV29ybGQpIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXHJcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGVcclxuICovXHJcblxyXG5pbXBvcnQgeyBDdXJyZW5jeVBpcGUsIFBlcmNlbnRQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkNoYW5nZXMsIE91dHB1dCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFzd0NoYXJ0Q29uc3RhbnRzLCBDdXJyZW5jeUNvZGVFbnVtLCBHcmlkT3B0aW9uc0VudW0gfSBmcm9tICdAYXNvZnR3YXJld29ybGQvY2hhcnRzL2NvcmUnO1xyXG5pbXBvcnQgeyBPYmplY3RVdGlscyB9IGZyb20gJ0Bhc29mdHdhcmV3b3JsZC9jaGFydHMvdXRpbHMnO1xyXG5pbXBvcnQgKiBhcyBIaWdoY2hhcnRzIGZyb20gJ2hpZ2hjaGFydHMnO1xyXG5kZWNsYXJlIHZhciByZXF1aXJlOiBhbnk7XHJcbmNvbnN0IEhpZ2hjaGFydHNNb3JlID0gcmVxdWlyZSgnaGlnaGNoYXJ0cy9oaWdoY2hhcnRzLW1vcmUuc3JjJyk7XHJcbkhpZ2hjaGFydHNNb3JlKEhpZ2hjaGFydHMpO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIEFsaWduVmFsdWUsXHJcbiAgICBPcHRpb25zLFxyXG4gICAgUG9pbnRDbGlja0V2ZW50T2JqZWN0LFxyXG4gICAgUG9pbnRPcHRpb25zT2JqZWN0LFxyXG4gICAgUG9pbnQsXHJcbiAgICBTZXJpZXMsXHJcbiAgICBTZXJpZXNQaWVPcHRpb25zLFxyXG4gICAgVmVydGljYWxBbGlnblZhbHVlXHJcbn0gZnJvbSAnaGlnaGNoYXJ0cyc7XHJcblxyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdhc3ctc2VtaS1jaXJjbGUtZG9udXQnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL3NlbWktY2lyY2xlLWRvbnV0Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vc2VtaS1jaXJjbGUtZG9udXQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBc3dTZW1pQ2lyY2xlRG9udXQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xyXG5cclxuICAgIHByaXZhdGUgY2xvbmVDb25maWd1cmF0aW9uITogT3B0aW9ucztcclxuICAgIHB1YmxpYyBkZXZpY2VTaXplOiBHcmlkT3B0aW9uc0VudW0gPSBHcmlkT3B0aW9uc0VudW0uTGFyZ2U7XHJcbiAgICBwcml2YXRlIHZpZXdJbml0aWFsaXplZCA9IGZhbHNlO1xyXG4gICAgQElucHV0KCkgY29uZmlnITogT3B0aW9ucztcclxuICAgIEBJbnB1dCgpIGlzTGVnZW5kU29ydCA9IHRydWU7XHJcbiAgICBASW5wdXQoKSBpc011dGUgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpIGlzTGVnZW5kRGlzcGxheSA9IHRydWU7XHJcbiAgICBASW5wdXQoKSBpY29uITogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgbGFiZWw6IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIEBJbnB1dCgpIGFtb3VudDogbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZDtcclxuICAgIEBJbnB1dCgpIHRhcmdldCE6IHN0cmluZztcclxuICAgIC8vIEBJbnB1dCgpIGNoYXJ0VHlwZTogQ2hhcnRUeXBlRW51bSA9IENoYXJ0VHlwZUVudW0uRG9udXQ7XHJcbiAgICBASW5wdXQoKSBjdXJyZW5jeUNvZGU6IEN1cnJlbmN5Q29kZUVudW0gPSBDdXJyZW5jeUNvZGVFbnVtLklOUjtcclxuICAgIC8vIEBJbnB1dCgpIGxlZ2VuZFBvc2l0aW9uOiBMZWdlbmRQb3NpdGlvbkVudW0gPSBMZWdlbmRQb3NpdGlvbkVudW0uUmlnaHQ7XHJcbiAgICAvLyBASW5wdXQoKSBsZWdlbmRUeXBlOiBMZWdlbmRUeXBlRW51bSA9IExlZ2VuZFR5cGVFbnVtLkJvdGg7XHJcbiAgICBASW5wdXQoKSBsZWdlbmRXaWR0aFB4ID0gMjUwO1xyXG5cclxuICAgIEBPdXRwdXQoKSBkb251dFNsaWNlQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gICAgQFZpZXdDaGlsZCgnc2VtaUNpcmNsZURvbnV0Q2hhcnQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBzZW1pQ2lyY2xlRG9udXRDaGFydCE6IEVsZW1lbnRSZWY7XHJcbiAgICBAVmlld0NoaWxkKCdjaGFydElkJywgeyBzdGF0aWM6IHRydWUgfSkgY2hhcnRJZCE6IEVsZW1lbnRSZWY7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIHBlcmNlbnRQaXBlOiBQZXJjZW50UGlwZSxcclxuICAgICAgICBwcml2YXRlIGN1cnJlbmN5UGlwZTogQ3VycmVuY3lQaXBlKSB7IH1cclxuXHJcbiAgICBuZ09uQ2hhbmdlcygpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMudmlld0luaXRpYWxpemVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2hhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy52aWV3SW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNoYXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdGlhbGl6ZUNoYXJ0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZykge1xyXG4gICAgICAgICAgICB0aGlzLmNsb25lQ29uZmlndXJhdGlvbiA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgICAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IHRoaXMuc2VtaUNpcmNsZURvbnV0Q2hhcnQubmF0aXZlRWxlbWVudC5jbGllbnRXaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5kZXZpY2VTaXplID0gT2JqZWN0VXRpbHMuZmluZERldmljZVNpemUoY29udGFpbmVyV2lkdGgpO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmZpbmREZXZpY2VTaXplKCk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMucmVtb3ZlQ2hhcnRDcmVkaXQoKTtcclxuICAgICAgICAgICAgLy8gdGhpcy5zZXREb251dENoYXJ0VG9vbHRpcCgpO1xyXG4gICAgICAgICAgICAvLyBjb25zdCBzZXJpZXM6IFNlcmllc1BpZU9wdGlvbnNbXSA9IHRoaXMuY2xvbmVDb25maWd1cmF0aW9uLnNlcmllcyBhcyBTZXJpZXNQaWVPcHRpb25zW107XHJcbiAgICAgICAgICAgIC8vIHRoaXMuc2V0RG9udXRDaGFydFNlcmllc09wdGlvbnMoc2VyaWVzKTtcclxuICAgICAgICAgICAgLy8gdGhpcy5zZXREb251dENoYXJ0TGVnZW5kT3B0aW9uKHRoaXMubGVnZW5kV2lkdGhQeCk7XHJcbiAgICAgICAgICAgIC8vIC8vIGlmICh0aGlzLmNoYXJ0VHlwZSA9PT0gQ2hhcnRUeXBlRW51bS5Eb251dCkge1xyXG4gICAgICAgICAgICAvLyAvLyAgICAgdGhpcy5zZXREb251dENoYXJ0SW5uZXJUZXh0KCk7XHJcbiAgICAgICAgICAgIC8vIC8vIH1cclxuICAgICAgICAgICAgLy8gdGhpcy5kb251dENoYXJ0U2xpY2VDbGljaygpO1xyXG4gICAgICAgICAgICBIaWdoY2hhcnRzLmNoYXJ0KHRoaXMuc2VtaUNpcmNsZURvbnV0Q2hhcnQubmF0aXZlRWxlbWVudCwgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUNoYXJ0Q3JlZGl0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2xvbmVDb25maWd1cmF0aW9uLmNyZWRpdHMgPSB7XHJcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldERvbnV0Q2hhcnRUb29sdGlwKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHRoaXMkOiB0aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmNsb25lQ29uZmlndXJhdGlvbi50b29sdGlwID0ge1xyXG4gICAgICAgICAgICB1c2VIVE1MOiB0cnVlLFxyXG4gICAgICAgICAgICBzcGxpdDogZmFsc2UsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogQXN3Q2hhcnRDb25zdGFudHMuYmxhY2tDb2xvcixcclxuICAgICAgICAgICAgYm9yZGVyQ29sb3I6IEFzd0NoYXJ0Q29uc3RhbnRzLmJsYWNrQ29sb3IsXHJcbiAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogQXN3Q2hhcnRDb25zdGFudHMud2hpdGVDb2xvcixcclxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAwLFxyXG4gICAgICAgICAgICBlbmFibGVkOiB0aGlzLmlzTXV0ZSA/IGZhbHNlIDogdHJ1ZSxcclxuICAgICAgICAgICAgZm9ybWF0dGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlOiBudW1iZXIgPSB0aGlzLnBvaW50LnBlcmNlbnRhZ2UgYXMgbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LWVuZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiY29sb3I6ICR7dGhpcy5wb2ludC5jb2xvcn1cIj5cXHUyNUEwPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+JHt0aGlzLnBvaW50Lm5hbWV9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC1lbmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3RoaXMkLnBlcmNlbnRQaXBlLnRyYW5zZm9ybShwZXJjZW50YWdlIC8gMTAwLCAnLjInKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LWVuZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcyQuY3VycmVuY3lQaXBlLnRyYW5zZm9ybSh0aGlzLnBvaW50Lm9wdGlvbnMudmFsdWUsIHRoaXMkLmN1cnJlbmN5Q29kZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkb251dENoYXJ0U2xpY2VDbGljaygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5pc011dGUpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24ucGxvdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHNlcmllczoge1xyXG4gICAgICAgICAgICAgICAgZGF0YUxhYmVsczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcG9pbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgoZXZlbnQ6IFBvaW50Q2xpY2tFdmVudE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3QgcG9pbnRDbGlja0V2ZW50OiBQb2ludENsaWNrRXZlbnQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgbmFtZTogZXZlbnQucG9pbnQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBpZDogZXZlbnQucG9pbnQub3B0aW9ucy5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBwZXJjZW50YWdlOiBldmVudC5wb2ludC5wZXJjZW50YWdlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhbHVlOiBldmVudC5wb2ludC5vcHRpb25zLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRhcmdldDogZXZlbnQucG9pbnQub3B0aW9ucy50YXJnZXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmRvbnV0U2xpY2VDbGljay5lbWl0KHBvaW50Q2xpY2tFdmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldERvbnV0Q2hhcnRTZXJpZXNPcHRpb25zKHNlcmllczogU2VyaWVzUGllT3B0aW9uc1tdKTogdm9pZCB7XHJcbiAgICAgICAgc2VyaWVzLmZvckVhY2goKHNlcmllc09wdGlvbjogU2VyaWVzUGllT3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBzZXJpZXNPcHRpb24uYWxsb3dQb2ludFNlbGVjdCA9IHRydWU7XHJcbiAgICAgICAgICAgIHNlcmllc09wdGlvbi5zaG93SW5MZWdlbmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAvLyBpZiAodGhpcy5jaGFydFR5cGUgPT09IENoYXJ0VHlwZUVudW0uRG9udXQpIHtcclxuICAgICAgICAgICAgLy8gICAgIHNlcmllc09wdGlvbi5pbm5lclNpemUgPSBBc3dDaGFydENvbnN0YW50cy5pbm5lclNpemU7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNNdXRlKSB7XHJcbiAgICAgICAgICAgICAgICBzZXJpZXNPcHRpb24ub3BhY2l0eSA9IDAuMzU7XHJcbiAgICAgICAgICAgICAgICBzZXJpZXNPcHRpb24uc3RhdGVzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGhvdmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBpbmFjdGl2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBzZXJpZXNPcHRpb24uc2xpY2VkT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXJpZXNPcHRpb24uY3Vyc29yID0gQXN3Q2hhcnRDb25zdGFudHMucG9pbnRlcjtcclxuICAgICAgICAgICAgY29uc3QgZGF0YTogUG9pbnRPcHRpb25zT2JqZWN0W10gPSBzZXJpZXNPcHRpb24uZGF0YSBhcyBQb2ludE9wdGlvbnNPYmplY3RbXTtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVOZWdhdGl2ZVNlcmllc0RhdGEoZGF0YSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNvcnRlZFNlcmllc09wdGlvbkRhdGE6IFBvaW50T3B0aW9uc09iamVjdFtdID0gdGhpcy5pc0xlZ2VuZFNvcnQgPyB0aGlzLnNvcnRTZXJpZXNEYXRhKGRhdGEpIDogZGF0YTtcclxuICAgICAgICAgICAgc2VyaWVzT3B0aW9uLmRhdGEgPSBzb3J0ZWRTZXJpZXNPcHRpb25EYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc29ydFNlcmllc0RhdGEoZGF0YTogUG9pbnRPcHRpb25zT2JqZWN0W10pOiBQb2ludE9wdGlvbnNPYmplY3RbXSB7XHJcbiAgICAgICAgLy8gaWYgKHRoaXMubGVnZW5kVHlwZSA9PT0gTGVnZW5kVHlwZUVudW0uRGVmYXVsdCkge1xyXG4gICAgICAgIC8vICAgICBkYXRhLnNvcnQoKGE6IGFueSwgYjogYW55KSA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gKCcnICsgYS5uYW1lKS5sb2NhbGVDb21wYXJlKGIubmFtZSk7XHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkYXRhLnNvcnQoKGE6IGFueSwgYjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYS55ICYmIGIueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLnZhbHVlIC0gYi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkYXRhLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlTmVnYXRpdmVTZXJpZXNEYXRhKGRhdGE6IFBvaW50T3B0aW9uc09iamVjdFtdKTogdm9pZCB7XHJcbiAgICAgICAgZGF0YS5mb3JFYWNoKChlbGVtZW50OiBQb2ludE9wdGlvbnNPYmplY3QpID0+IHtcclxuICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IGVsZW1lbnQueTtcclxuICAgICAgICAgICAgZWxlbWVudC55ID0gZWxlbWVudC55ID8gTWF0aC5hYnMoZWxlbWVudC55KSA6IDAuMDAxO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0RG9udXRDaGFydExlZ2VuZE9wdGlvbihsZWdlbmRXaWR0aFB4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB0aGlzJDogdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24ubGVnZW5kID0ge1xyXG4gICAgICAgICAgICB1c2VIVE1MOiB0cnVlLFxyXG4gICAgICAgICAgICBlbmFibGVkOiB0aGlzLmlzTXV0ZSA/IGZhbHNlIDogdGhpcy5pc0xlZ2VuZERpc3BsYXksXHJcbiAgICAgICAgICAgIGZsb2F0aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgLy8gbmF2aWdhdGlvbjoge1xyXG4gICAgICAgICAgICAvLyAgICAgYXJyb3dTaXplOiAxMlxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICBhbGlnbjogdGhpcy5zZXRMZWdlbmRBbGlnbm1lbnQoKSxcclxuICAgICAgICAgICAgbGF5b3V0OiAndmVydGljYWwnLFxyXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnNldExlZ2VuZFZlcnRpY2FsQWxpZ25tZW50KCksXHJcbiAgICAgICAgICAgIHN5bWJvbEhlaWdodDogMTAsXHJcbiAgICAgICAgICAgIHN5bWJvbFdpZHRoOiAxMCxcclxuICAgICAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxyXG4gICAgICAgICAgICBpdGVtTWFyZ2luVG9wOiAzLCAvLyBTcGFjZSBiZXR3ZWVuIGVhY2ggY2F0ZWdvcnkgaW4gdGhlIGxlZ2VuZFxyXG4gICAgICAgICAgICBpdGVtTWFyZ2luQm90dG9tOiAzLFxyXG4gICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsID8gJzEycHgnIDogJzE0cHgnLFxyXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFdlaWdodFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB3aWR0aDogbGVnZW5kV2lkdGhQeCArIDE1LFxyXG4gICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogdGhpcyQuc2V0RG9udXRDaGFydExlZ2VuZFdpdGhIZWFkZXIobGVnZW5kV2lkdGhQeCArIDE1KSxcclxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IHRoaXMuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyBBc3dDaGFydENvbnN0YW50cy5mb250U2l6ZTEyIDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFNpemUxNCxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM2Yzc1N2QnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJzUwMCAxNHB4LzIwcHggR29vZ2xlIFNhbnMgVGV4dCxBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGFiZWxGb3JtYXR0ZXIoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50OiBQb2ludCA9IHRoaXMgYXMgUG9pbnQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcyQuc2V0RG9udXRDaGFydExlZ2VuZFdpdGhIZWFkZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgbGVnZW5kV2lkdGhQeCxcclxuICAgICAgICAgICAgICAgICAgICBwb2ludC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50LnBlcmNlbnRhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnQub3B0aW9ucy52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Rm9udFNpemUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCA/IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRTaXplMTQgOiBBc3dDaGFydENvbnN0YW50cy5mb250U2l6ZTE2O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0TGVnZW5kQWxpZ25tZW50KCk6IEFsaWduVmFsdWUge1xyXG4gICAgICAgIGlmICh0aGlzLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnY2VudGVyJztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZWxzZSBpZiAodGhpcy5sZWdlbmRQb3NpdGlvbiA9PT0gTGVnZW5kUG9zaXRpb25FbnVtLlJpZ2h0KSB7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiBMZWdlbmRQb3NpdGlvbkVudW0uUmlnaHQ7XHJcbiAgICAgICAgLy8gfSBlbHNlIGlmICh0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSBMZWdlbmRQb3NpdGlvbkVudW0uTGVmdCkge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gTGVnZW5kUG9zaXRpb25FbnVtLkxlZnQ7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2NlbnRlcic7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0TGVnZW5kVmVydGljYWxBbGlnbm1lbnQoKTogVmVydGljYWxBbGlnblZhbHVlIHtcclxuICAgICAgICAvLyBpZiAodGhpcy5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCkge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gTGVnZW5kUG9zaXRpb25FbnVtLkJvdHRvbTtcclxuICAgICAgICAvLyB9IGVsc2UgaWYgKHRoaXMubGVnZW5kUG9zaXRpb24gPT09IExlZ2VuZFBvc2l0aW9uRW51bS5SaWdodCkge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gJ21pZGRsZSc7XHJcbiAgICAgICAgLy8gfSBlbHNlIGlmICh0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSBMZWdlbmRQb3NpdGlvbkVudW0uTGVmdCkge1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gJ21pZGRsZSc7XHJcbiAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIExlZ2VuZFBvc2l0aW9uRW51bS5Cb3R0b207XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHJldHVybiAnYm90dG9tJztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldERvbnV0Q2hhcnRMZWdlbmRXaXRoSGVhZGVyKFxyXG4gICAgICAgIGxlZ2VuZFdpZHRoUHg6IG51bWJlcixcclxuICAgICAgICBuYW1lPzogc3RyaW5nIHwgbnVsbCxcclxuICAgICAgICBwZXJjZW50YWdlPzogbnVtYmVyIHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIHZhbHVlPzogbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XHJcbiAgICAgICAgLy8gbGV0IGxlZ2VuZENhdGVnb3J5V2lkdGhQeDogbnVtYmVyO1xyXG4gICAgICAgIC8vIGxldCBsZWdlbmRWYWx1ZVdpZHRoUHg6IG51bWJlcjtcclxuICAgICAgICAvLyBsZXQgbGVnZW5kUGVyY2VudGFnZVdpZHRoUHg6IG51bWJlcjtcclxuICAgICAgICAvLyBzd2l0Y2ggKHRoaXMubGVnZW5kVHlwZSkge1xyXG4gICAgICAgIC8vICAgICBjYXNlIExlZ2VuZFR5cGVFbnVtLkRlZmF1bHQ6XHJcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgIC8vICAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDoke2xlZ2VuZFdpZHRoUHh9cHhcIj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiBjb2wtc20tMTIgY29sLTEyXCI+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgJHtuYW1lID8gbmFtZSA6ICdDYXRlZ29yeSd9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgLy8gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgLy8gICAgICAgICAgYDtcclxuICAgICAgICAvLyAgICAgY2FzZSBMZWdlbmRUeXBlRW51bS5QZXJjZW50YWdlOlxyXG4gICAgICAgIC8vICAgICAgICAgbGVnZW5kQ2F0ZWdvcnlXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuOTtcclxuICAgICAgICAvLyAgICAgICAgIGxlZ2VuZFBlcmNlbnRhZ2VXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuMTtcclxuICAgICAgICAvLyAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgLy8gICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiR7bGVnZW5kQ2F0ZWdvcnlXaWR0aFB4ICsgbGVnZW5kUGVyY2VudGFnZVdpZHRoUHh9cHhcIj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC04IGNvbC1zbS04IGNvbC04XCI+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgJHtuYW1lID8gbmFtZSA6ICdDYXRlZ29yeSd9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNCBjb2wtc20tNCBjb2wtNCB0ZXh0LWVuZFwiPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICR7cGVyY2VudGFnZSA/IHRoaXMucGVyY2VudFBpcGUudHJhbnNmb3JtKHBlcmNlbnRhZ2UgLyAxMDAsICcuMCcpIDogJyUnfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgICAgICAgIGA7XHJcbiAgICAgICAgLy8gICAgIGNhc2UgTGVnZW5kVHlwZUVudW0uVmFsdWU6XHJcbiAgICAgICAgLy8gICAgICAgICBsZWdlbmRDYXRlZ29yeVdpZHRoUHggPSBsZWdlbmRXaWR0aFB4ICogMC41O1xyXG4gICAgICAgIC8vICAgICAgICAgbGVnZW5kVmFsdWVXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuNTtcclxuICAgICAgICAvLyAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgLy8gICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiR7bGVnZW5kQ2F0ZWdvcnlXaWR0aFB4ICsgbGVnZW5kVmFsdWVXaWR0aFB4fXB4XCI+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNiBjb2wtc20tNiBjb2wtNlwiPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICR7bmFtZSA/IG5hbWUgOiAnQ2F0ZWdvcnknfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTYgY29sLXNtLTYgY29sLTYgdGV4dC1lbmRcIj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAke3ZhbHVlID8gdGhpcy5jdXJyZW5jeVBpcGUudHJhbnNmb3JtKHZhbHVlLCAnSU5SJykgOiAnVG90YWwnfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgICAgICAgIGA7XHJcbiAgICAgICAgLy8gICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgLy8gICAgICAgICBsZWdlbmRDYXRlZ29yeVdpZHRoUHggPSBsZWdlbmRXaWR0aFB4ICogMC41O1xyXG4gICAgICAgIC8vICAgICAgICAgbGVnZW5kUGVyY2VudGFnZVdpZHRoUHggPSBsZWdlbmRXaWR0aFB4ICogMC4xO1xyXG4gICAgICAgIC8vICAgICAgICAgbGVnZW5kVmFsdWVXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuNDtcclxuICAgICAgICAvLyAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgLy8gICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiR7bGVnZW5kQ2F0ZWdvcnlXaWR0aFB4ICsgbGVnZW5kUGVyY2VudGFnZVdpZHRoUHggKyBsZWdlbmRWYWx1ZVdpZHRoUHh9cHhcIj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC01IGNvbC1zbS01IGNvbC01XCI+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgJHtuYW1lID8gbmFtZSA6ICdDYXRlZ29yeSd9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMiBjb2wteHMtMiBjb2wtMiB0ZXh0LWVuZFwiPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICR7cGVyY2VudGFnZSA/IHRoaXMucGVyY2VudFBpcGUudHJhbnNmb3JtKHBlcmNlbnRhZ2UgLyAxMDApIDogJyUnfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTUgY29sLXNtLTUgY29sLTUgdGV4dC1lbmRcIj5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAke3ZhbHVlID8gdGhpcy5jdXJyZW5jeVBpcGUudHJhbnNmb3JtKHZhbHVlLCB0aGlzLmN1cnJlbmN5Q29kZSkgOiAnVG90YWwnfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIC8vICAgICAgICAgIGA7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbmREZXZpY2VTaXplKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gdGhpcy5zZW1pQ2lyY2xlRG9udXRDaGFydC5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgICAgIGlmIChjb250YWluZXJXaWR0aCA+PSAxNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGV2aWNlU2l6ZSA9IEdyaWRPcHRpb25zRW51bS5FeHRyYUV4dHJhTGFyZ2U7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250YWluZXJXaWR0aCA+PSAxMjAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGV2aWNlU2l6ZSA9IEdyaWRPcHRpb25zRW51bS5FeHRyYUxhcmdlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGFpbmVyV2lkdGggPj0gOTkyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGV2aWNlU2l6ZSA9IEdyaWRPcHRpb25zRW51bS5MYXJnZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRhaW5lcldpZHRoID49IDc2OCkge1xyXG4gICAgICAgICAgICB0aGlzLmRldmljZVNpemUgPSBHcmlkT3B0aW9uc0VudW0uTWVkaXVtO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGFpbmVyV2lkdGggPj0gNTc2KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGV2aWNlU2l6ZSA9IEdyaWRPcHRpb25zRW51bS5TbWFsbDtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRhaW5lcldpZHRoIDwgNTc2KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGV2aWNlU2l6ZSA9IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldERvbnV0Q2hhcnRJbm5lclRleHQoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgdGhpcyQ6IHRoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2xvbmVDb25maWd1cmF0aW9uLmNoYXJ0ID0ge1xyXG4gICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgIGxvYWQoKTogdm9pZCB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNlbnRlclg6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2VudGVyWTogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtV2lkdGg6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcmllcy5mb3JFYWNoKChlbGVtZW50OiBTZXJpZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnRzOiBQb2ludFtdID0gZWxlbWVudC5wb2ludHMuc2xpY2UoMCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5mb3JFYWNoKChwb2ludDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXJYID0gdGhpcy5wbG90TGVmdCArIChwb2ludC5zaGFwZUFyZ3MueCAtIHBvaW50LnNoYXBlQXJncy5pbm5lclIpICsgODtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlclkgPSB0aGlzLnBsb3RUb3AgKyBwb2ludC5zaGFwZUFyZ3MueSAtIDE0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVdpZHRoID0gKHBvaW50LnNoYXBlQXJncy5pbm5lclIgKiAyKSAtIDIwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMkLmljb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGFiZWwodGhpcyQuc2V0SW5uZXJUZXh0SWNvbihpdGVtV2lkdGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlclgsIHRoaXMkLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsID8gY2VudGVyWSAtIDIwIDogY2VudGVyWSAtIDI1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCwgMzAsIDMwLCB0cnVlKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcyQuc2V0Rm9udFNpemUoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBBc3dDaGFydENvbnN0YW50cy5jZW50ZXJBbGlnbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFdlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmFkZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5sYWJlbCh0aGlzJC5zZXRJbm5lclRleHRMYWJlbChpdGVtV2lkdGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHVuZGVmaW5lZCwgMzAsIDMwLCB0cnVlKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcyQuc2V0Rm9udFNpemUoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBBc3dDaGFydENvbnN0YW50cy5jZW50ZXJBbGlnbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFdlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmFkZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5sYWJlbCh0aGlzJC5zZXRJbm5lclRleHRWYWx1ZShpdGVtV2lkdGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlclgsIHRoaXMkLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsID8gY2VudGVyWSArIDIwIDogY2VudGVyWSArIDI1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCwgMzAsIDMwLCB0cnVlKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcyQuc2V0Rm9udFNpemUoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBBc3dDaGFydENvbnN0YW50cy5jZW50ZXJBbGlnbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFdlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmFkZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5sYWJlbCh0aGlzJC5zZXRJbm5lclRleHRMYWJlbChpdGVtV2lkdGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlclgsIHRoaXMkLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsID8gY2VudGVyWSAtIDIwIDogY2VudGVyWSAtIDI1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCwgMzAsIDMwLCB0cnVlKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcyQuc2V0Rm9udFNpemUoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBBc3dDaGFydENvbnN0YW50cy5jZW50ZXJBbGlnbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFdlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmFkZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5sYWJlbCh0aGlzJC5zZXRJbm5lclRleHRWYWx1ZShpdGVtV2lkdGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlclgsIGNlbnRlclksIHVuZGVmaW5lZCwgMzAsIDMwLCB0cnVlKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcyQuc2V0Rm9udFNpemUoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBBc3dDaGFydENvbnN0YW50cy5jZW50ZXJBbGlnbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFdlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmFkZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5sYWJlbCh0aGlzJC5zZXRJbm5lclRleHRUYXJnZXQoaXRlbVdpZHRoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXJYLCB0aGlzJC5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCA/IGNlbnRlclkgKyAyMCA6IGNlbnRlclkgKyAyNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsIDMwLCAzMCwgdHJ1ZSkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IHRoaXMkLnNldEZvbnRTaXplKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogQXN3Q2hhcnRDb25zdGFudHMuY2VudGVyQWxpZ24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5hZGQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldElubmVyVGV4dExhYmVsKHdpZHRoOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogJHt3aWR0aH1weDsgb3BhY2l0eTogJHt0aGlzLmlzTXV0ZSA/IDAuMzUgOiAxfVwiPlxyXG4gICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC10cnVuY2F0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAke3RoaXMubGFiZWx9XHJcbiAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRJbm5lclRleHRJY29uKHdpZHRoOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogJHt3aWR0aH1weDsgb3BhY2l0eTogJHt0aGlzLmlzTXV0ZSA/IDAuMzUgOiAxfVwiPlxyXG4gICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC10cnVuY2F0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAke3RoaXMuaWNvbn1cclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldElubmVyVGV4dFZhbHVlKHdpZHRoOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogJHt3aWR0aH1weDsgb3BhY2l0eTogJHt0aGlzLmlzTXV0ZSA/IDAuMzUgOiAxfVwiPlxyXG4gICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC10cnVuY2F0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPiR7dGhpcy5jdXJyZW5jeVBpcGUudHJhbnNmb3JtKHRoaXMuYW1vdW50LCB0aGlzLmN1cnJlbmN5Q29kZSl9PC9zdHJvbmc+XHJcbiAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRJbm5lclRleHRUYXJnZXQod2lkdGg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiAke3dpZHRofXB4OyBvcGFjaXR5OiAke3RoaXMuaXNNdXRlID8gMC4zNSA6IDF9XCI+XHJcbiAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LXRydW5jYXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICR7dGhpcy50YXJnZXQgPyB0aGlzLnRhcmdldCA6ICcnfVxyXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICBgO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==