import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { AswChartConstants, AswCurrencyPipe, CurrencyCodeEnum, GridOptionsEnum, LegendLayoutEnum, LegendPositionEnum, LegendTypeEnum } from '@asoftwareworld/charts/core';
import { ObjectUtils } from '@asoftwareworld/charts/utils';
import * as Highcharts from 'highcharts';
export class Line {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9jb21wb25lbnQvbGluZS9jb21wb25lbnQvbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVELE9BQU8sRUFFSCxTQUFTLEVBRVQsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0gsaUJBQWlCLEVBQ2pCLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixrQkFBa0IsRUFDbEIsY0FBYyxFQUVqQixNQUFNLDZCQUE2QixDQUFDO0FBQ3JDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMzRCxPQUFPLEtBQUssVUFBVSxNQUFNLFlBQVksQ0FBQztBQWlCekMsTUFBTSxPQUFPLElBQUk7SUFzQmIsWUFDWSxXQUF3QixFQUN4QixZQUEwQixFQUMxQixlQUFnQztRQUZoQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUF0QnJDLGVBQVUsR0FBb0IsZUFBZSxDQUFDLEtBQUssQ0FBQztRQUNuRCxvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUV2QixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2Ysb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFLdkIsaUJBQVksR0FBcUIsZ0JBQWdCLENBQUMsR0FBRyxDQUFDO1FBQ3RELG1CQUFjLEdBQXVCLGtCQUFrQixDQUFDLEtBQUssQ0FBQztRQUM5RCxlQUFVLEdBQW1CLGNBQWMsQ0FBQyxJQUFJLENBQUM7UUFDakQsa0JBQWEsR0FBRyxHQUFHLENB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WUFBWTtZQWNqQixlQUFlOzs7cUJBK0JkLEtBQUs7MkJBQ0wsS0FBSztxQkFDTCxLQUFLOzhCQUNMLEtBQUs7bUJBQ0wsS0FBSztvQkFDTCxLQUFLO3FCQUNMLEtBQUs7cUJBQ0wsS0FBSzsyQkFDTCxLQUFLOzZCQUNMLEtBQUs7eUJBQ0wsS0FBSzs0QkFDTCxLQUFLOzJCQUNMLEtBQUs7OEJBRUwsTUFBTTs0QkFFTixTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTt1QkFzQ3ZDLFlBQVksU0FBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ3VycmVuY3lQaXBlLCBQZXJjZW50UGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQ29tcG9uZW50LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEhvc3RMaXN0ZW5lcixcbiAgICBJbnB1dCxcbiAgICBPbkNoYW5nZXMsXG4gICAgT3V0cHV0LFxuICAgIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gICAgQXN3Q2hhcnRDb25zdGFudHMsXG4gICAgQXN3Q3VycmVuY3lQaXBlLFxuICAgIEN1cnJlbmN5Q29kZUVudW0sXG4gICAgR3JpZE9wdGlvbnNFbnVtLFxuICAgIExlZ2VuZExheW91dEVudW0sXG4gICAgTGVnZW5kUG9zaXRpb25FbnVtLFxuICAgIExlZ2VuZFR5cGVFbnVtLFxuICAgIFBvaW50Q2xpY2tFdmVudFxufSBmcm9tICdAYXNvZnR3YXJld29ybGQvY2hhcnRzL2NvcmUnO1xuaW1wb3J0IHsgT2JqZWN0VXRpbHMgfSBmcm9tICdAYXNvZnR3YXJld29ybGQvY2hhcnRzL3V0aWxzJztcbmltcG9ydCAqIGFzIEhpZ2hjaGFydHMgZnJvbSAnaGlnaGNoYXJ0cyc7XG5pbXBvcnQge1xuICAgIEFsaWduVmFsdWUsXG4gICAgT3B0aW9ucyxcbiAgICBQb2ludENsaWNrRXZlbnRPYmplY3QsXG4gICAgUG9pbnRPcHRpb25zT2JqZWN0LFxuICAgIFBvaW50LFxuICAgIFNlcmllcyxcbiAgICBTZXJpZXNQaWVPcHRpb25zLFxuICAgIFZlcnRpY2FsQWxpZ25WYWx1ZVxufSBmcm9tICdoaWdoY2hhcnRzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhc3ctbGluZScsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2xpbmUuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vbGluZS5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTGluZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgICBwcml2YXRlIGNsb25lQ29uZmlndXJhdGlvbiE6IE9wdGlvbnM7XG4gICAgcHVibGljIGRldmljZVNpemU6IEdyaWRPcHRpb25zRW51bSA9IEdyaWRPcHRpb25zRW51bS5MYXJnZTtcbiAgICBwcml2YXRlIHZpZXdJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIEBJbnB1dCgpIGNvbmZpZyE6IE9wdGlvbnM7XG4gICAgQElucHV0KCkgaXNMZWdlbmRTb3J0ID0gdHJ1ZTtcbiAgICBASW5wdXQoKSBpc011dGUgPSBmYWxzZTtcbiAgICBASW5wdXQoKSBpc0xlZ2VuZERpc3BsYXkgPSB0cnVlO1xuICAgIEBJbnB1dCgpIGljb24hOiBzdHJpbmc7XG4gICAgQElucHV0KCkgbGFiZWw6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBASW5wdXQoKSBhbW91bnQ6IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgQElucHV0KCkgdGFyZ2V0ITogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGN1cnJlbmN5Q29kZTogQ3VycmVuY3lDb2RlRW51bSA9IEN1cnJlbmN5Q29kZUVudW0uSU5SO1xuICAgIEBJbnB1dCgpIGxlZ2VuZFBvc2l0aW9uOiBMZWdlbmRQb3NpdGlvbkVudW0gPSBMZWdlbmRQb3NpdGlvbkVudW0uUmlnaHQ7XG4gICAgQElucHV0KCkgbGVnZW5kVHlwZTogTGVnZW5kVHlwZUVudW0gPSBMZWdlbmRUeXBlRW51bS5Cb3RoO1xuICAgIEBJbnB1dCgpIGxlZ2VuZFdpZHRoUHggPSAyNTA7XG4gICAgQElucHV0KCkgbGVnZW5kTGF5b3V0OiBMZWdlbmRMYXlvdXRFbnVtID0gTGVnZW5kTGF5b3V0RW51bS5WZXJ0aWNhbDtcblxuICAgIEBPdXRwdXQoKSBkb251dFNsaWNlQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgICBAVmlld0NoaWxkKCdsaW5lQ2hhcnQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwaWVEb251dENoYXJ0ITogRWxlbWVudFJlZjtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBwZXJjZW50UGlwZTogUGVyY2VudFBpcGUsXG4gICAgICAgIHByaXZhdGUgY3VycmVuY3lQaXBlOiBDdXJyZW5jeVBpcGUsXG4gICAgICAgIHByaXZhdGUgYXN3Q3VycmVuY3lQaXBlOiBBc3dDdXJyZW5jeVBpcGUpIHsgfVxuXG4gICAgbmdPbkNoYW5nZXMoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy52aWV3SW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRpYWxpemVDaGFydCgpO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52aWV3SW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVDaGFydCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVDaGFydCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnKSB7XG4gICAgICAgICAgICB0aGlzLmNsb25lQ29uZmlndXJhdGlvbiA9IHRoaXMuY29uZmlnO1xuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyV2lkdGggPSB0aGlzLnBpZURvbnV0Q2hhcnQubmF0aXZlRWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgIHRoaXMuZGV2aWNlU2l6ZSA9IE9iamVjdFV0aWxzLmZpbmREZXZpY2VTaXplKGNvbnRhaW5lcldpZHRoKTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hhcnRDcmVkaXQoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0RG9udXRDaGFydFRvb2x0aXAoKTtcbiAgICAgICAgICAgIGNvbnN0IHNlcmllczogU2VyaWVzUGllT3B0aW9uc1tdID0gdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24uc2VyaWVzIGFzIFNlcmllc1BpZU9wdGlvbnNbXTtcbiAgICAgICAgICAgIHRoaXMuc2V0RG9udXRDaGFydFNlcmllc09wdGlvbnMoc2VyaWVzKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmxlZ2VuZExheW91dCA9PT0gTGVnZW5kTGF5b3V0RW51bS5WZXJ0aWNhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0RG9udXRDaGFydExlZ2VuZE9wdGlvbih0aGlzLmxlZ2VuZFdpZHRoUHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgKHRoaXMuY2hhcnRUeXBlID09PSBDaGFydFR5cGVFbnVtLkRvbnV0KSB7XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5zZXREb251dENoYXJ0SW5uZXJUZXh0KCk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB0aGlzLmRvbnV0Q2hhcnRTbGljZUNsaWNrKCk7XG4gICAgICAgICAgICBIaWdoY2hhcnRzLmNoYXJ0KHRoaXMucGllRG9udXRDaGFydC5uYXRpdmVFbGVtZW50LCB0aGlzLmNsb25lQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJylcbiAgICBvblJlc2l6ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2hhcnQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZUNoYXJ0Q3JlZGl0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsb25lQ29uZmlndXJhdGlvbi5jcmVkaXRzID0ge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldERvbnV0Q2hhcnRUb29sdGlwKCk6IHZvaWQge1xuICAgICAgICBjb25zdCB0aGlzJDogdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2xvbmVDb25maWd1cmF0aW9uLnRvb2x0aXAgPSB7XG4gICAgICAgICAgICB1c2VIVE1MOiB0cnVlLFxuICAgICAgICAgICAgc3BsaXQ6IGZhbHNlLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBBc3dDaGFydENvbnN0YW50cy5ibGFja0NvbG9yLFxuICAgICAgICAgICAgYm9yZGVyQ29sb3I6IEFzd0NoYXJ0Q29uc3RhbnRzLmJsYWNrQ29sb3IsXG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgIGNvbG9yOiBBc3dDaGFydENvbnN0YW50cy53aGl0ZUNvbG9yLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgICAgICBlbmFibGVkOiB0aGlzLmlzTXV0ZSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgICAgICAgIGZvcm1hdHRlcigpOiBzdHJpbmcge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2U6IG51bWJlciA9IHRoaXMucG9pbnQucGVyY2VudGFnZSBhcyBudW1iZXI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LWVuZCB0ZXh0LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJjb2xvcjogJHt0aGlzLnBvaW50LmNvbG9yfVwiPlxcdTI1QTA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz4ke3RoaXMucG9pbnQubmFtZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LWVuZCB0ZXh0LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHt0aGlzJC5wZXJjZW50UGlwZS50cmFuc2Zvcm0ocGVyY2VudGFnZSAvIDEwMCwgJy4yJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC1lbmQgdGV4dC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcyQuY3VycmVuY3lQaXBlLnRyYW5zZm9ybSh0aGlzLnBvaW50Lm9wdGlvbnMudmFsdWUsIHRoaXMkLmN1cnJlbmN5Q29kZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRvbnV0Q2hhcnRTbGljZUNsaWNrKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc011dGUpIHsgcmV0dXJuOyB9XG4gICAgICAgIHRoaXMuY2xvbmVDb25maWd1cmF0aW9uLnBsb3RPcHRpb25zID0ge1xuICAgICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICAgICAgZGF0YUxhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcG9pbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGljazogKChldmVudDogUG9pbnRDbGlja0V2ZW50T2JqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnRDbGlja0V2ZW50OiBQb2ludENsaWNrRXZlbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGV2ZW50LnBvaW50Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBldmVudC5wb2ludC5vcHRpb25zLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50YWdlOiBldmVudC5wb2ludC5wZXJjZW50YWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZXZlbnQucG9pbnQub3B0aW9ucy52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBldmVudC5wb2ludC5vcHRpb25zLnRhcmdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kb251dFNsaWNlQ2xpY2suZW1pdChwb2ludENsaWNrRXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldERvbnV0Q2hhcnRTZXJpZXNPcHRpb25zKHNlcmllczogU2VyaWVzUGllT3B0aW9uc1tdKTogdm9pZCB7XG4gICAgICAgIHNlcmllcy5mb3JFYWNoKChzZXJpZXNPcHRpb246IFNlcmllc1BpZU9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgIHNlcmllc09wdGlvbi5hbGxvd1BvaW50U2VsZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlcmllc09wdGlvbi5zaG93SW5MZWdlbmQgPSB0cnVlO1xuICAgICAgICAgICAgLy8gaWYgKHRoaXMuY2hhcnRUeXBlID09PSBDaGFydFR5cGVFbnVtLkRvbnV0KSB7XG4gICAgICAgICAgICAvLyAgICAgc2VyaWVzT3B0aW9uLmlubmVyU2l6ZSA9IEFzd0NoYXJ0Q29uc3RhbnRzLmlubmVyU2l6ZTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzTXV0ZSkge1xuICAgICAgICAgICAgICAgIHNlcmllc09wdGlvbi5vcGFjaXR5ID0gMC4zNTtcbiAgICAgICAgICAgICAgICBzZXJpZXNPcHRpb24uc3RhdGVzID0ge1xuICAgICAgICAgICAgICAgICAgICBob3Zlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgaW5hY3RpdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNlcmllc09wdGlvbi5zbGljZWRPZmZzZXQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VyaWVzT3B0aW9uLmN1cnNvciA9IEFzd0NoYXJ0Q29uc3RhbnRzLnBvaW50ZXI7XG4gICAgICAgICAgICBjb25zdCBkYXRhOiBQb2ludE9wdGlvbnNPYmplY3RbXSA9IHNlcmllc09wdGlvbi5kYXRhIGFzIFBvaW50T3B0aW9uc09iamVjdFtdO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVOZWdhdGl2ZVNlcmllc0RhdGEoZGF0YSk7XG4gICAgICAgICAgICBjb25zdCBzb3J0ZWRTZXJpZXNPcHRpb25EYXRhOiBQb2ludE9wdGlvbnNPYmplY3RbXSA9IHRoaXMuaXNMZWdlbmRTb3J0ID8gdGhpcy5zb3J0U2VyaWVzRGF0YShkYXRhKSA6IGRhdGE7XG4gICAgICAgICAgICBzZXJpZXNPcHRpb24uZGF0YSA9IHNvcnRlZFNlcmllc09wdGlvbkRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc29ydFNlcmllc0RhdGEoZGF0YTogUG9pbnRPcHRpb25zT2JqZWN0W10pOiBQb2ludE9wdGlvbnNPYmplY3RbXSB7XG4gICAgICAgIGlmICh0aGlzLmxlZ2VuZFR5cGUgPT09IExlZ2VuZFR5cGVFbnVtLkRlZmF1bHQpIHtcbiAgICAgICAgICAgIGRhdGEuc29ydCgoYTogYW55LCBiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCcnICsgYS5uYW1lKS5sb2NhbGVDb21wYXJlKGIubmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5zb3J0KChhOiBhbnksIGI6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChhLnkgJiYgYi55KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLnZhbHVlIC0gYi52YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRhdGEucmV2ZXJzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZU5lZ2F0aXZlU2VyaWVzRGF0YShkYXRhOiBQb2ludE9wdGlvbnNPYmplY3RbXSk6IHZvaWQge1xuICAgICAgICBkYXRhLmZvckVhY2goKGVsZW1lbnQ6IFBvaW50T3B0aW9uc09iamVjdCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IGVsZW1lbnQueTtcbiAgICAgICAgICAgIGVsZW1lbnQueSA9IGVsZW1lbnQueSA/IE1hdGguYWJzKGVsZW1lbnQueSkgOiAwLjAwMTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXREb251dENoYXJ0TGVnZW5kT3B0aW9uKGxlZ2VuZFdpZHRoUHg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCB0aGlzJDogdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2xvbmVDb25maWd1cmF0aW9uLmxlZ2VuZCA9IHtcbiAgICAgICAgICAgIHVzZUhUTUw6IHRydWUsXG4gICAgICAgICAgICBlbmFibGVkOiB0aGlzLmlzTXV0ZSA/IGZhbHNlIDogdGhpcy5pc0xlZ2VuZERpc3BsYXksXG4gICAgICAgICAgICBmbG9hdGluZzogZmFsc2UsXG4gICAgICAgICAgICBhbGlnbjogdGhpcy5zZXRMZWdlbmRBbGlnbm1lbnQoKSxcbiAgICAgICAgICAgIGxheW91dDogJ3ZlcnRpY2FsJyxcbiAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246IHRoaXMuc2V0TGVnZW5kVmVydGljYWxBbGlnbm1lbnQoKSxcbiAgICAgICAgICAgIHN5bWJvbEhlaWdodDogMTAsXG4gICAgICAgICAgICBzeW1ib2xXaWR0aDogMTAsXG4gICAgICAgICAgICBzeW1ib2xSYWRpdXM6IDAsXG4gICAgICAgICAgICBpdGVtTWFyZ2luVG9wOiAzLCAvLyBTcGFjZSBiZXR3ZWVuIGVhY2ggY2F0ZWdvcnkgaW4gdGhlIGxlZ2VuZFxuICAgICAgICAgICAgaXRlbU1hcmdpbkJvdHRvbTogMyxcbiAgICAgICAgICAgIGl0ZW1TdHlsZToge1xuICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsID8gJzEycHgnIDogJzE0cHgnLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3aWR0aDogbGVnZW5kV2lkdGhQeCArIDE1LFxuICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzJC5zZXREb251dENoYXJ0TGVnZW5kV2l0aEhlYWRlcihsZWdlbmRXaWR0aFB4ICsgMTUpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICA/IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRTaXplMTIgOiBBc3dDaGFydENvbnN0YW50cy5mb250U2l6ZTE0LFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM2Yzc1N2QnLFxuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnNTAwIDE0cHgvMjBweCBHb29nbGUgU2FucyBUZXh0LEFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsYWJlbEZvcm1hdHRlcigpOiBzdHJpbmcge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50OiBQb2ludCA9IHRoaXMgYXMgUG9pbnQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMkLnNldERvbnV0Q2hhcnRMZWdlbmRXaXRoSGVhZGVyKFxuICAgICAgICAgICAgICAgICAgICBsZWdlbmRXaWR0aFB4LFxuICAgICAgICAgICAgICAgICAgICBwb2ludC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBwb2ludC5wZXJjZW50YWdlLFxuICAgICAgICAgICAgICAgICAgICBwb2ludC5vcHRpb25zLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEZvbnRTaXplKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsID8gQXN3Q2hhcnRDb25zdGFudHMuZm9udFNpemUxNCA6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRTaXplMTY7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRMZWdlbmRBbGlnbm1lbnQoKTogQWxpZ25WYWx1ZSB7XG4gICAgICAgIGlmICh0aGlzLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2NlbnRlcic7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5sZWdlbmRQb3NpdGlvbiA9PT0gTGVnZW5kUG9zaXRpb25FbnVtLlJpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gTGVnZW5kUG9zaXRpb25FbnVtLlJpZ2h0O1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubGVnZW5kUG9zaXRpb24gPT09IExlZ2VuZFBvc2l0aW9uRW51bS5MZWZ0KSB7XG4gICAgICAgICAgICByZXR1cm4gTGVnZW5kUG9zaXRpb25FbnVtLkxlZnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJ2NlbnRlcic7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNldExlZ2VuZFZlcnRpY2FsQWxpZ25tZW50KCk6IFZlcnRpY2FsQWxpZ25WYWx1ZSB7XG4gICAgICAgIGlmICh0aGlzLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gTGVnZW5kUG9zaXRpb25FbnVtLkJvdHRvbTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSBMZWdlbmRQb3NpdGlvbkVudW0uUmlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiAnbWlkZGxlJztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSBMZWdlbmRQb3NpdGlvbkVudW0uTGVmdCkge1xuICAgICAgICAgICAgcmV0dXJuICdtaWRkbGUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIExlZ2VuZFBvc2l0aW9uRW51bS5Cb3R0b207XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNldERvbnV0Q2hhcnRMZWdlbmRXaXRoSGVhZGVyKFxuICAgICAgICBsZWdlbmRXaWR0aFB4OiBudW1iZXIsXG4gICAgICAgIG5hbWU/OiBzdHJpbmcgfCBudWxsLFxuICAgICAgICBwZXJjZW50YWdlPzogbnVtYmVyIHwgdW5kZWZpbmVkLFxuICAgICAgICB2YWx1ZT86IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICAgICAgICBsZXQgbGVnZW5kQ2F0ZWdvcnlXaWR0aFB4OiBudW1iZXI7XG4gICAgICAgIGxldCBsZWdlbmRWYWx1ZVdpZHRoUHg6IG51bWJlcjtcbiAgICAgICAgbGV0IGxlZ2VuZFBlcmNlbnRhZ2VXaWR0aFB4OiBudW1iZXI7XG4gICAgICAgIHN3aXRjaCAodGhpcy5sZWdlbmRUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIExlZ2VuZFR5cGVFbnVtLkRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6JHtsZWdlbmRXaWR0aFB4fXB4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgY29sLXNtLTEyIGNvbC0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7bmFtZSA/IG5hbWUgOiAnQ2F0ZWdvcnknfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIGA7XG4gICAgICAgICAgICBjYXNlIExlZ2VuZFR5cGVFbnVtLlBlcmNlbnRhZ2U6XG4gICAgICAgICAgICAgICAgbGVnZW5kQ2F0ZWdvcnlXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuOTtcbiAgICAgICAgICAgICAgICBsZWdlbmRQZXJjZW50YWdlV2lkdGhQeCA9IGxlZ2VuZFdpZHRoUHggKiAwLjE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6JHtsZWdlbmRDYXRlZ29yeVdpZHRoUHggKyBsZWdlbmRQZXJjZW50YWdlV2lkdGhQeH1weFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTggY29sLXNtLTggY29sLThcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke25hbWUgPyBuYW1lIDogJ0NhdGVnb3J5J31cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC00IGNvbC1zbS00IGNvbC00IHRleHQtZW5kIHRleHQtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3BlcmNlbnRhZ2UgPyB0aGlzLnBlcmNlbnRQaXBlLnRyYW5zZm9ybShwZXJjZW50YWdlIC8gMTAwLCAnLjAnKSA6ICclJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgY2FzZSBMZWdlbmRUeXBlRW51bS5WYWx1ZTpcbiAgICAgICAgICAgICAgICBsZWdlbmRDYXRlZ29yeVdpZHRoUHggPSBsZWdlbmRXaWR0aFB4ICogMC41O1xuICAgICAgICAgICAgICAgIGxlZ2VuZFZhbHVlV2lkdGhQeCA9IGxlZ2VuZFdpZHRoUHggKiAwLjU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6JHtsZWdlbmRDYXRlZ29yeVdpZHRoUHggKyBsZWdlbmRWYWx1ZVdpZHRoUHh9cHhcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC02IGNvbC1zbS02IGNvbC02XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtuYW1lID8gbmFtZSA6ICdDYXRlZ29yeSd9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNiBjb2wtc20tNiBjb2wtNiB0ZXh0LWVuZCB0ZXh0LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHt2YWx1ZSA/IHRoaXMuY3VycmVuY3lQaXBlLnRyYW5zZm9ybSh2YWx1ZSwgJ0lOUicpIDogJ1RvdGFsJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBsZWdlbmRDYXRlZ29yeVdpZHRoUHggPSBsZWdlbmRXaWR0aFB4ICogMC41O1xuICAgICAgICAgICAgICAgIGxlZ2VuZFBlcmNlbnRhZ2VXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuMTtcbiAgICAgICAgICAgICAgICBsZWdlbmRWYWx1ZVdpZHRoUHggPSBsZWdlbmRXaWR0aFB4ICogMC40O1xuICAgICAgICAgICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiR7bGVnZW5kQ2F0ZWdvcnlXaWR0aFB4ICsgbGVnZW5kUGVyY2VudGFnZVdpZHRoUHggKyBsZWdlbmRWYWx1ZVdpZHRoUHh9cHhcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC01IGNvbC1zbS01IGNvbC01XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtuYW1lID8gbmFtZSA6ICdDYXRlZ29yeSd9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMiBjb2wteHMtMiBjb2wtMiB0ZXh0LWVuZCB0ZXh0LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtwZXJjZW50YWdlID8gdGhpcy5wZXJjZW50UGlwZS50cmFuc2Zvcm0ocGVyY2VudGFnZSAvIDEwMCkgOiAnJSd9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNSBjb2wtc20tNSBjb2wtNSB0ZXh0LWVuZCB0ZXh0LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHt2YWx1ZSA/IHRoaXMuY3VycmVuY3lQaXBlLnRyYW5zZm9ybSh2YWx1ZSwgdGhpcy5jdXJyZW5jeUNvZGUsICdzeW1ib2wnLCAnLjInKSA6ICdUb3RhbCd9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgYDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0RG9udXRDaGFydElubmVyVGV4dCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdGhpcyQ6IHRoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNsb25lQ29uZmlndXJhdGlvbi5jaGFydCA9IHtcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgIGxvYWQoKTogdm9pZCB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjZW50ZXJYOiBudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjZW50ZXJZOiBudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtV2lkdGg6IG51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJpZXMuZm9yRWFjaCgoZWxlbWVudDogU2VyaWVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludHM6IFBvaW50W10gPSBlbGVtZW50LnBvaW50cy5zbGljZSgwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5mb3JFYWNoKChwb2ludDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyWCA9IHRoaXMucGxvdExlZnQgKyAocG9pbnQuc2hhcGVBcmdzLnggLSBwb2ludC5zaGFwZUFyZ3MuaW5uZXJSKSArIDg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyWSA9IHRoaXMucGxvdFRvcCArIHBvaW50LnNoYXBlQXJncy55IC0gMTQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVdpZHRoID0gKHBvaW50LnNoYXBlQXJncy5pbm5lclIgKiAyKSAtIDIwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyQuaWNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGFiZWwodGhpcyQuc2V0SW5uZXJUZXh0SWNvbihpdGVtV2lkdGgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXJYLCB0aGlzJC5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCA/IGNlbnRlclkgLSAyMCA6IGNlbnRlclkgLSAyNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLCAzMCwgMzAsIHRydWUpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcyQuc2V0Rm9udFNpemUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogQXN3Q2hhcnRDb25zdGFudHMuY2VudGVyQWxpZ24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmFkZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGFiZWwodGhpcyQuc2V0SW5uZXJUZXh0TGFiZWwoaXRlbVdpZHRoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgdW5kZWZpbmVkLCAzMCwgMzAsIHRydWUpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcyQuc2V0Rm9udFNpemUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogQXN3Q2hhcnRDb25zdGFudHMuY2VudGVyQWxpZ24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmFkZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGFiZWwodGhpcyQuc2V0SW5uZXJUZXh0VmFsdWUoaXRlbVdpZHRoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyWCwgdGhpcyQuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGwgPyBjZW50ZXJZICsgMjAgOiBjZW50ZXJZICsgMjUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCwgMzAsIDMwLCB0cnVlKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IHRoaXMkLnNldEZvbnRTaXplKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IEFzd0NoYXJ0Q29uc3RhbnRzLmNlbnRlckFsaWduLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFdlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5hZGQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5sYWJlbCh0aGlzJC5zZXRJbm5lclRleHRMYWJlbChpdGVtV2lkdGgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXJYLCB0aGlzJC5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCA/IGNlbnRlclkgLSAyMCA6IGNlbnRlclkgLSAyNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLCAzMCwgMzAsIHRydWUpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcyQuc2V0Rm9udFNpemUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogQXN3Q2hhcnRDb25zdGFudHMuY2VudGVyQWxpZ24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmFkZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGFiZWwodGhpcyQuc2V0SW5uZXJUZXh0VmFsdWUoaXRlbVdpZHRoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyWCwgY2VudGVyWSwgdW5kZWZpbmVkLCAzMCwgMzAsIHRydWUpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcyQuc2V0Rm9udFNpemUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogQXN3Q2hhcnRDb25zdGFudHMuY2VudGVyQWxpZ24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmFkZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGFiZWwodGhpcyQuc2V0SW5uZXJUZXh0VGFyZ2V0KGl0ZW1XaWR0aCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlclgsIHRoaXMkLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsID8gY2VudGVyWSArIDIwIDogY2VudGVyWSArIDI1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsIDMwLCAzMCwgdHJ1ZSkuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzJC5zZXRGb250U2l6ZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBBc3dDaGFydENvbnN0YW50cy5jZW50ZXJBbGlnbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRXZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuYWRkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldElubmVyVGV4dExhYmVsKHdpZHRoOiBudW1iZXIpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6ICR7d2lkdGh9cHg7IG9wYWNpdHk6ICR7dGhpcy5pc011dGUgPyAwLjM1IDogMX1cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtdHJ1bmNhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgJHt0aGlzLmxhYmVsfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0SW5uZXJUZXh0SWNvbih3aWR0aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiAke3dpZHRofXB4OyBvcGFjaXR5OiAke3RoaXMuaXNNdXRlID8gMC4zNSA6IDF9XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LXRydW5jYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICR7dGhpcy5pY29ufVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0SW5uZXJUZXh0VmFsdWUod2lkdGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogJHt3aWR0aH1weDsgb3BhY2l0eTogJHt0aGlzLmlzTXV0ZSA/IDAuMzUgOiAxfVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC10cnVuY2F0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPiR7dGhpcy5hc3dDdXJyZW5jeVBpcGUudHJhbnNmb3JtKHRoaXMuYW1vdW50KX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldElubmVyVGV4dFRhcmdldCh3aWR0aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiAke3dpZHRofXB4OyBvcGFjaXR5OiAke3RoaXMuaXNNdXRlID8gMC4zNSA6IDF9XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LXRydW5jYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICR7dGhpcy50YXJnZXQgPyB0aGlzLnRhcmdldCA6ICcnfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgIH1cbn1cbiJdfQ==