import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { AswChartConstants, ChartLegendTypeEnum, CurrencyCodeEnum, GridOptionsEnum, LegendLayoutEnum, LegendPositionEnum } from '@asoftwareworld/charts/core';
import { ObjectUtils } from '@asoftwareworld/charts/utils';
import * as Highcharts from 'highcharts';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@asoftwareworld/charts/core";
export class AswBarColumn {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLWNvbHVtbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9jb21wb25lbnQvYmFyLWNvbHVtbi9jb21wb25lbnQvYmFyLWNvbHVtbi50cyIsIi4uLy4uLy4uLy4uL2FwcC9jb21wb25lbnQvYmFyLWNvbHVtbi9jb21wb25lbnQvYmFyLWNvbHVtbi5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFFSCxTQUFTLEVBRVQsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0gsaUJBQWlCLEVBRWpCLG1CQUFtQixFQUVuQixnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixrQkFBa0IsRUFFckIsTUFBTSw2QkFBNkIsQ0FBQztBQUNyQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDM0QsT0FBTyxLQUFLLFVBQVUsTUFBTSxZQUFZLENBQUM7Ozs7QUFpQnpDLE1BQU0sT0FBTyxZQUFZO0lBb0JyQixZQUNZLFdBQXdCLEVBQ3hCLFlBQTBCLEVBQzFCLGVBQWdDO1FBRmhDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQXBCckMsZUFBVSxHQUFvQixlQUFlLENBQUMsS0FBSyxDQUFDO1FBQ25ELG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBRXZCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBS3BCLGlCQUFZLEdBQXFCLGdCQUFnQixDQUFDLEtBQUssQ0FBQztRQUN4RCxtQkFBYyxHQUF1QixrQkFBa0IsQ0FBQyxLQUFLLENBQUM7UUFDOUQsZUFBVSxHQUF3QixtQkFBbUIsQ0FBQyxJQUFJLENBQUM7UUFDM0Qsa0JBQWEsR0FBRyxHQUFHLENBQUM7UUFDcEIsaUJBQVksR0FBcUIsZ0JB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QUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVJLFFBQVE7c0JBQWpCLE1BQU07Z0JBRXdDLGNBQWM7c0JBQTVELFNBQVM7dUJBQUMsZ0JBQWdCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQW1DN0MsUUFBUTtzQkFEUCxZQUFZO3VCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDdXJyZW5jeVBpcGUsIFBlcmNlbnRQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBDb21wb25lbnQsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIElucHV0LFxuICAgIE9uQ2hhbmdlcyxcbiAgICBPdXRwdXQsXG4gICAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgICBBc3dDaGFydENvbnN0YW50cyxcbiAgICBBc3dDdXJyZW5jeVBpcGUsXG4gICAgQ2hhcnRMZWdlbmRUeXBlRW51bSxcbiAgICBDaGFydFBvaW50ZXJFdmVudCxcbiAgICBDdXJyZW5jeUNvZGVFbnVtLFxuICAgIEdyaWRPcHRpb25zRW51bSxcbiAgICBMZWdlbmRMYXlvdXRFbnVtLFxuICAgIExlZ2VuZFBvc2l0aW9uRW51bSxcbiAgICBQb2ludENsaWNrRXZlbnRcbn0gZnJvbSAnQGFzb2Z0d2FyZXdvcmxkL2NoYXJ0cy9jb3JlJztcbmltcG9ydCB7IE9iamVjdFV0aWxzIH0gZnJvbSAnQGFzb2Z0d2FyZXdvcmxkL2NoYXJ0cy91dGlscyc7XG5pbXBvcnQgKiBhcyBIaWdoY2hhcnRzIGZyb20gJ2hpZ2hjaGFydHMnO1xuaW1wb3J0IHtcbiAgICBBbGlnblZhbHVlLFxuICAgIE9wdGlvbnMsXG4gICAgUG9pbnRDbGlja0V2ZW50T2JqZWN0LFxuICAgIFBvaW50T3B0aW9uc09iamVjdCxcbiAgICBQb2ludCxcbiAgICBTZXJpZXMsXG4gICAgU2VyaWVzUGllT3B0aW9ucyxcbiAgICBWZXJ0aWNhbEFsaWduVmFsdWVcbn0gZnJvbSAnaGlnaGNoYXJ0cyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYXN3LWJhci1jb2x1bW4nLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9iYXItY29sdW1uLmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2Jhci1jb2x1bW4uc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIEFzd0JhckNvbHVtbiBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgICBwcml2YXRlIGNsb25lQ29uZmlndXJhdGlvbiE6IE9wdGlvbnM7XG4gICAgcHVibGljIGRldmljZVNpemU6IEdyaWRPcHRpb25zRW51bSA9IEdyaWRPcHRpb25zRW51bS5MYXJnZTtcbiAgICBwcml2YXRlIHZpZXdJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIEBJbnB1dCgpIGNvbmZpZyE6IE9wdGlvbnM7XG4gICAgQElucHV0KCkgaXNMZWdlbmRTb3J0ID0gdHJ1ZTtcbiAgICBASW5wdXQoKSBpY29uITogc3RyaW5nO1xuICAgIEBJbnB1dCgpIGxhYmVsOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgQElucHV0KCkgYW1vdW50OiBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkO1xuICAgIEBJbnB1dCgpIHRhcmdldCE6IHN0cmluZztcbiAgICBASW5wdXQoKSBjdXJyZW5jeUNvZGU6IEN1cnJlbmN5Q29kZUVudW0gPSBDdXJyZW5jeUNvZGVFbnVtLkJsYW5rO1xuICAgIEBJbnB1dCgpIGxlZ2VuZFBvc2l0aW9uOiBMZWdlbmRQb3NpdGlvbkVudW0gPSBMZWdlbmRQb3NpdGlvbkVudW0uUmlnaHQ7XG4gICAgQElucHV0KCkgbGVnZW5kVHlwZTogQ2hhcnRMZWdlbmRUeXBlRW51bSA9IENoYXJ0TGVnZW5kVHlwZUVudW0uQm90aDtcbiAgICBASW5wdXQoKSBsZWdlbmRXaWR0aFB4ID0gMjUwO1xuICAgIEBJbnB1dCgpIGxlZ2VuZExheW91dDogTGVnZW5kTGF5b3V0RW51bSA9IExlZ2VuZExheW91dEVudW0uVmVydGljYWw7XG5cbiAgICBAT3V0cHV0KCkgYmFyQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgICBAVmlld0NoaWxkKCdiYXJDb2x1bW5DaGFydCcsIHsgc3RhdGljOiB0cnVlIH0pIGJhckNvbHVtbkNoYXJ0ITogRWxlbWVudFJlZjtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBwZXJjZW50UGlwZTogUGVyY2VudFBpcGUsXG4gICAgICAgIHByaXZhdGUgY3VycmVuY3lQaXBlOiBDdXJyZW5jeVBpcGUsXG4gICAgICAgIHByaXZhdGUgYXN3Q3VycmVuY3lQaXBlOiBBc3dDdXJyZW5jeVBpcGUpIHsgfVxuXG4gICAgbmdPbkNoYW5nZXMoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy52aWV3SW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRpYWxpemVDaGFydCgpO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52aWV3SW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVDaGFydCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVDaGFydCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnKSB7XG4gICAgICAgICAgICB0aGlzLmNsb25lQ29uZmlndXJhdGlvbiA9IHRoaXMuY29uZmlnO1xuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyV2lkdGggPSB0aGlzLmJhckNvbHVtbkNoYXJ0Lm5hdGl2ZUVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB0aGlzLmRldmljZVNpemUgPSBPYmplY3RVdGlscy5maW5kRGV2aWNlU2l6ZShjb250YWluZXJXaWR0aCk7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNoYXJ0Q3JlZGl0KCk7XG4gICAgICAgICAgICB0aGlzLnNldEJhckNoYXJ0VG9vbHRpcCgpO1xuICAgICAgICAgICAgY29uc3Qgc2VyaWVzOiBTZXJpZXNQaWVPcHRpb25zW10gPSB0aGlzLmNsb25lQ29uZmlndXJhdGlvbi5zZXJpZXMgYXMgU2VyaWVzUGllT3B0aW9uc1tdO1xuICAgICAgICAgICAgaWYgKHRoaXMubGVnZW5kTGF5b3V0ID09PSBMZWdlbmRMYXlvdXRFbnVtLlZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRCYXJDaGFydExlZ2VuZE9wdGlvbih0aGlzLmxlZ2VuZFdpZHRoUHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbGlja09uQmFyKCk7XG4gICAgICAgICAgICBIaWdoY2hhcnRzLmNoYXJ0KHRoaXMuYmFyQ29sdW1uQ2hhcnQubmF0aXZlRWxlbWVudCwgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gICAgb25SZXNpemUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVDaGFydENyZWRpdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24uY3JlZGl0cyA9IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRCYXJDaGFydFRvb2x0aXAoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHRoaXMkOiB0aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24udG9vbHRpcCA9IHtcbiAgICAgICAgICAgIHVzZUhUTUw6IHRydWUsXG4gICAgICAgICAgICBzcGxpdDogZmFsc2UsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IEFzd0NoYXJ0Q29uc3RhbnRzLmJsYWNrQ29sb3IsXG4gICAgICAgICAgICBib3JkZXJDb2xvcjogQXN3Q2hhcnRDb25zdGFudHMuYmxhY2tDb2xvcixcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgY29sb3I6IEFzd0NoYXJ0Q29uc3RhbnRzLndoaXRlQ29sb3IsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFdlaWdodFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogMCxcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBmb3JtYXR0ZXIoKTogc3RyaW5nIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtZW5kIHRleHQtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPiR7dGhpcy5wb2ludC5jYXRlZ29yeX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LWVuZCB0ZXh0LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJjb2xvcjogJHt0aGlzLnBvaW50LmNvbG9yfVwiPlxcdTI1QTA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz4ke3RoaXMucG9pbnQuc2VyaWVzLm5hbWV9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC1lbmQgdGV4dC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcyQuY3VycmVuY3lDb2RlID8gdGhpcyQuY3VycmVuY3lQaXBlLnRyYW5zZm9ybSh0aGlzLnBvaW50Lm9wdGlvbnMueSwgdGhpcyQuY3VycmVuY3lDb2RlKSA6IHRoaXMucG9pbnQub3B0aW9ucy55fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGlja09uQmFyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsb25lQ29uZmlndXJhdGlvbi5wbG90T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHNlcmllczoge1xuICAgICAgICAgICAgICAgIGRhdGFMYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHBvaW50OiB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6ICgoZXZlbnQ6IFBvaW50Q2xpY2tFdmVudE9iamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50Q2xpY2tFdmVudDogQ2hhcnRQb2ludGVyRXZlbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGV2ZW50LnBvaW50LnNlcmllcy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogZXZlbnQucG9pbnQuaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBldmVudC5wb2ludC5vcHRpb25zLnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBldmVudC5wb2ludC5jYXRlZ29yeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iYXJDbGljay5lbWl0KHBvaW50Q2xpY2tFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0RG9udXRDaGFydFNlcmllc09wdGlvbnMoc2VyaWVzOiBTZXJpZXNQaWVPcHRpb25zW10pOiB2b2lkIHtcbiAgICAgICAgc2VyaWVzLmZvckVhY2goKHNlcmllc09wdGlvbjogU2VyaWVzUGllT3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgc2VyaWVzT3B0aW9uLmFsbG93UG9pbnRTZWxlY3QgPSB0cnVlO1xuICAgICAgICAgICAgc2VyaWVzT3B0aW9uLnNob3dJbkxlZ2VuZCA9IHRydWU7XG4gICAgICAgICAgICAvLyBpZiAodGhpcy5jaGFydFR5cGUgPT09IENoYXJ0VHlwZUVudW0uRG9udXQpIHtcbiAgICAgICAgICAgIC8vICAgICBzZXJpZXNPcHRpb24uaW5uZXJTaXplID0gQXN3Q2hhcnRDb25zdGFudHMuaW5uZXJTaXplO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gaWYgKHRoaXMuaXNNdXRlKSB7XG4gICAgICAgICAgICAvLyAgICAgc2VyaWVzT3B0aW9uLm9wYWNpdHkgPSAwLjM1O1xuICAgICAgICAgICAgLy8gICAgIHNlcmllc09wdGlvbi5zdGF0ZXMgPSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgICAgICAgLy8gICAgICAgICB9LFxuICAgICAgICAgICAgLy8gICAgICAgICBpbmFjdGl2ZToge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH07XG4gICAgICAgICAgICAvLyAgICAgc2VyaWVzT3B0aW9uLnNsaWNlZE9mZnNldCA9IDA7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBzZXJpZXNPcHRpb24uY3Vyc29yID0gQXN3Q2hhcnRDb25zdGFudHMucG9pbnRlcjtcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IFBvaW50T3B0aW9uc09iamVjdFtdID0gc2VyaWVzT3B0aW9uLmRhdGEgYXMgUG9pbnRPcHRpb25zT2JqZWN0W107XG4gICAgICAgICAgICB0aGlzLmhhbmRsZU5lZ2F0aXZlU2VyaWVzRGF0YShkYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IHNvcnRlZFNlcmllc09wdGlvbkRhdGE6IFBvaW50T3B0aW9uc09iamVjdFtdID0gdGhpcy5pc0xlZ2VuZFNvcnQgPyB0aGlzLnNvcnRTZXJpZXNEYXRhKGRhdGEpIDogZGF0YTtcbiAgICAgICAgICAgIHNlcmllc09wdGlvbi5kYXRhID0gc29ydGVkU2VyaWVzT3B0aW9uRGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzb3J0U2VyaWVzRGF0YShkYXRhOiBQb2ludE9wdGlvbnNPYmplY3RbXSk6IFBvaW50T3B0aW9uc09iamVjdFtdIHtcbiAgICAgICAgaWYgKHRoaXMubGVnZW5kVHlwZSA9PT0gQ2hhcnRMZWdlbmRUeXBlRW51bS5EZWZhdWx0KSB7XG4gICAgICAgICAgICBkYXRhLnNvcnQoKGE6IGFueSwgYjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgnJyArIGEubmFtZSkubG9jYWxlQ29tcGFyZShiLm5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEuc29ydCgoYTogYW55LCBiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYS55ICYmIGIueSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS52YWx1ZSAtIGIudmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkYXRhLnJldmVyc2UoKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVOZWdhdGl2ZVNlcmllc0RhdGEoZGF0YTogUG9pbnRPcHRpb25zT2JqZWN0W10pOiB2b2lkIHtcbiAgICAgICAgZGF0YS5mb3JFYWNoKChlbGVtZW50OiBQb2ludE9wdGlvbnNPYmplY3QpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSBlbGVtZW50Lnk7XG4gICAgICAgICAgICBlbGVtZW50LnkgPSBlbGVtZW50LnkgPyBNYXRoLmFicyhlbGVtZW50LnkpIDogMC4wMDE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0Rm9udFNpemUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGwgPyBBc3dDaGFydENvbnN0YW50cy5mb250U2l6ZTE0IDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFNpemUxNjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldEJhckNoYXJ0TGVnZW5kT3B0aW9uKGxlZ2VuZFdpZHRoUHg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCB0aGlzJDogdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2xvbmVDb25maWd1cmF0aW9uLmxlZ2VuZCA9IHtcbiAgICAgICAgICAgIHVzZUhUTUw6IHRydWUsXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgZmxvYXRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgYWxpZ246IHRoaXMuc2V0TGVnZW5kQWxpZ25tZW50KCksXG4gICAgICAgICAgICBsYXlvdXQ6ICd2ZXJ0aWNhbCcsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnNldExlZ2VuZFZlcnRpY2FsQWxpZ25tZW50KCksXG4gICAgICAgICAgICBzeW1ib2xIZWlnaHQ6IDEwLFxuICAgICAgICAgICAgc3ltYm9sV2lkdGg6IDEwLFxuICAgICAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxuICAgICAgICAgICAgaXRlbU1hcmdpblRvcDogMywgLy8gU3BhY2UgYmV0d2VlbiBlYWNoIGNhdGVnb3J5IGluIHRoZSBsZWdlbmRcbiAgICAgICAgICAgIGl0ZW1NYXJnaW5Cb3R0b206IDMsXG4gICAgICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcy5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCA/ICcxMnB4JyA6ICcxNHB4JyxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2lkdGg6IGxlZ2VuZFdpZHRoUHggKyAxNSxcbiAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgdGV4dDogdGhpcyQuc2V0TGluZUNoYXJ0TGVnZW5kV2l0aEhlYWRlcihsZWdlbmRXaWR0aFB4ICsgMTUpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICA/IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRTaXplMTIgOiBBc3dDaGFydENvbnN0YW50cy5mb250U2l6ZTE0LFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM2Yzc1N2QnLFxuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnNTAwIDE0cHgvMjBweCBHb29nbGUgU2FucyBUZXh0LEFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsYWJlbEZvcm1hdHRlcigpOiBzdHJpbmcge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50OiBhbnkgPSB0aGlzIGFzIFBvaW50O1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcG9pbnQueURhdGEucmVkdWNlKChhY2M6IGFueSwgY3VyOiBhbnkpID0+IGFjYyArIGN1ciwgMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMkLnNldExpbmVDaGFydExlZ2VuZFdpdGhIZWFkZXIoXG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZFdpZHRoUHgsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldExlZ2VuZEFsaWdubWVudCgpOiBBbGlnblZhbHVlIHtcbiAgICAgICAgaWYgKHRoaXMuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGwpIHtcbiAgICAgICAgICAgIHJldHVybiAnY2VudGVyJztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSBMZWdlbmRQb3NpdGlvbkVudW0uUmlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBMZWdlbmRQb3NpdGlvbkVudW0uUmlnaHQ7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5sZWdlbmRQb3NpdGlvbiA9PT0gTGVnZW5kUG9zaXRpb25FbnVtLkxlZnQpIHtcbiAgICAgICAgICAgIHJldHVybiBMZWdlbmRQb3NpdGlvbkVudW0uTGVmdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnY2VudGVyJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0TGVnZW5kVmVydGljYWxBbGlnbm1lbnQoKTogVmVydGljYWxBbGlnblZhbHVlIHtcbiAgICAgICAgaWYgKHRoaXMuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGwpIHtcbiAgICAgICAgICAgIHJldHVybiBMZWdlbmRQb3NpdGlvbkVudW0uQm90dG9tO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubGVnZW5kUG9zaXRpb24gPT09IExlZ2VuZFBvc2l0aW9uRW51bS5SaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuICdtaWRkbGUnO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubGVnZW5kUG9zaXRpb24gPT09IExlZ2VuZFBvc2l0aW9uRW51bS5MZWZ0KSB7XG4gICAgICAgICAgICByZXR1cm4gJ21pZGRsZSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTGVnZW5kUG9zaXRpb25FbnVtLkJvdHRvbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0TGluZUNoYXJ0TGVnZW5kV2l0aEhlYWRlcihcbiAgICAgICAgbGVnZW5kV2lkdGhQeDogbnVtYmVyLFxuICAgICAgICBuYW1lPzogc3RyaW5nIHwgbnVsbCxcbiAgICAgICAgdmFsdWU/OiBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGxlZ2VuZENhdGVnb3J5V2lkdGhQeDogbnVtYmVyO1xuICAgICAgICBsZXQgbGVnZW5kVmFsdWVXaWR0aFB4OiBudW1iZXI7XG4gICAgICAgIGlmICh0aGlzLmxlZ2VuZFR5cGUgPT09IENoYXJ0TGVnZW5kVHlwZUVudW0uRGVmYXVsdCkge1xuICAgICAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6JHtsZWdlbmRXaWR0aFB4fXB4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgY29sLXNtLTEyIGNvbC0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7bmFtZSA/IG5hbWUgOiAnQ2F0ZWdvcnknfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZWdlbmRDYXRlZ29yeVdpZHRoUHggPSBsZWdlbmRXaWR0aFB4ICogMC41O1xuICAgICAgICAgICAgbGVnZW5kVmFsdWVXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuNTtcbiAgICAgICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiR7bGVnZW5kQ2F0ZWdvcnlXaWR0aFB4ICsgbGVnZW5kVmFsdWVXaWR0aFB4fXB4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNiBjb2wtc20tNiBjb2wtNlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7bmFtZSA/IG5hbWUgOiAnQ2F0ZWdvcnknfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTYgY29sLXNtLTYgY29sLTYgdGV4dC1lbmQgdGV4dC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dmFsdWUgPyB0aGlzLmN1cnJlbmN5UGlwZS50cmFuc2Zvcm0odmFsdWUsIHRoaXMuY3VycmVuY3lDb2RlLCAnc3ltYm9sJywgJy4yJykgOiAnVG90YWwnfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCI8ZGl2ICNiYXJDb2x1bW5DaGFydD48L2Rpdj4iXX0=