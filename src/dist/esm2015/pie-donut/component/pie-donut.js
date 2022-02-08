/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { AswChartConstants, AswCurrencyPipe, CurrencyCodeEnum, GridOptionsEnum, LegendLayoutEnum, LegendPositionEnum, LegendTypeEnum } from '@asoftwareworld/charts/core';
import { ObjectUtils } from '@asoftwareworld/charts/utils';
import * as Highcharts from 'highcharts';
import { ChartTypeEnum } from '../enum/chart-type.enum';
export class AswPieDonut {
    constructor(percentPipe, currencyPipe, aswCurrencyPipe) {
        this.percentPipe = percentPipe;
        this.currencyPipe = currencyPipe;
        this.aswCurrencyPipe = aswCurrencyPipe;
        this.deviceSize = GridOptionsEnum.Large;
        this.viewInitialized = false;
        this.isLegendSort = true;
        this.isMute = false;
        this.isLegendDisplay = true;
        this.chartType = ChartTypeEnum.Donut;
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
            if (this.chartType === ChartTypeEnum.Donut) {
                this.setDonutChartInnerText();
            }
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
            if (this.chartType === ChartTypeEnum.Donut) {
                seriesOption.innerSize = AswChartConstants.innerSize;
            }
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
AswPieDonut.decorators = [
    { type: Component, args: [{
                selector: 'asw-pie-donut',
                template: "<div #pieDonutChart></div>",
                styles: [""]
            },] }
];
AswPieDonut.ctorParameters = () => [
    { type: PercentPipe },
    { type: CurrencyPipe },
    { type: AswCurrencyPipe }
];
AswPieDonut.propDecorators = {
    config: [{ type: Input }],
    isLegendSort: [{ type: Input }],
    isMute: [{ type: Input }],
    isLegendDisplay: [{ type: Input }],
    icon: [{ type: Input }],
    label: [{ type: Input }],
    amount: [{ type: Input }],
    target: [{ type: Input }],
    chartType: [{ type: Input }],
    currencyCode: [{ type: Input }],
    legendPosition: [{ type: Input }],
    legendType: [{ type: Input }],
    legendWidthPx: [{ type: Input }],
    legendLayout: [{ type: Input }],
    donutSliceClick: [{ type: Output }],
    pieDonutChart: [{ type: ViewChild, args: ['pieDonutChart', { static: true },] }],
    onResize: [{ type: HostListener, args: ['window:resize',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllLWRvbnV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYXBwL2NvbXBvbmVudC9waWUtZG9udXQvY29tcG9uZW50L3BpZS1kb251dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVELE9BQU8sRUFFSCxTQUFTLEVBRVQsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0gsaUJBQWlCLEVBQ2pCLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixrQkFBa0IsRUFDbEIsY0FBYyxFQUVqQixNQUFNLDZCQUE2QixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMzRCxPQUFPLEtBQUssVUFBVSxNQUFNLFlBQVksQ0FBQztBQVd6QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFPeEQsTUFBTSxPQUFPLFdBQVc7SUF1QnBCLFlBQ1ksV0FBd0IsRUFDeEIsWUFBMEIsRUFDMUIsZUFBZ0M7UUFGaEMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBdkJyQyxlQUFVLEdBQW9CLGVBQWUsQ0FBQyxLQUFLLENBQUM7UUFDbkQsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFFdkIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLG9CQUFlLEdBQUcsSUFBSSxDQUFDO1FBS3ZCLGNBQVMsR0FBa0IsYUFBYSxDQUFDLEtBQUssQ0FBQztRQUMvQyxpQkFBWSxHQUFxQixnQkFBZ0IsQ0FBQyxH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SUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7c0JBR2xELElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7Ozs7U0FJM0MsQ0FBQztJQUNOLENBQUM7OztZQXBiSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLHNDQUErQjs7YUFFbEM7OztZQXhDc0IsV0FBVztZQUF6QixZQUFZO1lBY2pCLGVBQWU7OztxQkFnQ2QsS0FBSzsyQkFDTCxLQUFLO3FCQUNMLEtBQUs7OEJBQ0wsS0FBSzttQkFDTCxLQUFLO29CQUNMLEtBQUs7cUJBQ0wsS0FBSztxQkFDTCxLQUFLO3dCQUNMLEtBQUs7MkJBQ0wsS0FBSzs2QkFDTCxLQUFLO3lCQUNMLEtBQUs7NEJBQ0wsS0FBSzsyQkFDTCxLQUFLOzhCQUVMLE1BQU07NEJBRU4sU0FBUyxTQUFDLGVBQWUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7dUJBc0MzQyxZQUFZLFNBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgQVNXIChBIFNvZnR3YXJlIFdvcmxkKSBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG4gKlxyXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxyXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ3VycmVuY3lQaXBlLCBQZXJjZW50UGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgICBBZnRlclZpZXdJbml0LFxyXG4gICAgQ29tcG9uZW50LFxyXG4gICAgRWxlbWVudFJlZixcclxuICAgIEV2ZW50RW1pdHRlcixcclxuICAgIEhvc3RMaXN0ZW5lcixcclxuICAgIElucHV0LFxyXG4gICAgT25DaGFuZ2VzLFxyXG4gICAgT3V0cHV0LFxyXG4gICAgVmlld0NoaWxkXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgICBBc3dDaGFydENvbnN0YW50cyxcclxuICAgIEFzd0N1cnJlbmN5UGlwZSxcclxuICAgIEN1cnJlbmN5Q29kZUVudW0sXHJcbiAgICBHcmlkT3B0aW9uc0VudW0sXHJcbiAgICBMZWdlbmRMYXlvdXRFbnVtLFxyXG4gICAgTGVnZW5kUG9zaXRpb25FbnVtLFxyXG4gICAgTGVnZW5kVHlwZUVudW0sXHJcbiAgICBQb2ludENsaWNrRXZlbnRcclxufSBmcm9tICdAYXNvZnR3YXJld29ybGQvY2hhcnRzL2NvcmUnO1xyXG5pbXBvcnQgeyBPYmplY3RVdGlscyB9IGZyb20gJ0Bhc29mdHdhcmV3b3JsZC9jaGFydHMvdXRpbHMnO1xyXG5pbXBvcnQgKiBhcyBIaWdoY2hhcnRzIGZyb20gJ2hpZ2hjaGFydHMnO1xyXG5pbXBvcnQge1xyXG4gICAgQWxpZ25WYWx1ZSxcclxuICAgIE9wdGlvbnMsXHJcbiAgICBQb2ludENsaWNrRXZlbnRPYmplY3QsXHJcbiAgICBQb2ludE9wdGlvbnNPYmplY3QsXHJcbiAgICBQb2ludCxcclxuICAgIFNlcmllcyxcclxuICAgIFNlcmllc1BpZU9wdGlvbnMsXHJcbiAgICBWZXJ0aWNhbEFsaWduVmFsdWVcclxufSBmcm9tICdoaWdoY2hhcnRzJztcclxuaW1wb3J0IHsgQ2hhcnRUeXBlRW51bSB9IGZyb20gJy4uL2VudW0vY2hhcnQtdHlwZS5lbnVtJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdhc3ctcGllLWRvbnV0JyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9waWUtZG9udXQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9waWUtZG9udXQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBc3dQaWVEb251dCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XHJcblxyXG4gICAgcHJpdmF0ZSBjbG9uZUNvbmZpZ3VyYXRpb24hOiBPcHRpb25zO1xyXG4gICAgcHVibGljIGRldmljZVNpemU6IEdyaWRPcHRpb25zRW51bSA9IEdyaWRPcHRpb25zRW51bS5MYXJnZTtcclxuICAgIHByaXZhdGUgdmlld0luaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKSBjb25maWchOiBPcHRpb25zO1xyXG4gICAgQElucHV0KCkgaXNMZWdlbmRTb3J0ID0gdHJ1ZTtcclxuICAgIEBJbnB1dCgpIGlzTXV0ZSA9IGZhbHNlO1xyXG4gICAgQElucHV0KCkgaXNMZWdlbmREaXNwbGF5ID0gdHJ1ZTtcclxuICAgIEBJbnB1dCgpIGljb24hOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBsYWJlbDogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gICAgQElucHV0KCkgYW1vdW50OiBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkO1xyXG4gICAgQElucHV0KCkgdGFyZ2V0ITogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgY2hhcnRUeXBlOiBDaGFydFR5cGVFbnVtID0gQ2hhcnRUeXBlRW51bS5Eb251dDtcclxuICAgIEBJbnB1dCgpIGN1cnJlbmN5Q29kZTogQ3VycmVuY3lDb2RlRW51bSA9IEN1cnJlbmN5Q29kZUVudW0uSU5SO1xyXG4gICAgQElucHV0KCkgbGVnZW5kUG9zaXRpb246IExlZ2VuZFBvc2l0aW9uRW51bSA9IExlZ2VuZFBvc2l0aW9uRW51bS5SaWdodDtcclxuICAgIEBJbnB1dCgpIGxlZ2VuZFR5cGU6IExlZ2VuZFR5cGVFbnVtID0gTGVnZW5kVHlwZUVudW0uQm90aDtcclxuICAgIEBJbnB1dCgpIGxlZ2VuZFdpZHRoUHggPSAyNTA7XHJcbiAgICBASW5wdXQoKSBsZWdlbmRMYXlvdXQ6IExlZ2VuZExheW91dEVudW0gPSBMZWdlbmRMYXlvdXRFbnVtLlZlcnRpY2FsO1xyXG5cclxuICAgIEBPdXRwdXQoKSBkb251dFNsaWNlQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gICAgQFZpZXdDaGlsZCgncGllRG9udXRDaGFydCcsIHsgc3RhdGljOiB0cnVlIH0pIHBpZURvbnV0Q2hhcnQhOiBFbGVtZW50UmVmO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBwZXJjZW50UGlwZTogUGVyY2VudFBpcGUsXHJcbiAgICAgICAgcHJpdmF0ZSBjdXJyZW5jeVBpcGU6IEN1cnJlbmN5UGlwZSxcclxuICAgICAgICBwcml2YXRlIGFzd0N1cnJlbmN5UGlwZTogQXN3Q3VycmVuY3lQaXBlKSB7IH1cclxuXHJcbiAgICBuZ09uQ2hhbmdlcygpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMudmlld0luaXRpYWxpemVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2hhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy52aWV3SW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNoYXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdGlhbGl6ZUNoYXJ0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZykge1xyXG4gICAgICAgICAgICB0aGlzLmNsb25lQ29uZmlndXJhdGlvbiA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgICAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IHRoaXMucGllRG9udXRDaGFydC5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLmRldmljZVNpemUgPSBPYmplY3RVdGlscy5maW5kRGV2aWNlU2l6ZShjb250YWluZXJXaWR0aCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hhcnRDcmVkaXQoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXREb251dENoYXJ0VG9vbHRpcCgpO1xyXG4gICAgICAgICAgICBjb25zdCBzZXJpZXM6IFNlcmllc1BpZU9wdGlvbnNbXSA9IHRoaXMuY2xvbmVDb25maWd1cmF0aW9uLnNlcmllcyBhcyBTZXJpZXNQaWVPcHRpb25zW107XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RG9udXRDaGFydFNlcmllc09wdGlvbnMoc2VyaWVzKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubGVnZW5kTGF5b3V0ID09PSBMZWdlbmRMYXlvdXRFbnVtLlZlcnRpY2FsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldERvbnV0Q2hhcnRMZWdlbmRPcHRpb24odGhpcy5sZWdlbmRXaWR0aFB4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09IENoYXJ0VHlwZUVudW0uRG9udXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RG9udXRDaGFydElubmVyVGV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZG9udXRDaGFydFNsaWNlQ2xpY2soKTtcclxuICAgICAgICAgICAgSGlnaGNoYXJ0cy5jaGFydCh0aGlzLnBpZURvbnV0Q2hhcnQubmF0aXZlRWxlbWVudCwgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJylcclxuICAgIG9uUmVzaXplKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNoYXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVDaGFydENyZWRpdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNsb25lQ29uZmlndXJhdGlvbi5jcmVkaXRzID0ge1xyXG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXREb251dENoYXJ0VG9vbHRpcCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB0aGlzJDogdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24udG9vbHRpcCA9IHtcclxuICAgICAgICAgICAgdXNlSFRNTDogdHJ1ZSxcclxuICAgICAgICAgICAgc3BsaXQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IEFzd0NoYXJ0Q29uc3RhbnRzLmJsYWNrQ29sb3IsXHJcbiAgICAgICAgICAgIGJvcmRlckNvbG9yOiBBc3dDaGFydENvbnN0YW50cy5ibGFja0NvbG9yLFxyXG4gICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IEFzd0NoYXJ0Q29uc3RhbnRzLndoaXRlQ29sb3IsXHJcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogMCxcclxuICAgICAgICAgICAgZW5hYmxlZDogdGhpcy5pc011dGUgPyBmYWxzZSA6IHRydWUsXHJcbiAgICAgICAgICAgIGZvcm1hdHRlcigpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZTogbnVtYmVyID0gdGhpcy5wb2ludC5wZXJjZW50YWdlIGFzIG51bWJlcjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtZW5kIHRleHQtcmlnaHRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiY29sb3I6ICR7dGhpcy5wb2ludC5jb2xvcn1cIj5cXHUyNUEwPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz4ke3RoaXMucG9pbnQubmFtZX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC1lbmQgdGV4dC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHt0aGlzJC5wZXJjZW50UGlwZS50cmFuc2Zvcm0ocGVyY2VudGFnZSAvIDEwMCwgJy4yJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtZW5kIHRleHQtcmlnaHRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcyQuY3VycmVuY3lQaXBlLnRyYW5zZm9ybSh0aGlzLnBvaW50Lm9wdGlvbnMudmFsdWUsIHRoaXMkLmN1cnJlbmN5Q29kZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkb251dENoYXJ0U2xpY2VDbGljaygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5pc011dGUpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24ucGxvdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHNlcmllczoge1xyXG4gICAgICAgICAgICAgICAgZGF0YUxhYmVsczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcG9pbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgoZXZlbnQ6IFBvaW50Q2xpY2tFdmVudE9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnRDbGlja0V2ZW50OiBQb2ludENsaWNrRXZlbnQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZXZlbnQucG9pbnQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZXZlbnQucG9pbnQub3B0aW9ucy5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50YWdlOiBldmVudC5wb2ludC5wZXJjZW50YWdlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBldmVudC5wb2ludC5vcHRpb25zLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogZXZlbnQucG9pbnQub3B0aW9ucy50YXJnZXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRvbnV0U2xpY2VDbGljay5lbWl0KHBvaW50Q2xpY2tFdmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldERvbnV0Q2hhcnRTZXJpZXNPcHRpb25zKHNlcmllczogU2VyaWVzUGllT3B0aW9uc1tdKTogdm9pZCB7XHJcbiAgICAgICAgc2VyaWVzLmZvckVhY2goKHNlcmllc09wdGlvbjogU2VyaWVzUGllT3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBzZXJpZXNPcHRpb24uYWxsb3dQb2ludFNlbGVjdCA9IHRydWU7XHJcbiAgICAgICAgICAgIHNlcmllc09wdGlvbi5zaG93SW5MZWdlbmQgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT09IENoYXJ0VHlwZUVudW0uRG9udXQpIHtcclxuICAgICAgICAgICAgICAgIHNlcmllc09wdGlvbi5pbm5lclNpemUgPSBBc3dDaGFydENvbnN0YW50cy5pbm5lclNpemU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNNdXRlKSB7XHJcbiAgICAgICAgICAgICAgICBzZXJpZXNPcHRpb24ub3BhY2l0eSA9IDAuMzU7XHJcbiAgICAgICAgICAgICAgICBzZXJpZXNPcHRpb24uc3RhdGVzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGhvdmVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBpbmFjdGl2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBzZXJpZXNPcHRpb24uc2xpY2VkT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXJpZXNPcHRpb24uY3Vyc29yID0gQXN3Q2hhcnRDb25zdGFudHMucG9pbnRlcjtcclxuICAgICAgICAgICAgY29uc3QgZGF0YTogUG9pbnRPcHRpb25zT2JqZWN0W10gPSBzZXJpZXNPcHRpb24uZGF0YSBhcyBQb2ludE9wdGlvbnNPYmplY3RbXTtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVOZWdhdGl2ZVNlcmllc0RhdGEoZGF0YSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNvcnRlZFNlcmllc09wdGlvbkRhdGE6IFBvaW50T3B0aW9uc09iamVjdFtdID0gdGhpcy5pc0xlZ2VuZFNvcnQgPyB0aGlzLnNvcnRTZXJpZXNEYXRhKGRhdGEpIDogZGF0YTtcclxuICAgICAgICAgICAgc2VyaWVzT3B0aW9uLmRhdGEgPSBzb3J0ZWRTZXJpZXNPcHRpb25EYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc29ydFNlcmllc0RhdGEoZGF0YTogUG9pbnRPcHRpb25zT2JqZWN0W10pOiBQb2ludE9wdGlvbnNPYmplY3RbXSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGVnZW5kVHlwZSA9PT0gTGVnZW5kVHlwZUVudW0uRGVmYXVsdCkge1xyXG4gICAgICAgICAgICBkYXRhLnNvcnQoKGE6IGFueSwgYjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCcnICsgYS5uYW1lKS5sb2NhbGVDb21wYXJlKGIubmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkYXRhLnNvcnQoKGE6IGFueSwgYjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYS55ICYmIGIueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLnZhbHVlIC0gYi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkYXRhLnJldmVyc2UoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlTmVnYXRpdmVTZXJpZXNEYXRhKGRhdGE6IFBvaW50T3B0aW9uc09iamVjdFtdKTogdm9pZCB7XHJcbiAgICAgICAgZGF0YS5mb3JFYWNoKChlbGVtZW50OiBQb2ludE9wdGlvbnNPYmplY3QpID0+IHtcclxuICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IGVsZW1lbnQueTtcclxuICAgICAgICAgICAgZWxlbWVudC55ID0gZWxlbWVudC55ID8gTWF0aC5hYnMoZWxlbWVudC55KSA6IDAuMDAxO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0RG9udXRDaGFydExlZ2VuZE9wdGlvbihsZWdlbmRXaWR0aFB4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB0aGlzJDogdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24ubGVnZW5kID0ge1xyXG4gICAgICAgICAgICB1c2VIVE1MOiB0cnVlLFxyXG4gICAgICAgICAgICBlbmFibGVkOiB0aGlzLmlzTXV0ZSA/IGZhbHNlIDogdGhpcy5pc0xlZ2VuZERpc3BsYXksXHJcbiAgICAgICAgICAgIGZsb2F0aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgYWxpZ246IHRoaXMuc2V0TGVnZW5kQWxpZ25tZW50KCksXHJcbiAgICAgICAgICAgIGxheW91dDogJ3ZlcnRpY2FsJyxcclxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5zZXRMZWdlbmRWZXJ0aWNhbEFsaWdubWVudCgpLFxyXG4gICAgICAgICAgICBzeW1ib2xIZWlnaHQ6IDEwLFxyXG4gICAgICAgICAgICBzeW1ib2xXaWR0aDogMTAsXHJcbiAgICAgICAgICAgIHN5bWJvbFJhZGl1czogMCxcclxuICAgICAgICAgICAgaXRlbU1hcmdpblRvcDogMywgLy8gU3BhY2UgYmV0d2VlbiBlYWNoIGNhdGVnb3J5IGluIHRoZSBsZWdlbmRcclxuICAgICAgICAgICAgaXRlbU1hcmdpbkJvdHRvbTogMyxcclxuICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcy5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCA/ICcxMnB4JyA6ICcxNHB4JyxcclxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgd2lkdGg6IGxlZ2VuZFdpZHRoUHggKyAxNSxcclxuICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMkLnNldERvbnV0Q2hhcnRMZWdlbmRXaXRoSGVhZGVyKGxlZ2VuZFdpZHRoUHggKyAxNSksXHJcbiAgICAgICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gQXN3Q2hhcnRDb25zdGFudHMuZm9udFNpemUxMiA6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRTaXplMTQsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNmM3NTdkJyxcclxuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICc1MDAgMTRweC8yMHB4IEdvb2dsZSBTYW5zIFRleHQsQXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWYnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxhYmVsRm9ybWF0dGVyKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb2ludDogUG9pbnQgPSB0aGlzIGFzIFBvaW50O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMkLnNldERvbnV0Q2hhcnRMZWdlbmRXaXRoSGVhZGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZFdpZHRoUHgsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9pbnQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBwb2ludC5wZXJjZW50YWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50Lm9wdGlvbnMudmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEZvbnRTaXplKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGwgPyBBc3dDaGFydENvbnN0YW50cy5mb250U2l6ZTE0IDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFNpemUxNjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldExlZ2VuZEFsaWdubWVudCgpOiBBbGlnblZhbHVlIHtcclxuICAgICAgICBpZiAodGhpcy5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2NlbnRlcic7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSBMZWdlbmRQb3NpdGlvbkVudW0uUmlnaHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIExlZ2VuZFBvc2l0aW9uRW51bS5SaWdodDtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubGVnZW5kUG9zaXRpb24gPT09IExlZ2VuZFBvc2l0aW9uRW51bS5MZWZ0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBMZWdlbmRQb3NpdGlvbkVudW0uTGVmdDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2NlbnRlcic7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0TGVnZW5kVmVydGljYWxBbGlnbm1lbnQoKTogVmVydGljYWxBbGlnblZhbHVlIHtcclxuICAgICAgICBpZiAodGhpcy5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTGVnZW5kUG9zaXRpb25FbnVtLkJvdHRvbTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubGVnZW5kUG9zaXRpb24gPT09IExlZ2VuZFBvc2l0aW9uRW51bS5SaWdodCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ21pZGRsZSc7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSBMZWdlbmRQb3NpdGlvbkVudW0uTGVmdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ21pZGRsZSc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIExlZ2VuZFBvc2l0aW9uRW51bS5Cb3R0b207XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0RG9udXRDaGFydExlZ2VuZFdpdGhIZWFkZXIoXHJcbiAgICAgICAgbGVnZW5kV2lkdGhQeDogbnVtYmVyLFxyXG4gICAgICAgIG5hbWU/OiBzdHJpbmcgfCBudWxsLFxyXG4gICAgICAgIHBlcmNlbnRhZ2U/OiBudW1iZXIgfCB1bmRlZmluZWQsXHJcbiAgICAgICAgdmFsdWU/OiBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgbGVnZW5kQ2F0ZWdvcnlXaWR0aFB4OiBudW1iZXI7XHJcbiAgICAgICAgbGV0IGxlZ2VuZFZhbHVlV2lkdGhQeDogbnVtYmVyO1xyXG4gICAgICAgIGxldCBsZWdlbmRQZXJjZW50YWdlV2lkdGhQeDogbnVtYmVyO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTGVnZW5kVHlwZUVudW0uRGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6JHtsZWdlbmRXaWR0aFB4fXB4XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIGNvbC1zbS0xMiBjb2wtMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7bmFtZSA/IG5hbWUgOiAnQ2F0ZWdvcnknfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgYDtcclxuICAgICAgICAgICAgY2FzZSBMZWdlbmRUeXBlRW51bS5QZXJjZW50YWdlOlxyXG4gICAgICAgICAgICAgICAgbGVnZW5kQ2F0ZWdvcnlXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuOTtcclxuICAgICAgICAgICAgICAgIGxlZ2VuZFBlcmNlbnRhZ2VXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuMTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6JHtsZWdlbmRDYXRlZ29yeVdpZHRoUHggKyBsZWdlbmRQZXJjZW50YWdlV2lkdGhQeH1weFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC04IGNvbC1zbS04IGNvbC04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke25hbWUgPyBuYW1lIDogJ0NhdGVnb3J5J31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNCBjb2wtc20tNCBjb2wtNCB0ZXh0LWVuZCB0ZXh0LXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3BlcmNlbnRhZ2UgPyB0aGlzLnBlcmNlbnRQaXBlLnRyYW5zZm9ybShwZXJjZW50YWdlIC8gMTAwLCAnLjAnKSA6ICclJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgIGNhc2UgTGVnZW5kVHlwZUVudW0uVmFsdWU6XHJcbiAgICAgICAgICAgICAgICBsZWdlbmRDYXRlZ29yeVdpZHRoUHggPSBsZWdlbmRXaWR0aFB4ICogMC41O1xyXG4gICAgICAgICAgICAgICAgbGVnZW5kVmFsdWVXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuNTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6JHtsZWdlbmRDYXRlZ29yeVdpZHRoUHggKyBsZWdlbmRWYWx1ZVdpZHRoUHh9cHhcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNiBjb2wtc20tNiBjb2wtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtuYW1lID8gbmFtZSA6ICdDYXRlZ29yeSd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTYgY29sLXNtLTYgY29sLTYgdGV4dC1lbmQgdGV4dC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHt2YWx1ZSA/IHRoaXMuY3VycmVuY3lQaXBlLnRyYW5zZm9ybSh2YWx1ZSwgJ0lOUicpIDogJ1RvdGFsJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBsZWdlbmRDYXRlZ29yeVdpZHRoUHggPSBsZWdlbmRXaWR0aFB4ICogMC41O1xyXG4gICAgICAgICAgICAgICAgbGVnZW5kUGVyY2VudGFnZVdpZHRoUHggPSBsZWdlbmRXaWR0aFB4ICogMC4xO1xyXG4gICAgICAgICAgICAgICAgbGVnZW5kVmFsdWVXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuNDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6JHtsZWdlbmRDYXRlZ29yeVdpZHRoUHggKyBsZWdlbmRQZXJjZW50YWdlV2lkdGhQeCArIGxlZ2VuZFZhbHVlV2lkdGhQeH1weFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC01IGNvbC1zbS01IGNvbC01XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke25hbWUgPyBuYW1lIDogJ0NhdGVnb3J5J31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMiBjb2wteHMtMiBjb2wtMiB0ZXh0LWVuZCB0ZXh0LXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3BlcmNlbnRhZ2UgPyB0aGlzLnBlcmNlbnRQaXBlLnRyYW5zZm9ybShwZXJjZW50YWdlIC8gMTAwKSA6ICclJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNSBjb2wtc20tNSBjb2wtNSB0ZXh0LWVuZCB0ZXh0LXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3ZhbHVlID8gdGhpcy5jdXJyZW5jeVBpcGUudHJhbnNmb3JtKHZhbHVlLCB0aGlzLmN1cnJlbmN5Q29kZSwgJ3N5bWJvbCcsICcuMicpIDogJ1RvdGFsJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIGA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0RG9udXRDaGFydElubmVyVGV4dCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB0aGlzJDogdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24uY2hhcnQgPSB7XHJcbiAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgbG9hZCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2VudGVyWDogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjZW50ZXJZOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1XaWR0aDogbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VyaWVzLmZvckVhY2goKGVsZW1lbnQ6IFNlcmllcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludHM6IFBvaW50W10gPSBlbGVtZW50LnBvaW50cy5zbGljZSgwLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLmZvckVhY2goKHBvaW50OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlclggPSB0aGlzLnBsb3RMZWZ0ICsgKHBvaW50LnNoYXBlQXJncy54IC0gcG9pbnQuc2hhcGVBcmdzLmlubmVyUikgKyA4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyWSA9IHRoaXMucGxvdFRvcCArIHBvaW50LnNoYXBlQXJncy55IC0gMTQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtV2lkdGggPSAocG9pbnQuc2hhcGVBcmdzLmlubmVyUiAqIDIpIC0gMjA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyQuaWNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5sYWJlbCh0aGlzJC5zZXRJbm5lclRleHRJY29uKGl0ZW1XaWR0aCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyWCwgdGhpcyQuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGwgPyBjZW50ZXJZIC0gMjAgOiBjZW50ZXJZIC0gMjUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLCAzMCwgMzAsIHRydWUpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzJC5zZXRGb250U2l6ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IEFzd0NoYXJ0Q29uc3RhbnRzLmNlbnRlckFsaWduLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuYWRkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmxhYmVsKHRoaXMkLnNldElubmVyVGV4dExhYmVsKGl0ZW1XaWR0aCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgdW5kZWZpbmVkLCAzMCwgMzAsIHRydWUpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzJC5zZXRGb250U2l6ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IEFzd0NoYXJ0Q29uc3RhbnRzLmNlbnRlckFsaWduLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuYWRkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmxhYmVsKHRoaXMkLnNldElubmVyVGV4dFZhbHVlKGl0ZW1XaWR0aCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyWCwgdGhpcyQuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGwgPyBjZW50ZXJZICsgMjAgOiBjZW50ZXJZICsgMjUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLCAzMCwgMzAsIHRydWUpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzJC5zZXRGb250U2l6ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IEFzd0NoYXJ0Q29uc3RhbnRzLmNlbnRlckFsaWduLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuYWRkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmxhYmVsKHRoaXMkLnNldElubmVyVGV4dExhYmVsKGl0ZW1XaWR0aCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyWCwgdGhpcyQuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGwgPyBjZW50ZXJZIC0gMjAgOiBjZW50ZXJZIC0gMjUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLCAzMCwgMzAsIHRydWUpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzJC5zZXRGb250U2l6ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IEFzd0NoYXJ0Q29uc3RhbnRzLmNlbnRlckFsaWduLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuYWRkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmxhYmVsKHRoaXMkLnNldElubmVyVGV4dFZhbHVlKGl0ZW1XaWR0aCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgdW5kZWZpbmVkLCAzMCwgMzAsIHRydWUpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzJC5zZXRGb250U2l6ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IEFzd0NoYXJ0Q29uc3RhbnRzLmNlbnRlckFsaWduLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuYWRkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmxhYmVsKHRoaXMkLnNldElubmVyVGV4dFRhcmdldChpdGVtV2lkdGgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlclgsIHRoaXMkLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsID8gY2VudGVyWSArIDIwIDogY2VudGVyWSArIDI1LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCwgMzAsIDMwLCB0cnVlKS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcyQuc2V0Rm9udFNpemUoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBBc3dDaGFydENvbnN0YW50cy5jZW50ZXJBbGlnbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFdlaWdodFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmFkZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0SW5uZXJUZXh0TGFiZWwod2lkdGg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6ICR7d2lkdGh9cHg7IG9wYWNpdHk6ICR7dGhpcy5pc011dGUgPyAwLjM1IDogMX1cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LXRydW5jYXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHt0aGlzLmxhYmVsfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRJbm5lclRleHRJY29uKHdpZHRoOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiAke3dpZHRofXB4OyBvcGFjaXR5OiAke3RoaXMuaXNNdXRlID8gMC4zNSA6IDF9XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC10cnVuY2F0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICR7dGhpcy5pY29ufVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRJbm5lclRleHRWYWx1ZSh3aWR0aDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogJHt3aWR0aH1weDsgb3BhY2l0eTogJHt0aGlzLmlzTXV0ZSA/IDAuMzUgOiAxfVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtdHJ1bmNhdGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPiR7dGhpcy5hc3dDdXJyZW5jeVBpcGUudHJhbnNmb3JtKHRoaXMuYW1vdW50KX08L3N0cm9uZz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0SW5uZXJUZXh0VGFyZ2V0KHdpZHRoOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiAke3dpZHRofXB4OyBvcGFjaXR5OiAke3RoaXMuaXNNdXRlID8gMC4zNSA6IDF9XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC10cnVuY2F0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICR7dGhpcy50YXJnZXQgPyB0aGlzLnRhcmdldCA6ICcnfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcbn1cclxuIl19