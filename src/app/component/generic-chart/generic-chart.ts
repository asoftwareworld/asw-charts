/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */

import { CurrencyPipe } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    ViewChild
} from '@angular/core';
import {
    AswChartConstants,
    AswCurrencyPipe,
    ChartLegendTypeEnum,
    ChartPointerEvent,
    CurrencyCodeEnum,
    GridOptionsEnum,
    LegendLayoutEnum,
    LegendPositionEnum,
} from '@asoftwareworld/charts/core';
import { ObjectUtils } from '@asoftwareworld/charts/utils';
import * as Highcharts from 'highcharts';
import {
    AlignValue,
    Options,
    PointClickEventObject,
    PointOptionsObject,
    Point,
    SeriesPieOptions,
    VerticalAlignValue
} from 'highcharts';
import { AswChartTypeEnum } from './enum/chart-type.enum';

@Component({
    selector: 'asw-generic-chart',
    templateUrl: './generic-chart.html',
})
export class AswGenericChart implements OnChanges, AfterViewInit {
    private cloneConfiguration!: Options;
    public deviceSize: GridOptionsEnum = GridOptionsEnum.Large;
    private viewInitialized = false;
    @Input() chartType: AswChartTypeEnum = AswChartTypeEnum.Line;
    @Input() config!: Options;
    @Input() isLegendSort = true;
    @Input() isLegendDisplay = true;
    @Input() currencyCode: CurrencyCodeEnum = CurrencyCodeEnum.INR;
    @Input() legendPosition: LegendPositionEnum = LegendPositionEnum.Right;
    @Input() legendType: ChartLegendTypeEnum = ChartLegendTypeEnum.Both;
    @Input() legendWidthPx = 250;
    @Input() legendLayout: LegendLayoutEnum = LegendLayoutEnum.Vertical;

