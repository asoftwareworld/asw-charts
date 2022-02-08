import { PercentPipe, CurrencyPipe, CommonModule } from '@angular/common';
import { EventEmitter, Component, Input, Output, ViewChild, HostListener, NgModule } from '@angular/core';
import { GridOptionsEnum, CurrencyCodeEnum, LegendPositionEnum, LegendTypeEnum, LegendLayoutEnum, AswChartConstants, AswCurrencyPipe } from '@asoftwareworld/charts/core';
import { ObjectUtils } from '@asoftwareworld/charts/utils';
import * as Highcharts from 'highcharts';

class Line {
    constructor(percentPipe, currencyPipe, aswCurrencyPipe) {
        this.percentPipe = percentPipe;
        this.currencyPipe = currencyPipe;
        this.aswCurrencyPipe = aswCurrencyPipe;
        this.deviceSize = GridOptionsEnum.Large;
        this.viewInitialized = false;
        this.isLegendSort = true;
        this.isMute = false;
        this.isLegendDisplay = true;
        this.currencyCode = CurrencyCodeEnum.INR;
        this.legendPosition = LegendPositionEnum.Right;
        this.legendType = LegendTypeEnum.Both;
        this.legendWidthPx = 250;
        this.legendLayout = LegendLayoutEnum.Vertical;
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
            const containerWidth = this.pieDonutChart.nativeElement.clientWidth;
            this.deviceSize = ObjectUtils.findDeviceSize(containerWidth);
            this.removeChartCredit();
            this.setDonutChartTooltip();
            const series = this.cloneConfiguration.series;
            this.setDonutChartSeriesOptions(series);
            if (this.legendLayout === LegendLayoutEnum.Vertical) {
                this.setDonutChartLegendOption(this.legendWidthPx);
            }
            // if (this.chartType === ChartTypeEnum.Donut) {
            //     this.setDonutChartInnerText();
            // }
            this.donutChartSliceClick();
            Highcharts.chart(this.pieDonutChart.nativeElement, this.cloneConfiguration);
        }
    }
    onResize() {
        this.initializeChart();
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
                        <div class="col-md-12 text-end text-right">
                            <span style="color: ${this.point.color}">\u25A0</span>
                            <strong>${this.point.name}</strong>
                        </div>
                        <div class="col-md-12 text-end text-right">
                            ${this$.percentPipe.transform(percentage / 100, '.2')}
                        </div>
                        <div class="col-md-12 text-end text-right">
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
                            const pointClickEvent = {
                                name: event.point.name,
                                id: event.point.options.id,
                                percentage: event.point.percentage,
                                value: event.point.options.value,
                                target: event.point.options.target
                            };
                            this.donutSliceClick.emit(pointClickEvent);
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
        if (this.legendType === LegendTypeEnum.Default) {
            data.sort((a, b) => {
                return ('' + a.name).localeCompare(b.name);
            });
            return data;
        }
        else {
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
        }
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
        else if (this.legendPosition === LegendPositionEnum.Right) {
            return LegendPositionEnum.Right;
        }
        else if (this.legendPosition === LegendPositionEnum.Left) {
            return LegendPositionEnum.Left;
        }
        else {
            return 'center';
        }
    }
    setLegendVerticalAlignment() {
        if (this.deviceSize === GridOptionsEnum.ExtraSmall) {
            return LegendPositionEnum.Bottom;
        }
        else if (this.legendPosition === LegendPositionEnum.Right) {
            return 'middle';
        }
        else if (this.legendPosition === LegendPositionEnum.Left) {
            return 'middle';
        }
        else {
            return LegendPositionEnum.Bottom;
        }
    }
    setDonutChartLegendWithHeader(legendWidthPx, name, percentage, value) {
        let legendCategoryWidthPx;
        let legendValueWidthPx;
        let legendPercentageWidthPx;
        switch (this.legendType) {
            case LegendTypeEnum.Default:
                return `
                <div style="width:${legendWidthPx}px">
                    <div class="row">
                        <div class="col-md-12 col-sm-12 col-12">
                            ${name ? name : 'Category'}
                        </div>
                    </div>
                </div>
                `;
            case LegendTypeEnum.Percentage:
                legendCategoryWidthPx = legendWidthPx * 0.9;
                legendPercentageWidthPx = legendWidthPx * 0.1;
                return `
                <div style="width:${legendCategoryWidthPx + legendPercentageWidthPx}px">
                    <div class="row">
                        <div class="col-md-8 col-sm-8 col-8">
                            ${name ? name : 'Category'}
                        </div>
                        <div class="col-md-4 col-sm-4 col-4 text-end text-right">
                            ${percentage ? this.percentPipe.transform(percentage / 100, '.0') : '%'}
                        </div>
                    </div>
                </div>
                `;
            case LegendTypeEnum.Value:
                legendCategoryWidthPx = legendWidthPx * 0.5;
                legendValueWidthPx = legendWidthPx * 0.5;
                return `
                <div style="width:${legendCategoryWidthPx + legendValueWidthPx}px">
                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-6">
                            ${name ? name : 'Category'}
                        </div>
                        <div class="col-md-6 col-sm-6 col-6 text-end text-right">
                            ${value ? this.currencyPipe.transform(value, 'INR') : 'Total'}
                        </div>
                    </div>
                </div>
                `;
            default:
                legendCategoryWidthPx = legendWidthPx * 0.5;
                legendPercentageWidthPx = legendWidthPx * 0.1;
                legendValueWidthPx = legendWidthPx * 0.4;
                return `
                <div style="width:${legendCategoryWidthPx + legendPercentageWidthPx + legendValueWidthPx}px">
                    <div class="row">
                        <div class="col-md-5 col-sm-5 col-5">
                            ${name ? name : 'Category'}
                        </div>
                        <div class="col-md-2 col-xs-2 col-2 text-end text-right">
                            ${percentage ? this.percentPipe.transform(percentage / 100) : '%'}
                        </div>
                        <div class="col-md-5 col-sm-5 col-5 text-end text-right">
                            ${value ? this.currencyPipe.transform(value, this.currencyCode, 'symbol', '.2') : 'Total'}
                        </div>
                    </div>
                </div>
                `;
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
                    <strong>${this.aswCurrencyPipe.transform(this.amount)}</strong>
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
Line.decorators = [
    { type: Component, args: [{
                selector: 'asw-line',
                template: "<div #lineChart></div>",
                styles: [""]
            },] }
];
Line.ctorParameters = () => [
    { type: PercentPipe },
    { type: CurrencyPipe },
    { type: AswCurrencyPipe }
];
Line.propDecorators = {
    config: [{ type: Input }],
    isLegendSort: [{ type: Input }],
    isMute: [{ type: Input }],
    isLegendDisplay: [{ type: Input }],
    icon: [{ type: Input }],
    label: [{ type: Input }],
    amount: [{ type: Input }],
    target: [{ type: Input }],
    currencyCode: [{ type: Input }],
    legendPosition: [{ type: Input }],
    legendType: [{ type: Input }],
    legendWidthPx: [{ type: Input }],
    legendLayout: [{ type: Input }],
    donutSliceClick: [{ type: Output }],
    pieDonutChart: [{ type: ViewChild, args: ['lineChart', { static: true },] }],
    onResize: [{ type: HostListener, args: ['window:resize',] }]
};

class LineModule {
}
LineModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Line
                ],
                imports: [
                    CommonModule
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

export { Line, LineModule };
//# sourceMappingURL=asoftwareworld-charts-line.js.map
