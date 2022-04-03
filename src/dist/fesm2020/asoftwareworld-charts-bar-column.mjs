import * as i0 from '@angular/core';
import { EventEmitter, Component, Input, Output, ViewChild, HostListener, NgModule } from '@angular/core';
import * as i2 from '@asoftwareworld/charts/core';
import { GridOptionsEnum, CurrencyCodeEnum, LegendPositionEnum, ChartLegendTypeEnum, LegendLayoutEnum, AswChartConstants } from '@asoftwareworld/charts/core';
import { ObjectUtils } from '@asoftwareworld/charts/utils';
import * as Highcharts from 'highcharts';
import * as i1 from '@angular/common';
import { CommonModule, CurrencyPipe } from '@angular/common';

class AswBarColumn {
    constructor(percentPipe, currencyPipe, aswCurrencyPipe) {
        this.percentPipe = percentPipe;
        this.currencyPipe = currencyPipe;
        this.aswCurrencyPipe = aswCurrencyPipe;
        this.deviceSize = GridOptionsEnum.Large;
        this.viewInitialized = false;
        this.isLegendSort = true;
        this.currencyCode = CurrencyCodeEnum.Blank;
        this.legendPosition = LegendPositionEnum.Right;
        this.legendType = ChartLegendTypeEnum.Both;
        this.legendWidthPx = 250;
        this.legendLayout = LegendLayoutEnum.Vertical;
        this.barClick = new EventEmitter();
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
            const containerWidth = this.barColumnChart.nativeElement.clientWidth;
            this.deviceSize = ObjectUtils.findDeviceSize(containerWidth);
            this.removeChartCredit();
            this.setBarChartTooltip();
            const series = this.cloneConfiguration.series;
            if (this.legendLayout === LegendLayoutEnum.Vertical) {
                this.setBarChartLegendOption(this.legendWidthPx);
            }
            this.clickOnBar();
            Highcharts.chart(this.barColumnChart.nativeElement, this.cloneConfiguration);
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
    setBarChartTooltip() {
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
            enabled: true,
            formatter() {
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
                            ${this$.currencyCode ? this$.currencyPipe.transform(this.point.options.y, this$.currencyCode) : this.point.options.y}
                        </div>
                    </div>
                `;
            }
        };
    }
    clickOnBar() {
        this.cloneConfiguration.plotOptions = {
            series: {
                dataLabels: {
                    enabled: false
                },
                point: {
                    events: {
                        click: ((event) => {
                            const pointClickEvent = {
                                name: event.point.series.name,
                                index: event.point.index,
                                value: event.point.options.y,
                                category: event.point.category
                            };
                            this.barClick.emit(pointClickEvent);
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
            // if (this.isMute) {
            //     seriesOption.opacity = 0.35;
            //     seriesOption.states = {
            //         hover: {
            //             enabled: false
            //         },
            //         inactive: {
            //             enabled: false
            //         }
            //     };
            //     seriesOption.slicedOffset = 0;
            // }
            seriesOption.cursor = AswChartConstants.pointer;
            const data = seriesOption.data;
            this.handleNegativeSeriesData(data);
            const sortedSeriesOptionData = this.isLegendSort ? this.sortSeriesData(data) : data;
            seriesOption.data = sortedSeriesOptionData;
        });
    }
    sortSeriesData(data) {
        if (this.legendType === ChartLegendTypeEnum.Default) {
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
    setFontSize() {
        return this.deviceSize === GridOptionsEnum.ExtraSmall ? AswChartConstants.fontSize14 : AswChartConstants.fontSize16;
    }
    setBarChartLegendOption(legendWidthPx) {
        const this$ = this;
        this.cloneConfiguration.legend = {
            useHTML: true,
            enabled: true,
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
                text: this$.setLineChartLegendWithHeader(legendWidthPx + 15),
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
                const value = point.yData.reduce((acc, cur) => acc + cur, 0);
                return this$.setLineChartLegendWithHeader(legendWidthPx, point.name, value);
            }
        };
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
    setLineChartLegendWithHeader(legendWidthPx, name, value) {
        let legendCategoryWidthPx;
        let legendValueWidthPx;
        if (this.legendType === ChartLegendTypeEnum.Default) {
            return `
                <div style="width:${legendWidthPx}px">
                    <div class="row">
                        <div class="col-md-12 col-sm-12 col-12">
                            ${name ? name : 'Category'}
                        </div>
                    </div>
                </div>`;
        }
        else {
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
AswBarColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswBarColumn, deps: [{ token: i1.PercentPipe }, { token: i1.CurrencyPipe }, { token: i2.AswCurrencyPipe }], target: i0.ɵɵFactoryTarget.Component });
AswBarColumn.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: AswBarColumn, selector: "asw-bar-column", inputs: { config: "config", isLegendSort: "isLegendSort", icon: "icon", label: "label", amount: "amount", target: "target", currencyCode: "currencyCode", legendPosition: "legendPosition", legendType: "legendType", legendWidthPx: "legendWidthPx", legendLayout: "legendLayout" }, outputs: { barClick: "barClick" }, host: { listeners: { "window:resize": "onResize()" } }, viewQueries: [{ propertyName: "barColumnChart", first: true, predicate: ["barColumnChart"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: "<div #barColumnChart></div>", styles: [""] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswBarColumn, decorators: [{
            type: Component,
            args: [{ selector: 'asw-bar-column', template: "<div #barColumnChart></div>", styles: [""] }]
        }], ctorParameters: function () { return [{ type: i1.PercentPipe }, { type: i1.CurrencyPipe }, { type: i2.AswCurrencyPipe }]; }, propDecorators: { config: [{
                type: Input
            }], isLegendSort: [{
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
            }], legendPosition: [{
                type: Input
            }], legendType: [{
                type: Input
            }], legendWidthPx: [{
                type: Input
            }], legendLayout: [{
                type: Input
            }], barClick: [{
                type: Output
            }], barColumnChart: [{
                type: ViewChild,
                args: ['barColumnChart', { static: true }]
            }], onResize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });

class AswBarColumnModule {
}
AswBarColumnModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswBarColumnModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AswBarColumnModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswBarColumnModule, declarations: [AswBarColumn], imports: [CommonModule], exports: [AswBarColumn] });
AswBarColumnModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswBarColumnModule, providers: [
        CurrencyPipe
    ], imports: [[
            CommonModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswBarColumnModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        AswBarColumn
                    ],
                    imports: [
                        CommonModule
                    ],
                    exports: [
                        AswBarColumn
                    ],
                    providers: [
                        CurrencyPipe
                    ]
                }]
        }] });

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

export { AswBarColumn, AswBarColumnModule };
//# sourceMappingURL=asoftwareworld-charts-bar-column.mjs.map
