import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { AswChartConstants, ChartLegendTypeEnum, CurrencyCodeEnum, GridOptionsEnum, LegendLayoutEnum, LegendPositionEnum, } from '@asoftwareworld/charts/core';
import { ObjectUtils } from '@asoftwareworld/charts/utils';
import * as Highcharts from 'highcharts';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@asoftwareworld/charts/core";
export class AswLine {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9jb21wb25lbnQvbGluZS9jb21wb25lbnQvbGluZS50cyIsIi4uLy4uLy4uLy4uL2FwcC9jb21wb25lbnQvbGluZS9jb21wb25lbnQvbGluZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFFSCxTQUFTLEVBRVQsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0gsaUJBQWlCLEVBRWpCLG1CQUFtQixFQUVuQixnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixrQkFBa0IsR0FDckIsTUFBTSw2QkFBNkIsQ0FBQztBQUNyQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDM0QsT0FBTyxLQUFLLFVBQVUsTUFBTSxZQUFZLENBQUM7Ozs7QUFpQnpDLE1BQU0sT0FBTyxPQUFPO0lBaUJoQixZQUNZLFlBQTBCLEVBQzFCLGVBQWdDO1FBRGhDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQWhCckMsZUFBVSxHQUFvQixlQUFlLENBQUMsS0FBSyxDQUFDO1FBQ25ELG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBRXZCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLG9CQUFlLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLGlCQUFZLEdBQXFCLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztRQUN0RCxtQkFBYyxHQUF1QixrQkFBa0IsQ0FBQyxLQUFLLENBQUM7UUFDOUQsZUFBVSxHQUF3QixtQkFBbUIsQ0FBQyxJQUFJLENBQUM7UUFDM0Qsa0JBQWEsR0FBRyxHQUFHLENBQUM7UUFDcEIsaUJBQVksR0FBcUIsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO1FBRTFELG1CQUFjLEdBQXNCLElBQUks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LFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTzs7O3VCQUc5RixDQUFDO1NBQ2Y7SUFDTCxDQUFDOztvR0FwUFEsT0FBTzt3RkFBUCxPQUFPLDBoQkN4Q3BCLHdCQUFzQjsyRkR3Q1QsT0FBTztrQkFMbkIsU0FBUzsrQkFDSSxVQUFVO2lJQVNYLE1BQU07c0JBQWQsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBQ0csWUFBWTtzQkFBcEIsS0FBSztnQkFDRyxjQUFjO3NCQUF0QixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVJLGNBQWM7c0JBQXZCLE1BQU07Z0JBRW1DLFNBQVM7c0JBQWxELFNBQVM7dUJBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFtQ3hDLFFBQVE7c0JBRFAsWUFBWTt1QkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ3VycmVuY3lQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBDb21wb25lbnQsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIElucHV0LFxuICAgIE9uQ2hhbmdlcyxcbiAgICBPdXRwdXQsXG4gICAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgICBBc3dDaGFydENvbnN0YW50cyxcbiAgICBBc3dDdXJyZW5jeVBpcGUsXG4gICAgQ2hhcnRMZWdlbmRUeXBlRW51bSxcbiAgICBDaGFydFBvaW50ZXJFdmVudCxcbiAgICBDdXJyZW5jeUNvZGVFbnVtLFxuICAgIEdyaWRPcHRpb25zRW51bSxcbiAgICBMZWdlbmRMYXlvdXRFbnVtLFxuICAgIExlZ2VuZFBvc2l0aW9uRW51bSxcbn0gZnJvbSAnQGFzb2Z0d2FyZXdvcmxkL2NoYXJ0cy9jb3JlJztcbmltcG9ydCB7IE9iamVjdFV0aWxzIH0gZnJvbSAnQGFzb2Z0d2FyZXdvcmxkL2NoYXJ0cy91dGlscyc7XG5pbXBvcnQgKiBhcyBIaWdoY2hhcnRzIGZyb20gJ2hpZ2hjaGFydHMnO1xuaW1wb3J0IHtcbiAgICBBbGlnblZhbHVlLFxuICAgIE9wdGlvbnMsXG4gICAgUG9pbnRDbGlja0V2ZW50T2JqZWN0LFxuICAgIFBvaW50T3B0aW9uc09iamVjdCxcbiAgICBQb2ludCxcbiAgICBTZXJpZXMsXG4gICAgU2VyaWVzUGllT3B0aW9ucyxcbiAgICBWZXJ0aWNhbEFsaWduVmFsdWVcbn0gZnJvbSAnaGlnaGNoYXJ0cyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYXN3LWxpbmUnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9saW5lLmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2xpbmUuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIEFzd0xpbmUgaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuXG4gICAgcHJpdmF0ZSBjbG9uZUNvbmZpZ3VyYXRpb24hOiBPcHRpb25zO1xuICAgIHB1YmxpYyBkZXZpY2VTaXplOiBHcmlkT3B0aW9uc0VudW0gPSBHcmlkT3B0aW9uc0VudW0uTGFyZ2U7XG4gICAgcHJpdmF0ZSB2aWV3SW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICBASW5wdXQoKSBjb25maWchOiBPcHRpb25zO1xuICAgIEBJbnB1dCgpIGlzTGVnZW5kU29ydCA9IHRydWU7XG4gICAgQElucHV0KCkgaXNMZWdlbmREaXNwbGF5ID0gdHJ1ZTtcbiAgICBASW5wdXQoKSBjdXJyZW5jeUNvZGU6IEN1cnJlbmN5Q29kZUVudW0gPSBDdXJyZW5jeUNvZGVFbnVtLklOUjtcbiAgICBASW5wdXQoKSBsZWdlbmRQb3NpdGlvbjogTGVnZW5kUG9zaXRpb25FbnVtID0gTGVnZW5kUG9zaXRpb25FbnVtLlJpZ2h0O1xuICAgIEBJbnB1dCgpIGxlZ2VuZFR5cGU6IENoYXJ0TGVnZW5kVHlwZUVudW0gPSBDaGFydExlZ2VuZFR5cGVFbnVtLkJvdGg7XG4gICAgQElucHV0KCkgbGVnZW5kV2lkdGhQeCA9IDI1MDtcbiAgICBASW5wdXQoKSBsZWdlbmRMYXlvdXQ6IExlZ2VuZExheW91dEVudW0gPSBMZWdlbmRMYXlvdXRFbnVtLlZlcnRpY2FsO1xuXG4gICAgQE91dHB1dCgpIGxpbmVQb2ludENsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gICAgQFZpZXdDaGlsZCgnbGluZUNoYXJ0JywgeyBzdGF0aWM6IHRydWUgfSkgbGluZUNoYXJ0ITogRWxlbWVudFJlZjtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBjdXJyZW5jeVBpcGU6IEN1cnJlbmN5UGlwZSxcbiAgICAgICAgcHJpdmF0ZSBhc3dDdXJyZW5jeVBpcGU6IEFzd0N1cnJlbmN5UGlwZSkgeyB9XG5cbiAgICBuZ09uQ2hhbmdlcygpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnZpZXdJbml0aWFsaXplZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnZpZXdJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNoYXJ0KCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZUNoYXJ0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5jb25maWcpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvbmVDb25maWd1cmF0aW9uID0gdGhpcy5jb25maWc7XG4gICAgICAgICAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IHRoaXMubGluZUNoYXJ0Lm5hdGl2ZUVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICB0aGlzLmRldmljZVNpemUgPSBPYmplY3RVdGlscy5maW5kRGV2aWNlU2l6ZShjb250YWluZXJXaWR0aCk7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNoYXJ0Q3JlZGl0KCk7XG4gICAgICAgICAgICB0aGlzLnNldExpbmVDaGFydFRvb2x0aXAoKTtcbiAgICAgICAgICAgIGNvbnN0IHNlcmllczogU2VyaWVzUGllT3B0aW9uc1tdID0gdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24uc2VyaWVzIGFzIFNlcmllc1BpZU9wdGlvbnNbXTtcbiAgICAgICAgICAgIHRoaXMuc2V0TGluZUNoYXJ0U2VyaWVzT3B0aW9ucyhzZXJpZXMpO1xuICAgICAgICAgICAgaWYgKHRoaXMubGVnZW5kTGF5b3V0ID09PSBMZWdlbmRMYXlvdXRFbnVtLlZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMaW5lQ2hhcnRMZWdlbmRPcHRpb24odGhpcy5sZWdlbmRXaWR0aFB4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2xpY2tPbkxpbmVQb2ludCgpO1xuICAgICAgICAgICAgSGlnaGNoYXJ0cy5jaGFydCh0aGlzLmxpbmVDaGFydC5uYXRpdmVFbGVtZW50LCB0aGlzLmNsb25lQ29uZmlndXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJylcbiAgICBvblJlc2l6ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2hhcnQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZUNoYXJ0Q3JlZGl0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsb25lQ29uZmlndXJhdGlvbi5jcmVkaXRzID0ge1xuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldExpbmVDaGFydFRvb2x0aXAoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHRoaXMkOiB0aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24udG9vbHRpcCA9IHtcbiAgICAgICAgICAgIHVzZUhUTUw6IHRydWUsXG4gICAgICAgICAgICBzcGxpdDogZmFsc2UsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IEFzd0NoYXJ0Q29uc3RhbnRzLmJsYWNrQ29sb3IsXG4gICAgICAgICAgICBib3JkZXJDb2xvcjogQXN3Q2hhcnRDb25zdGFudHMuYmxhY2tDb2xvcixcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgY29sb3I6IEFzd0NoYXJ0Q29uc3RhbnRzLndoaXRlQ29sb3IsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogQXN3Q2hhcnRDb25zdGFudHMuZm9udFdlaWdodFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogMCxcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBmb3JtYXR0ZXIoKTogc3RyaW5nIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIHRleHQtZW5kIHRleHQtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Ryb25nPiR7dGhpcy5wb2ludC5jYXRlZ29yeX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiB0ZXh0LWVuZCB0ZXh0LXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJjb2xvcjogJHt0aGlzLnBvaW50LmNvbG9yfVwiPlxcdTI1QTA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN0cm9uZz4ke3RoaXMucG9pbnQuc2VyaWVzLm5hbWV9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgdGV4dC1lbmQgdGV4dC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGhpcyQuY3VycmVuY3lQaXBlLnRyYW5zZm9ybSh0aGlzLnBvaW50Lm9wdGlvbnMueSwgdGhpcyQuY3VycmVuY3lDb2RlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xpY2tPbkxpbmVQb2ludCgpOiB2b2lkIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW5vbi1udWxsLWFzc2VydGlvblxuICAgICAgICB0aGlzLmNsb25lQ29uZmlndXJhdGlvbi5wbG90T3B0aW9ucyEubGluZSA9IHtcbiAgICAgICAgICAgIHBvaW50OiB7XG4gICAgICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWNrOiAoKGV2ZW50OiBQb2ludENsaWNrRXZlbnRPYmplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50Q2xpY2tFdmVudDogQ2hhcnRQb2ludGVyRXZlbnQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZXZlbnQucG9pbnQuc2VyaWVzLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGV2ZW50LnBvaW50LmluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBldmVudC5wb2ludC5vcHRpb25zLnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IGV2ZW50LnBvaW50LmNhdGVnb3J5XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lUG9pbnRDbGljay5lbWl0KHBvaW50Q2xpY2tFdmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0TGluZUNoYXJ0U2VyaWVzT3B0aW9ucyhzZXJpZXM6IFNlcmllc1BpZU9wdGlvbnNbXSk6IHZvaWQge1xuICAgICAgICBzZXJpZXMuZm9yRWFjaCgoc2VyaWVzT3B0aW9uOiBTZXJpZXNQaWVPcHRpb25zKSA9PiB7XG4gICAgICAgICAgICBzZXJpZXNPcHRpb24uYWxsb3dQb2ludFNlbGVjdCA9IHRydWU7XG4gICAgICAgICAgICBzZXJpZXNPcHRpb24uc2hvd0luTGVnZW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlcmllc09wdGlvbi5jdXJzb3IgPSBBc3dDaGFydENvbnN0YW50cy5wb2ludGVyO1xuICAgICAgICAgICAgY29uc3QgZGF0YTogUG9pbnRPcHRpb25zT2JqZWN0W10gPSBzZXJpZXNPcHRpb24uZGF0YSBhcyBQb2ludE9wdGlvbnNPYmplY3RbXTtcbiAgICAgICAgICAgIC8vIHRoaXMuaGFuZGxlTmVnYXRpdmVTZXJpZXNEYXRhKGRhdGEpO1xuICAgICAgICAgICAgLy8gY29uc3Qgc29ydGVkU2VyaWVzT3B0aW9uRGF0YTogUG9pbnRPcHRpb25zT2JqZWN0W10gPSB0aGlzLmlzTGVnZW5kU29ydCA/IHRoaXMuc29ydFNlcmllc0RhdGEoZGF0YSkgOiBkYXRhO1xuICAgICAgICAgICAgLy8gc2VyaWVzT3B0aW9uLmRhdGEgPSBzb3J0ZWRTZXJpZXNPcHRpb25EYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNvcnRTZXJpZXNEYXRhKGRhdGE6IFBvaW50T3B0aW9uc09iamVjdFtdKTogUG9pbnRPcHRpb25zT2JqZWN0W10ge1xuICAgICAgICBpZiAodGhpcy5sZWdlbmRUeXBlID09PSBDaGFydExlZ2VuZFR5cGVFbnVtLkRlZmF1bHQpIHtcbiAgICAgICAgICAgIGRhdGEuc29ydCgoYTogYW55LCBiOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCcnICsgYS5uYW1lKS5sb2NhbGVDb21wYXJlKGIubmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5zb3J0KChhOiBhbnksIGI6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChhLnkgJiYgYi55KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLnZhbHVlIC0gYi52YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRhdGEucmV2ZXJzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZU5lZ2F0aXZlU2VyaWVzRGF0YShkYXRhOiBQb2ludE9wdGlvbnNPYmplY3RbXSk6IHZvaWQge1xuICAgICAgICBkYXRhLmZvckVhY2goKGVsZW1lbnQ6IFBvaW50T3B0aW9uc09iamVjdCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IGVsZW1lbnQueTtcbiAgICAgICAgICAgIGVsZW1lbnQueSA9IGVsZW1lbnQueSA/IE1hdGguYWJzKGVsZW1lbnQueSkgOiAwLjAwMTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRMaW5lQ2hhcnRMZWdlbmRPcHRpb24obGVnZW5kV2lkdGhQeDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHRoaXMkOiB0aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jbG9uZUNvbmZpZ3VyYXRpb24ubGVnZW5kID0ge1xuICAgICAgICAgICAgdXNlSFRNTDogdHJ1ZSxcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRoaXMuaXNMZWdlbmREaXNwbGF5LFxuICAgICAgICAgICAgZmxvYXRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgYWxpZ246IHRoaXMuc2V0TGVnZW5kQWxpZ25tZW50KCksXG4gICAgICAgICAgICBsYXlvdXQ6ICd2ZXJ0aWNhbCcsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnNldExlZ2VuZFZlcnRpY2FsQWxpZ25tZW50KCksXG4gICAgICAgICAgICBzeW1ib2xIZWlnaHQ6IDEwLFxuICAgICAgICAgICAgc3ltYm9sV2lkdGg6IDEwLFxuICAgICAgICAgICAgc3ltYm9sUmFkaXVzOiAwLFxuICAgICAgICAgICAgaXRlbU1hcmdpblRvcDogMywgLy8gU3BhY2UgYmV0d2VlbiBlYWNoIGNhdGVnb3J5IGluIHRoZSBsZWdlbmRcbiAgICAgICAgICAgIGl0ZW1NYXJnaW5Cb3R0b206IDMsXG4gICAgICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogdGhpcy5kZXZpY2VTaXplID09PSBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbCA/ICcxMnB4JyA6ICcxNHB4JyxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2lkdGg6IGxlZ2VuZFdpZHRoUHggKyAxNSxcbiAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgdGV4dDogdGhpcyQuc2V0TGluZUNoYXJ0TGVnZW5kV2l0aEhlYWRlcihsZWdlbmRXaWR0aFB4ICsgMTUpLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiB0aGlzLmRldmljZVNpemUgPT09IEdyaWRPcHRpb25zRW51bS5FeHRyYVNtYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICA/IEFzd0NoYXJ0Q29uc3RhbnRzLmZvbnRTaXplMTIgOiBBc3dDaGFydENvbnN0YW50cy5mb250U2l6ZTE0LFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM2Yzc1N2QnLFxuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBBc3dDaGFydENvbnN0YW50cy5mb250V2VpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnNTAwIDE0cHgvMjBweCBHb29nbGUgU2FucyBUZXh0LEFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsYWJlbEZvcm1hdHRlcigpOiBzdHJpbmcge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50OiBhbnkgPSB0aGlzIGFzIFBvaW50O1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcG9pbnQueURhdGEucmVkdWNlKChhY2M6IGFueSwgY3VyOiBhbnkpID0+IGFjYyArIGN1ciwgMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMkLnNldExpbmVDaGFydExlZ2VuZFdpdGhIZWFkZXIoXG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZFdpZHRoUHgsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldExlZ2VuZEFsaWdubWVudCgpOiBBbGlnblZhbHVlIHtcbiAgICAgICAgaWYgKHRoaXMuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGwpIHtcbiAgICAgICAgICAgIHJldHVybiAnY2VudGVyJztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxlZ2VuZFBvc2l0aW9uID09PSBMZWdlbmRQb3NpdGlvbkVudW0uUmlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBMZWdlbmRQb3NpdGlvbkVudW0uUmlnaHQ7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5sZWdlbmRQb3NpdGlvbiA9PT0gTGVnZW5kUG9zaXRpb25FbnVtLkxlZnQpIHtcbiAgICAgICAgICAgIHJldHVybiBMZWdlbmRQb3NpdGlvbkVudW0uTGVmdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAnY2VudGVyJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0TGVnZW5kVmVydGljYWxBbGlnbm1lbnQoKTogVmVydGljYWxBbGlnblZhbHVlIHtcbiAgICAgICAgaWYgKHRoaXMuZGV2aWNlU2l6ZSA9PT0gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGwpIHtcbiAgICAgICAgICAgIHJldHVybiBMZWdlbmRQb3NpdGlvbkVudW0uQm90dG9tO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubGVnZW5kUG9zaXRpb24gPT09IExlZ2VuZFBvc2l0aW9uRW51bS5SaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuICdtaWRkbGUnO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubGVnZW5kUG9zaXRpb24gPT09IExlZ2VuZFBvc2l0aW9uRW51bS5MZWZ0KSB7XG4gICAgICAgICAgICByZXR1cm4gJ21pZGRsZSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTGVnZW5kUG9zaXRpb25FbnVtLkJvdHRvbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2V0TGluZUNoYXJ0TGVnZW5kV2l0aEhlYWRlcihcbiAgICAgICAgbGVnZW5kV2lkdGhQeDogbnVtYmVyLFxuICAgICAgICBuYW1lPzogc3RyaW5nIHwgbnVsbCxcbiAgICAgICAgdmFsdWU/OiBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGxlZ2VuZENhdGVnb3J5V2lkdGhQeDogbnVtYmVyO1xuICAgICAgICBsZXQgbGVnZW5kVmFsdWVXaWR0aFB4OiBudW1iZXI7XG4gICAgICAgIGlmICh0aGlzLmxlZ2VuZFR5cGUgPT09IENoYXJ0TGVnZW5kVHlwZUVudW0uRGVmYXVsdCkge1xuICAgICAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6JHtsZWdlbmRXaWR0aFB4fXB4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgY29sLXNtLTEyIGNvbC0xMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7bmFtZSA/IG5hbWUgOiAnQ2F0ZWdvcnknfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZWdlbmRDYXRlZ29yeVdpZHRoUHggPSBsZWdlbmRXaWR0aFB4ICogMC41O1xuICAgICAgICAgICAgbGVnZW5kVmFsdWVXaWR0aFB4ID0gbGVnZW5kV2lkdGhQeCAqIDAuNTtcbiAgICAgICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiR7bGVnZW5kQ2F0ZWdvcnlXaWR0aFB4ICsgbGVnZW5kVmFsdWVXaWR0aFB4fXB4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNiBjb2wtc20tNiBjb2wtNlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7bmFtZSA/IG5hbWUgOiAnQ2F0ZWdvcnknfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTYgY29sLXNtLTYgY29sLTYgdGV4dC1lbmQgdGV4dC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dmFsdWUgPyB0aGlzLmN1cnJlbmN5UGlwZS50cmFuc2Zvcm0odmFsdWUsIHRoaXMuY3VycmVuY3lDb2RlLCAnc3ltYm9sJywgJy4yJykgOiAnVG90YWwnfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PmA7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCI8ZGl2ICNsaW5lQ2hhcnQ+PC9kaXY+Il19