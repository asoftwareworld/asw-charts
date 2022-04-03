/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */

import { CurrencyPipe, PercentPipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { AswChartConstants, CurrencyCodeEnum, GridOptionsEnum } from '@asoftwareworld/charts/core';
import { ObjectUtils } from '@asoftwareworld/charts/utils';
import * as Highcharts from 'highcharts';
declare var require: any;
const HighchartsMore = require('highcharts/highcharts-more.src');
HighchartsMore(Highcharts);
const HighchartsSolidGauge = require('highcharts/modules/solid-gauge.src');
HighchartsSolidGauge(Highcharts);

import {
    AlignValue,
    Options,
    PointClickEventObject,
    PointOptionsObject,
    Point,
    Series,
    SeriesPieOptions,
    VerticalAlignValue
} from 'highcharts';



@Component({
    selector: 'asw-semi-circle-donut',
    templateUrl: './semi-circle-donut.html',
    styleUrls: ['./semi-circle-donut.scss']
})
export class AswSemiCircleDonut implements OnChanges, AfterViewInit {

    private cloneConfiguration!: Options;
    public deviceSize: GridOptionsEnum = GridOptionsEnum.Large;
    private viewInitialized = false;
    @Input() config!: Options;
    @Input() isLegendSort = true;
    @Input() isMute = false;
    @Input() isLegendDisplay = true;
    @Input() icon!: string;
    @Input() label: string | undefined;
    @Input() amount: number | null | undefined;
    @Input() target!: string;
    // @Input() chartType: ChartTypeEnum = ChartTypeEnum.Donut;
    @Input() currencyCode: CurrencyCodeEnum = CurrencyCodeEnum.INR;
    // @Input() legendPosition: LegendPositionEnum = LegendPositionEnum.Right;
    // @Input() legendType: LegendTypeEnum = LegendTypeEnum.Both;
    @Input() legendWidthPx = 250;

    @Output() donutSliceClick: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('semiCircleDonutChart', { static: true }) semiCircleDonutChart!: ElementRef;
    @ViewChild('chartId', { static: true }) chartId!: ElementRef;
    constructor(
        private percentPipe: PercentPipe,
        private currencyPipe: CurrencyPipe) { }

    ngOnChanges(): void {
        if (!this.viewInitialized) {
            return;
        }
        this.initializeChart();
    }

    ngAfterViewInit(): void {
        this.viewInitialized = true;
        this.initializeChart();
    }

    initializeChart(): void {
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

    private removeChartCredit(): void {
        this.cloneConfiguration.credits = {
            enabled: false
        };
    }

    private setSemiDonutChartTooltip(): void {
        const this$: this = this;
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
            formatter(): string {
                const percentage: number = this.point.percentage as number;
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

    private donutChartSliceClick(): void {
        if (this.isMute) { return; }
        this.cloneConfiguration.plotOptions = {
            series: {
                dataLabels: {
                    enabled: false
                },
                point: {
                    events: {
                        click: ((event: PointClickEventObject) => {
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

    private setDonutChartSeriesOptions(series: SeriesPieOptions[]): void {
        series.forEach((seriesOption: SeriesPieOptions) => {
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
            const data: PointOptionsObject[] = seriesOption.data as PointOptionsObject[];
            this.handleNegativeSeriesData(data);
            const sortedSeriesOptionData: PointOptionsObject[] = this.isLegendSort ? this.sortSeriesData(data) : data;
            seriesOption.data = sortedSeriesOptionData;
        });
    }

    private sortSeriesData(data: PointOptionsObject[]): PointOptionsObject[] {
        // if (this.legendType === LegendTypeEnum.Default) {
        //     data.sort((a: any, b: any) => {
        //         return ('' + a.name).localeCompare(b.name);
        //     });
        //     return data;
        // } else {
            data.sort((a: any, b: any) => {
                if (a.y && b.y) {
                    return a.value - b.value;
                } else {
                    return 0;
                }
            });
            data.reverse();
            return data;
        // }
    }

    private handleNegativeSeriesData(data: PointOptionsObject[]): void {
        data.forEach((element: PointOptionsObject) => {
            element.value = element.y;
            element.y = element.y ? Math.abs(element.y) : 0.001;
        });
    }

    private setDonutChartLegendOption(legendWidthPx: number): void {
        const this$: this = this;
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
            itemMarginTop: 3, // Space between each category in the legend
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
            labelFormatter(): string {
                const point: Point = this as Point;
                return this$.setDonutChartLegendWithHeader(
                    legendWidthPx,
                    point.name,
                    point.percentage,
                    point.options.value);
            }
        };
    }

    private setFontSize(): string {
        return this.deviceSize === GridOptionsEnum.ExtraSmall ? AswChartConstants.fontSize14 : AswChartConstants.fontSize16;
    }

    private setLegendAlignment(): AlignValue {
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

    private setLegendVerticalAlignment(): VerticalAlignValue {
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

    private setDonutChartLegendWithHeader(
        legendWidthPx: number,
        name?: string | null,
        percentage?: number | undefined,
        value?: number | null | undefined): string {
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

    private findDeviceSize(): void {
        const containerWidth = this.semiCircleDonutChart.nativeElement.clientWidth;
        if (containerWidth >= 1400) {
            this.deviceSize = GridOptionsEnum.ExtraExtraLarge;
        } else if (containerWidth >= 1200) {
            this.deviceSize = GridOptionsEnum.ExtraLarge;
        } else if (containerWidth >= 992) {
            this.deviceSize = GridOptionsEnum.Large;
        } else if (containerWidth >= 768) {
            this.deviceSize = GridOptionsEnum.Medium;
        } else if (containerWidth >= 576) {
            this.deviceSize = GridOptionsEnum.Small;
        } else if (containerWidth < 576) {
            this.deviceSize = GridOptionsEnum.ExtraSmall;
        }
    }

    private setDonutChartInnerText(): void {
        const this$: this = this;
        this.cloneConfiguration.chart = {
            events: {
                load(): void {
                    let centerX: number;
                    let centerY: number;
                    let itemWidth: number;
                    this.series.forEach((element: Series) => {
                        const points: Point[] = element.points.slice(0, 1);
                        points.forEach((point: any) => {
                            centerX = this.plotLeft + (point.shapeArgs.x - point.shapeArgs.innerR) + 8;
                            centerY = this.plotTop + point.shapeArgs.y - 14;
                            itemWidth = (point.shapeArgs.innerR * 2) - 20;
                        });
                        if (this$.icon) {
                            this.renderer.label(this$.setInnerTextIcon(itemWidth),
                                centerX, this$.deviceSize === GridOptionsEnum.ExtraSmall ? centerY - 20 : centerY - 25,
                                undefined, 30, 30, true).css({
                                    fontSize: this$.setFontSize(),
                                    textAlign: AswChartConstants.centerAlign,
                                    fontWeight: AswChartConstants.fontWeight
                                }).add();
                            this.renderer.label(this$.setInnerTextLabel(itemWidth),
                                centerX, centerY, undefined, 30, 30, true).css({
                                    fontSize: this$.setFontSize(),
                                    textAlign: AswChartConstants.centerAlign,
                                    fontWeight: AswChartConstants.fontWeight
                                }).add();
                            this.renderer.label(this$.setInnerTextValue(itemWidth),
                                centerX, this$.deviceSize === GridOptionsEnum.ExtraSmall ? centerY + 20 : centerY + 25,
                                undefined, 30, 30, true).css({
                                    fontSize: this$.setFontSize(),
                                    textAlign: AswChartConstants.centerAlign,
                                    fontWeight: AswChartConstants.fontWeight
                                }).add();
                        } else {
                            this.renderer.label(this$.setInnerTextLabel(itemWidth),
                                centerX, this$.deviceSize === GridOptionsEnum.ExtraSmall ? centerY - 20 : centerY - 25,
                                undefined, 30, 30, true).css({
                                    fontSize: this$.setFontSize(),
                                    textAlign: AswChartConstants.centerAlign,
                                    fontWeight: AswChartConstants.fontWeight
                                }).add();
                            this.renderer.label(this$.setInnerTextValue(itemWidth),
                                centerX, centerY, undefined, 30, 30, true).css({
                                    fontSize: this$.setFontSize(),
                                    textAlign: AswChartConstants.centerAlign,
                                    fontWeight: AswChartConstants.fontWeight
                                }).add();
                            this.renderer.label(this$.setInnerTextTarget(itemWidth),
                                centerX, this$.deviceSize === GridOptionsEnum.ExtraSmall ? centerY + 20 : centerY + 25,
                                undefined, 30, 30, true).css({
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

    private setInnerTextLabel(width: number): string {
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

    private setInnerTextIcon(width: number): string {
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

    private setInnerTextValue(width: number): string {
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

    private setInnerTextTarget(width: number): string {
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
