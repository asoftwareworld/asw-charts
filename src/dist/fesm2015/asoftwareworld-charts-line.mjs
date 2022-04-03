import * as i0 from '@angular/core';
import { EventEmitter, Component, Input, Output, ViewChild, HostListener, NgModule } from '@angular/core';
import * as i2 from '@asoftwareworld/charts/core';
import { GridOptionsEnum, CurrencyCodeEnum, LegendPositionEnum, ChartLegendTypeEnum, LegendLayoutEnum, AswChartConstants } from '@asoftwareworld/charts/core';
import { ObjectUtils } from '@asoftwareworld/charts/utils';
import * as Highcharts from 'highcharts';
import * as i1 from '@angular/common';
import { CommonModule, CurrencyPipe } from '@angular/common';

class AswLine {
    constructor(currencyPipe, aswCurrencyPipe) {
        this.currencyPipe = currencyPipe;
        this.aswCurrencyPipe = aswCurrencyPipe;
        this.deviceSize = GridOptionsEnum.Large;
        this.viewInitialized = false;
        this.isLegendSort = true;
        this.isLegendDisplay = true;
        this.currencyCode = CurrencyCodeEnum.INR;
        this.legendPosition = LegendPositionEnum.Right;
        this.legendType = ChartLegendTypeEnum.Both;
        this.legendWidthPx = 250;
        this.legendLayout = LegendLayoutEnum.Vertical;
        this.linePointClick = new EventEmitter();
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
            const containerWidth = this.lineChart.nativeElement.clientWidth;
            this.deviceSize = ObjectUtils.findDeviceSize(containerWidth);
            this.removeChartCredit();
            this.setLineChartTooltip();
            const series = this.cloneConfiguration.series;
            this.setLineChartSeriesOptions(series);
            if (this.legendLayout === LegendLayoutEnum.Vertical) {
                this.setLineChartLegendOption(this.legendWidthPx);
            }
            this.clickOnLinePoint();
            Highcharts.chart(this.lineChart.nativeElement, this.cloneConfiguration);
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
    setLineChartTooltip() {
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
                            ${this$.currencyPipe.transform(this.point.options.y, this$.currencyCode)}
                        </div>
                    </div>
                `;
            }
        };
    }
    clickOnLinePoint() {
        // tslint:disable-next-line:no-non-null-assertion
        this.cloneConfiguration.plotOptions.line = {
            point: {
                events: {
                    click: ((event) => {
                        const pointClickEvent = {
                            name: event.point.series.name,
                            index: event.point.index,
                            value: event.point.options.y,
                            category: event.point.category
                        };
                        this.linePointClick.emit(pointClickEvent);
                    })
                }
            }
        };
    }
    setLineChartSeriesOptions(series) {
        series.forEach((seriesOption) => {
            seriesOption.allowPointSelect = true;
            seriesOption.showInLegend = true;
            seriesOption.cursor = AswChartConstants.pointer;
            const data = seriesOption.data;
            // this.handleNegativeSeriesData(data);
            // const sortedSeriesOptionData: PointOptionsObject[] = this.isLegendSort ? this.sortSeriesData(data) : data;
            // seriesOption.data = sortedSeriesOptionData;
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
    setLineChartLegendOption(legendWidthPx) {
        const this$ = this;
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
AswLine.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswLine, deps: [{ token: i1.CurrencyPipe }, { token: i2.AswCurrencyPipe }], target: i0.ɵɵFactoryTarget.Component });
AswLine.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.2", type: AswLine, selector: "asw-line", inputs: { config: "config", isLegendSort: "isLegendSort", isLegendDisplay: "isLegendDisplay", currencyCode: "currencyCode", legendPosition: "legendPosition", legendType: "legendType", legendWidthPx: "legendWidthPx", legendLayout: "legendLayout" }, outputs: { linePointClick: "linePointClick" }, host: { listeners: { "window:resize": "onResize()" } }, viewQueries: [{ propertyName: "lineChart", first: true, predicate: ["lineChart"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: "<div #lineChart></div>", styles: [""] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswLine, decorators: [{
            type: Component,
            args: [{ selector: 'asw-line', template: "<div #lineChart></div>", styles: [""] }]
        }], ctorParameters: function () { return [{ type: i1.CurrencyPipe }, { type: i2.AswCurrencyPipe }]; }, propDecorators: { config: [{
                type: Input
            }], isLegendSort: [{
                type: Input
            }], isLegendDisplay: [{
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
            }], linePointClick: [{
                type: Output
            }], lineChart: [{
                type: ViewChild,
                args: ['lineChart', { static: true }]
            }], onResize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });

class AswLineModule {
}
AswLineModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswLineModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AswLineModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswLineModule, declarations: [AswLine], imports: [CommonModule], exports: [AswLine] });
AswLineModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswLineModule, providers: [
        CurrencyPipe
    ], imports: [[
            CommonModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: AswLineModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        AswLine
                    ],
                    imports: [
                        CommonModule
                    ],
                    exports: [
                        AswLine
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

export { AswLine, AswLineModule };
//# sourceMappingURL=asoftwareworld-charts-line.mjs.map