    @Output() chartPointClick: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('genericChart', { static: true }) genericChart!: ElementRef;
    constructor(
        private currencyPipe: CurrencyPipe,
        private aswCurrencyPipe: AswCurrencyPipe) { }

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
            const containerWidth = this.genericChart.nativeElement.clientWidth;
            this.deviceSize = ObjectUtils.findDeviceSize(containerWidth);
            this.removeChartCredit();
            this.setChartTooltip();
            const series: SeriesPieOptions[] = this.cloneConfiguration.series as SeriesPieOptions[];
            this.setChartSeriesOptions(series);
            if (this.legendLayout === LegendLayoutEnum.Vertical) {
                this.setChartLegendOption(this.legendWidthPx);
            }
            this.clickOnLinePoint();
            Highcharts.chart(this.genericChart.nativeElement, this.cloneConfiguration);
        }
    }

    @HostListener('window:resize')
    onResize(): void {
        this.initializeChart();
    }

    private removeChartCredit(): void {
        this.cloneConfiguration.credits = {
            enabled: false
        };
    }

    private setChartTooltip(): void {
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
            enabled: true,
            formatter(): string {
                return `
                    <div class="row">
                        <div class="col-md-12 text-end text-right">
                            <strong>${this.point.category}</strong>
                        </div>
                        <div class="col-md-12 text-end text-right">
                            <span style="color: ${this.point.color}">\u25A0</span>
                            <strong>${this.point.series.name}</strong>
                        </div>
                        <div class="col-md-12 text-end text-right">
                            ${this$.currencyPipe.transform(this.point.options.y, this$.currencyCode)}
                        </div>
                    </div>
                `;
            }
        };
    }

    private clickOnLinePoint(): void {
        if (this.cloneConfiguration.plotOptions) {
            // tslint:disable-next-line:no-non-null-assertion
            this.cloneConfiguration.plotOptions![this.chartType] = {
                point: {
                    events: {
                        click: ((event: PointClickEventObject) => {
                            const pointClickEvent: ChartPointerEvent = {
                                name: event.point.series.name,
                                index: event.point.index,
                                value: event.point.options.y,
                                category: event.point.category
                            };
                            this.chartPointClick.emit(pointClickEvent);
                        })
                    }
                }
            };
        } else {
            this.cloneConfiguration.plotOptions = {
                series: {
                    point: {
                        events: {
                            click: ((event: PointClickEventObject) => {
                                const pointClickEvent: ChartPointerEvent = {
                                    name: event.point.series.name,
                                    index: event.point.index,
                                    value: event.point.options.y,
                                    category: event.point.category
                                };
                                this.chartPointClick.emit(pointClickEvent);
                            })
                        }
                    }
                }
            };
        }
    }

    private setChartSeriesOptions(series: SeriesPieOptions[]): void {
        series.forEach((seriesOption: SeriesPieOptions) => {
            seriesOption.allowPointSelect = true;
            seriesOption.showInLegend = true;
            seriesOption.cursor = AswChartConstants.pointer;
            const data: PointOptionsObject[] = seriesOption.data as PointOptionsObject[];
            // this.handleNegativeSeriesData(data);
            // const sortedSeriesOptionData: PointOptionsObject[] = this.isLegendSort ? this.sortSeriesData(data) : data;
            // seriesOption.data = sortedSeriesOptionData;
        });
    }

    private sortSeriesData(data: PointOptionsObject[]): PointOptionsObject[] {
        if (this.legendType === ChartLegendTypeEnum.Default) {
            data.sort((a: any, b: any) => {
                return ('' + a.name).localeCompare(b.name);
            });
            return data;
        } else {
            data.sort((a: any, b: any) => {
                if (a.y && b.y) {
                    return a.value - b.value;
                } else {
                    return 0;
                }
            });
            data.reverse();
            return data;
        }
    }

    private handleNegativeSeriesData(data: PointOptionsObject[]): void {
        data.forEach((element: PointOptionsObject) => {
            element.value = element.y;
            element.y = element.y ? Math.abs(element.y) : 0.001;
        });
    }

    private setChartLegendOption(legendWidthPx: number): void {
        const this$: this = this;
        this.cloneConfiguration.legend = {
            useHTML: true,
            enabled: this.isLegendDisplay,
            floating: false,
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
                text: this$.setChartLegendWithHeader(legendWidthPx + 15),
                style: {
                    fontSize: this.deviceSize === GridOptionsEnum.ExtraSmall
                        ? AswChartConstants.fontSize12 : AswChartConstants.fontSize14,
                    color: '#6c757d',
                    fontWeight: AswChartConstants.fontWeight,
                    fontFamily: '500 14px/20px Google Sans Text,Arial,Helvetica,sans-serif'
                }
            },
            labelFormatter(): string {
                const point: any = this as Point;
                const value = point.yData.reduce((acc: any, cur: any) => acc + cur, 0);
                return this$.setChartLegendWithHeader(
                    legendWidthPx,
                    point.name,
                    value);
            }
        };
    }

    private setLegendAlignment(): AlignValue {
        if (this.deviceSize === GridOptionsEnum.ExtraSmall) {
            return 'center';
        } else if (this.legendPosition === LegendPositionEnum.Right) {
            return LegendPositionEnum.Right;
        } else if (this.legendPosition === LegendPositionEnum.Left) {
            return LegendPositionEnum.Left;
        } else {
            return 'center';
        }
    }

    private setLegendVerticalAlignment(): VerticalAlignValue {
        if (this.deviceSize === GridOptionsEnum.ExtraSmall) {
            return LegendPositionEnum.Bottom;
        } else if (this.legendPosition === LegendPositionEnum.Right) {
            return 'middle';
        } else if (this.legendPosition === LegendPositionEnum.Left) {
            return 'middle';
        } else {
            return LegendPositionEnum.Bottom;
        }
    }

    private setChartLegendWithHeader(
        legendWidthPx: number,
        name?: string | null,
        value?: number | null | undefined): string {
        let legendCategoryWidthPx: number;
        let legendValueWidthPx: number;
        if (this.legendType === ChartLegendTypeEnum.Default) {
            return `
                <div style="width:${legendWidthPx}px">
                    <div class="row">
                        <div class="col-md-12 col-sm-12 col-12">
                            ${name ? name : 'Category'}
                        </div>
                    </div>
                </div>`;
        } else {
            legendCategoryWidthPx = legendWidthPx * 0.5;
            legendValueWidthPx = legendWidthPx * 0.5;
            return `
                <div style="width:${legendCategoryWidthPx + legendValueWidthPx}px">
                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-6">
                            ${name ? name : 'Category'}
                        </div>
                        <div class="col-md-6 col-sm-6 col-6 text-end text-right">
                            ${value ? this.currencyPipe.transform(value, this.currencyCode, 'symbol', '.2') : 'Total'}
                        </div>
                    </div>
                </div>`;
        }
    }
}
