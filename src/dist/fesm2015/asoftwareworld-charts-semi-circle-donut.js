import { PercentPipe, CurrencyPipe, CommonModule } from '@angular/common';
import { EventEmitter, Component, Input, Output, ViewChild, NgModule } from '@angular/core';
import { GridOptionsEnum, CurrencyCodeEnum, AswChartConstants } from '@asoftwareworld/charts/core';
import { ObjectUtils } from '@asoftwareworld/charts/utils';
import * as Highcharts from 'highcharts';

/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
const HighchartsMore = require('highcharts/highcharts-more.src');
HighchartsMore(Highcharts);
class AswSemiCircleDonut {
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

/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
class AswSemiCircleDonutModule {
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

export { AswSemiCircleDonut, AswSemiCircleDonutModule };
//# sourceMappingURL=asoftwareworld-charts-semi-circle-donut.js.map
