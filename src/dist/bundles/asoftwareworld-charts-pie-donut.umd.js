(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@asoftwareworld/charts/core'), require('@asoftwareworld/charts/utils'), require('highcharts')) :
    typeof define === 'function' && define.amd ? define('@asoftwareworld/charts/pie-donut', ['exports', '@angular/common', '@angular/core', '@asoftwareworld/charts/core', '@asoftwareworld/charts/utils', 'highcharts'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.asoftwareworld = global.asoftwareworld || {}, global.asoftwareworld.charts = global.asoftwareworld.charts || {}, global.asoftwareworld.charts['pie-donut'] = {}), global.ng.common, global.ng.core, global.asoftwareworld.charts.core, global.asoftwareworld.charts.utils, global.Highcharts));
}(this, (function (exports, common, core$1, core, utils, Highcharts) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var Highcharts__namespace = /*#__PURE__*/_interopNamespace(Highcharts);

    /**
     * @license
     * Copyright ASW (A Software World) All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file
     */
    var ChartTypeEnum;
    (function (ChartTypeEnum) {
        ChartTypeEnum["Pie"] = "pie";
        ChartTypeEnum["Donut"] = "donut";
    })(ChartTypeEnum || (ChartTypeEnum = {}));

    /**
     * @license
     * Copyright ASW (A Software World) All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file
     */
    var AswPieDonut = /** @class */ (function () {
        function AswPieDonut(percentPipe, currencyPipe, aswCurrencyPipe) {
            this.percentPipe = percentPipe;
            this.currencyPipe = currencyPipe;
            this.aswCurrencyPipe = aswCurrencyPipe;
            this.deviceSize = core.GridOptionsEnum.Large;
            this.viewInitialized = false;
            this.isLegendSort = true;
            this.isMute = false;
            this.isLegendDisplay = true;
            this.chartType = ChartTypeEnum.Donut;
            this.currencyCode = core.CurrencyCodeEnum.INR;
            this.legendPosition = core.LegendPositionEnum.Right;
            this.legendType = core.LegendTypeEnum.Both;
            this.legendWidthPx = 250;
            this.legendLayout = core.LegendLayoutEnum.Vertical;
            this.donutSliceClick = new core$1.EventEmitter();
        }
        AswPieDonut.prototype.ngOnChanges = function () {
            if (!this.viewInitialized) {
                return;
            }
            this.initializeChart();
        };
        AswPieDonut.prototype.ngAfterViewInit = function () {
            this.viewInitialized = true;
            this.initializeChart();
        };
        AswPieDonut.prototype.initializeChart = function () {
            if (this.config) {
                this.cloneConfiguration = this.config;
                var containerWidth = this.pieDonutChart.nativeElement.clientWidth;
                this.deviceSize = utils.ObjectUtils.findDeviceSize(containerWidth);
                this.removeChartCredit();
                this.setDonutChartTooltip();
                var series = this.cloneConfiguration.series;
                this.setDonutChartSeriesOptions(series);
                if (this.legendLayout === core.LegendLayoutEnum.Vertical) {
                    this.setDonutChartLegendOption(this.legendWidthPx);
                }
                if (this.chartType === ChartTypeEnum.Donut) {
                    this.setDonutChartInnerText();
                }
                this.donutChartSliceClick();
                Highcharts__namespace.chart(this.pieDonutChart.nativeElement, this.cloneConfiguration);
            }
        };
        AswPieDonut.prototype.onResize = function () {
            this.initializeChart();
        };
        AswPieDonut.prototype.removeChartCredit = function () {
            this.cloneConfiguration.credits = {
                enabled: false
            };
        };
        AswPieDonut.prototype.setDonutChartTooltip = function () {
            var this$ = this;
            this.cloneConfiguration.tooltip = {
                useHTML: true,
                split: false,
                backgroundColor: core.AswChartConstants.blackColor,
                borderColor: core.AswChartConstants.blackColor,
                style: {
                    color: core.AswChartConstants.whiteColor,
                    fontWeight: core.AswChartConstants.fontWeight
                },
                borderRadius: 0,
                enabled: this.isMute ? false : true,
                formatter: function () {
                    var percentage = this.point.percentage;
                    return "\n                    <div class=\"row\">\n                        <div class=\"col-md-12 text-end text-right\">\n                            <span style=\"color: " + this.point.color + "\">\u25A0</span>\n                            <strong>" + this.point.name + "</strong>\n                        </div>\n                        <div class=\"col-md-12 text-end text-right\">\n                            " + this$.percentPipe.transform(percentage / 100, '.2') + "\n                        </div>\n                        <div class=\"col-md-12 text-end text-right\">\n                            " + this$.currencyPipe.transform(this.point.options.value, this$.currencyCode) + "\n                        </div>\n                    </div>\n                ";
                }
            };
        };
        AswPieDonut.prototype.donutChartSliceClick = function () {
            var _this = this;
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
                            click: (function (event) {
                                var pointClickEvent = {
                                    name: event.point.name,
                                    id: event.point.options.id,
                                    percentage: event.point.percentage,
                                    value: event.point.options.value,
                                    target: event.point.options.target
                                };
                                _this.donutSliceClick.emit(pointClickEvent);
                            })
                        }
                    }
                }
            };
        };
        AswPieDonut.prototype.setDonutChartSeriesOptions = function (series) {
            var _this = this;
            series.forEach(function (seriesOption) {
                seriesOption.allowPointSelect = true;
                seriesOption.showInLegend = true;
                if (_this.chartType === ChartTypeEnum.Donut) {
                    seriesOption.innerSize = core.AswChartConstants.innerSize;
                }
                if (_this.isMute) {
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
                seriesOption.cursor = core.AswChartConstants.pointer;
                var data = seriesOption.data;
                _this.handleNegativeSeriesData(data);
                var sortedSeriesOptionData = _this.isLegendSort ? _this.sortSeriesData(data) : data;
                seriesOption.data = sortedSeriesOptionData;
            });
        };
        AswPieDonut.prototype.sortSeriesData = function (data) {
            if (this.legendType === core.LegendTypeEnum.Default) {
                data.sort(function (a, b) {
                    return ('' + a.name).localeCompare(b.name);
                });
                return data;
            }
            else {
                data.sort(function (a, b) {
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
        };
        AswPieDonut.prototype.handleNegativeSeriesData = function (data) {
            data.forEach(function (element) {
                element.value = element.y;
                element.y = element.y ? Math.abs(element.y) : 0.001;
            });
        };
        AswPieDonut.prototype.setDonutChartLegendOption = function (legendWidthPx) {
            var this$ = this;
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
                    fontSize: this.deviceSize === core.GridOptionsEnum.ExtraSmall ? '12px' : '14px',
                    fontWeight: core.AswChartConstants.fontWeight
                },
                width: legendWidthPx + 15,
                title: {
                    text: this$.setDonutChartLegendWithHeader(legendWidthPx + 15),
                    style: {
                        fontSize: this.deviceSize === core.GridOptionsEnum.ExtraSmall
                            ? core.AswChartConstants.fontSize12 : core.AswChartConstants.fontSize14,
                        color: '#6c757d',
                        fontWeight: core.AswChartConstants.fontWeight,
                        fontFamily: '500 14px/20px Google Sans Text,Arial,Helvetica,sans-serif'
                    }
                },
                labelFormatter: function () {
                    var point = this;
                    return this$.setDonutChartLegendWithHeader(legendWidthPx, point.name, point.percentage, point.options.value);
                }
            };
        };
        AswPieDonut.prototype.setFontSize = function () {
            return this.deviceSize === core.GridOptionsEnum.ExtraSmall ? core.AswChartConstants.fontSize14 : core.AswChartConstants.fontSize16;
        };
        AswPieDonut.prototype.setLegendAlignment = function () {
            if (this.deviceSize === core.GridOptionsEnum.ExtraSmall) {
                return 'center';
            }
            else if (this.legendPosition === core.LegendPositionEnum.Right) {
                return core.LegendPositionEnum.Right;
            }
            else if (this.legendPosition === core.LegendPositionEnum.Left) {
                return core.LegendPositionEnum.Left;
            }
            else {
                return 'center';
            }
        };
        AswPieDonut.prototype.setLegendVerticalAlignment = function () {
            if (this.deviceSize === core.GridOptionsEnum.ExtraSmall) {
                return core.LegendPositionEnum.Bottom;
            }
            else if (this.legendPosition === core.LegendPositionEnum.Right) {
                return 'middle';
            }
            else if (this.legendPosition === core.LegendPositionEnum.Left) {
                return 'middle';
            }
            else {
                return core.LegendPositionEnum.Bottom;
            }
        };
        AswPieDonut.prototype.setDonutChartLegendWithHeader = function (legendWidthPx, name, percentage, value) {
            var legendCategoryWidthPx;
            var legendValueWidthPx;
            var legendPercentageWidthPx;
            switch (this.legendType) {
                case core.LegendTypeEnum.Default:
                    return "\n                <div style=\"width:" + legendWidthPx + "px\">\n                    <div class=\"row\">\n                        <div class=\"col-md-12 col-sm-12 col-12\">\n                            " + (name ? name : 'Category') + "\n                        </div>\n                    </div>\n                </div>\n                ";
                case core.LegendTypeEnum.Percentage:
                    legendCategoryWidthPx = legendWidthPx * 0.9;
                    legendPercentageWidthPx = legendWidthPx * 0.1;
                    return "\n                <div style=\"width:" + (legendCategoryWidthPx + legendPercentageWidthPx) + "px\">\n                    <div class=\"row\">\n                        <div class=\"col-md-8 col-sm-8 col-8\">\n                            " + (name ? name : 'Category') + "\n                        </div>\n                        <div class=\"col-md-4 col-sm-4 col-4 text-end text-right\">\n                            " + (percentage ? this.percentPipe.transform(percentage / 100, '.0') : '%') + "\n                        </div>\n                    </div>\n                </div>\n                ";
                case core.LegendTypeEnum.Value:
                    legendCategoryWidthPx = legendWidthPx * 0.5;
                    legendValueWidthPx = legendWidthPx * 0.5;
                    return "\n                <div style=\"width:" + (legendCategoryWidthPx + legendValueWidthPx) + "px\">\n                    <div class=\"row\">\n                        <div class=\"col-md-6 col-sm-6 col-6\">\n                            " + (name ? name : 'Category') + "\n                        </div>\n                        <div class=\"col-md-6 col-sm-6 col-6 text-end text-right\">\n                            " + (value ? this.currencyPipe.transform(value, 'INR') : 'Total') + "\n                        </div>\n                    </div>\n                </div>\n                ";
                default:
                    legendCategoryWidthPx = legendWidthPx * 0.5;
                    legendPercentageWidthPx = legendWidthPx * 0.1;
                    legendValueWidthPx = legendWidthPx * 0.4;
                    return "\n                <div style=\"width:" + (legendCategoryWidthPx + legendPercentageWidthPx + legendValueWidthPx) + "px\">\n                    <div class=\"row\">\n                        <div class=\"col-md-5 col-sm-5 col-5\">\n                            " + (name ? name : 'Category') + "\n                        </div>\n                        <div class=\"col-md-2 col-xs-2 col-2 text-end text-right\">\n                            " + (percentage ? this.percentPipe.transform(percentage / 100) : '%') + "\n                        </div>\n                        <div class=\"col-md-5 col-sm-5 col-5 text-end text-right\">\n                            " + (value ? this.currencyPipe.transform(value, this.currencyCode, 'symbol', '.2') : 'Total') + "\n                        </div>\n                    </div>\n                </div>\n                ";
            }
        };
        AswPieDonut.prototype.setDonutChartInnerText = function () {
            var this$ = this;
            this.cloneConfiguration.chart = {
                events: {
                    load: function () {
                        var _this = this;
                        var centerX;
                        var centerY;
                        var itemWidth;
                        this.series.forEach(function (element) {
                            var points = element.points.slice(0, 1);
                            points.forEach(function (point) {
                                centerX = _this.plotLeft + (point.shapeArgs.x - point.shapeArgs.innerR) + 8;
                                centerY = _this.plotTop + point.shapeArgs.y - 14;
                                itemWidth = (point.shapeArgs.innerR * 2) - 20;
                            });
                            if (this$.icon) {
                                _this.renderer.label(this$.setInnerTextIcon(itemWidth), centerX, this$.deviceSize === core.GridOptionsEnum.ExtraSmall ? centerY - 20 : centerY - 25, undefined, 30, 30, true).css({
                                    fontSize: this$.setFontSize(),
                                    textAlign: core.AswChartConstants.centerAlign,
                                    fontWeight: core.AswChartConstants.fontWeight
                                }).add();
                                _this.renderer.label(this$.setInnerTextLabel(itemWidth), centerX, centerY, undefined, 30, 30, true).css({
                                    fontSize: this$.setFontSize(),
                                    textAlign: core.AswChartConstants.centerAlign,
                                    fontWeight: core.AswChartConstants.fontWeight
                                }).add();
                                _this.renderer.label(this$.setInnerTextValue(itemWidth), centerX, this$.deviceSize === core.GridOptionsEnum.ExtraSmall ? centerY + 20 : centerY + 25, undefined, 30, 30, true).css({
                                    fontSize: this$.setFontSize(),
                                    textAlign: core.AswChartConstants.centerAlign,
                                    fontWeight: core.AswChartConstants.fontWeight
                                }).add();
                            }
                            else {
                                _this.renderer.label(this$.setInnerTextLabel(itemWidth), centerX, this$.deviceSize === core.GridOptionsEnum.ExtraSmall ? centerY - 20 : centerY - 25, undefined, 30, 30, true).css({
                                    fontSize: this$.setFontSize(),
                                    textAlign: core.AswChartConstants.centerAlign,
                                    fontWeight: core.AswChartConstants.fontWeight
                                }).add();
                                _this.renderer.label(this$.setInnerTextValue(itemWidth), centerX, centerY, undefined, 30, 30, true).css({
                                    fontSize: this$.setFontSize(),
                                    textAlign: core.AswChartConstants.centerAlign,
                                    fontWeight: core.AswChartConstants.fontWeight
                                }).add();
                                _this.renderer.label(this$.setInnerTextTarget(itemWidth), centerX, this$.deviceSize === core.GridOptionsEnum.ExtraSmall ? centerY + 20 : centerY + 25, undefined, 30, 30, true).css({
                                    fontSize: this$.setFontSize(),
                                    textAlign: core.AswChartConstants.centerAlign,
                                    fontWeight: core.AswChartConstants.fontWeight
                                }).add();
                            }
                        });
                    }
                }
            };
        };
        AswPieDonut.prototype.setInnerTextLabel = function (width) {
            return "\n        <div style=\"width: " + width + "px; opacity: " + (this.isMute ? 0.35 : 1) + "\">\n            <div class=\"row\">\n                <div class=\"col-md-12 text-truncate\">\n                    " + this.label + "\n                </div>\n            </div>\n        </div>\n        ";
        };
        AswPieDonut.prototype.setInnerTextIcon = function (width) {
            return "\n        <div style=\"width: " + width + "px; opacity: " + (this.isMute ? 0.35 : 1) + "\">\n            <div class=\"row\">\n                <div class=\"col-md-12 text-truncate\">\n                    " + this.icon + "\n                </div>\n            </div>\n        </div>\n        ";
        };
        AswPieDonut.prototype.setInnerTextValue = function (width) {
            return "\n        <div style=\"width: " + width + "px; opacity: " + (this.isMute ? 0.35 : 1) + "\">\n            <div class=\"row\">\n                <div class=\"col-md-12 text-truncate\">\n                    <strong>" + this.aswCurrencyPipe.transform(this.amount) + "</strong>\n                </div>\n            </div>\n        </div>\n        ";
        };
        AswPieDonut.prototype.setInnerTextTarget = function (width) {
            return "\n        <div style=\"width: " + width + "px; opacity: " + (this.isMute ? 0.35 : 1) + "\">\n            <div class=\"row\">\n                <div class=\"col-md-12 text-truncate\">\n                    " + (this.target ? this.target : '') + "\n                </div>\n            </div>\n        </div>\n        ";
        };
        return AswPieDonut;
    }());
    AswPieDonut.decorators = [
        { type: core$1.Component, args: [{
                    selector: 'asw-pie-donut',
                    template: "<div #pieDonutChart></div>",
                    styles: [""]
                },] }
    ];
    AswPieDonut.ctorParameters = function () { return [
        { type: common.PercentPipe },
        { type: common.CurrencyPipe },
        { type: core.AswCurrencyPipe }
    ]; };
    AswPieDonut.propDecorators = {
        config: [{ type: core$1.Input }],
        isLegendSort: [{ type: core$1.Input }],
        isMute: [{ type: core$1.Input }],
        isLegendDisplay: [{ type: core$1.Input }],
        icon: [{ type: core$1.Input }],
        label: [{ type: core$1.Input }],
        amount: [{ type: core$1.Input }],
        target: [{ type: core$1.Input }],
        chartType: [{ type: core$1.Input }],
        currencyCode: [{ type: core$1.Input }],
        legendPosition: [{ type: core$1.Input }],
        legendType: [{ type: core$1.Input }],
        legendWidthPx: [{ type: core$1.Input }],
        legendLayout: [{ type: core$1.Input }],
        donutSliceClick: [{ type: core$1.Output }],
        pieDonutChart: [{ type: core$1.ViewChild, args: ['pieDonutChart', { static: true },] }],
        onResize: [{ type: core$1.HostListener, args: ['window:resize',] }]
    };

    /**
     * @license
     * Copyright ASW (A Software World) All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file
     */
    var AswPieDonutModule = /** @class */ (function () {
        function AswPieDonutModule() {
        }
        return AswPieDonutModule;
    }());
    AswPieDonutModule.decorators = [
        { type: core$1.NgModule, args: [{
                    declarations: [
                        AswPieDonut
                    ],
                    imports: [
                        common.CommonModule,
                    ],
                    exports: [
                        AswPieDonut
                    ],
                    providers: [
                        common.PercentPipe,
                        core.AswCurrencyPipe,
                        common.CurrencyPipe,
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

    exports.AswPieDonut = AswPieDonut;
    exports.AswPieDonutModule = AswPieDonutModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=asoftwareworld-charts-pie-donut.umd.js.map
