(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@asoftwareworld/charts/core'), require('@asoftwareworld/charts/utils'), require('highcharts')) :
    typeof define === 'function' && define.amd ? define('@asoftwareworld/charts/semi-circle-donut', ['exports', '@angular/common', '@angular/core', '@asoftwareworld/charts/core', '@asoftwareworld/charts/utils', 'highcharts'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.asoftwareworld = global.asoftwareworld || {}, global.asoftwareworld.charts = global.asoftwareworld.charts || {}, global.asoftwareworld.charts['semi-circle-donut'] = {}), global.ng.common, global.ng.core, global.asoftwareworld.charts.core, global.asoftwareworld.charts.utils, global.Highcharts));
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
    var HighchartsMore = require('highcharts/highcharts-more.src');
    HighchartsMore(Highcharts__namespace);
    var AswSemiCircleDonut = /** @class */ (function () {
        function AswSemiCircleDonut(percentPipe, currencyPipe) {
            this.percentPipe = percentPipe;
            this.currencyPipe = currencyPipe;
            this.deviceSize = core.GridOptionsEnum.Large;
            this.viewInitialized = false;
            this.isLegendSort = true;
            this.isMute = false;
            this.isLegendDisplay = true;
            // @Input() chartType: ChartTypeEnum = ChartTypeEnum.Donut;
            this.currencyCode = core.CurrencyCodeEnum.INR;
            // @Input() legendPosition: LegendPositionEnum = LegendPositionEnum.Right;
            // @Input() legendType: LegendTypeEnum = LegendTypeEnum.Both;
            this.legendWidthPx = 250;
            this.donutSliceClick = new core$1.EventEmitter();
        }
        AswSemiCircleDonut.prototype.ngOnChanges = function () {
            if (!this.viewInitialized) {
                return;
            }
            this.initializeChart();
        };
        AswSemiCircleDonut.prototype.ngAfterViewInit = function () {
            this.viewInitialized = true;
            this.initializeChart();
        };
        AswSemiCircleDonut.prototype.initializeChart = function () {
            if (this.config) {
                this.cloneConfiguration = this.config;
                var containerWidth = this.semiCircleDonutChart.nativeElement.clientWidth;
                this.deviceSize = utils.ObjectUtils.findDeviceSize(containerWidth);
                // this.findDeviceSize();
                // this.removeChartCredit();
                // this.setDonutChartTooltip();
                // const series: SeriesPieOptions[] = this.cloneConfiguration.series as SeriesPieOptions[];
                // this.setDonutChartSeriesOptions(series);
                // this.setDonutChartLegendOption(this.legendWidthPx);
                // // if (this.chartType === ChartTypeEnum.Donut) {
                // //     this.setDonutChartInnerText();
                // // }
                // this.donutChartSliceClick();
                Highcharts__namespace.chart(this.semiCircleDonutChart.nativeElement, this.cloneConfiguration);
            }
        };
        AswSemiCircleDonut.prototype.removeChartCredit = function () {
            this.cloneConfiguration.credits = {
                enabled: false
            };
        };
        AswSemiCircleDonut.prototype.setDonutChartTooltip = function () {
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
                    return "\n                     <div class=\"row\">\n                         <div class=\"col-md-12 text-end\">\n                             <span style=\"color: " + this.point.color + "\">\u25A0</span>\n                             <strong>" + this.point.name + "</strong>\n                         </div>\n                         <div class=\"col-md-12 text-end\">\n                             " + this$.percentPipe.transform(percentage / 100, '.2') + "\n                         </div>\n                         <div class=\"col-md-12 text-end\">\n                             " + this$.currencyPipe.transform(this.point.options.value, this$.currencyCode) + "\n                         </div>\n                     </div>\n                 ";
                }
            };
        };
        AswSemiCircleDonut.prototype.donutChartSliceClick = function () {
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
        };
        AswSemiCircleDonut.prototype.setDonutChartSeriesOptions = function (series) {
            var _this = this;
            series.forEach(function (seriesOption) {
                seriesOption.allowPointSelect = true;
                seriesOption.showInLegend = true;
                // if (this.chartType === ChartTypeEnum.Donut) {
                //     seriesOption.innerSize = AswChartConstants.innerSize;
                // }
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
        AswSemiCircleDonut.prototype.sortSeriesData = function (data) {
            // if (this.legendType === LegendTypeEnum.Default) {
            //     data.sort((a: any, b: any) => {
            //         return ('' + a.name).localeCompare(b.name);
            //     });
            //     return data;
            // } else {
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
            // }
        };
        AswSemiCircleDonut.prototype.handleNegativeSeriesData = function (data) {
            data.forEach(function (element) {
                element.value = element.y;
                element.y = element.y ? Math.abs(element.y) : 0.001;
            });
        };
        AswSemiCircleDonut.prototype.setDonutChartLegendOption = function (legendWidthPx) {
            var this$ = this;
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
        AswSemiCircleDonut.prototype.setFontSize = function () {
            return this.deviceSize === core.GridOptionsEnum.ExtraSmall ? core.AswChartConstants.fontSize14 : core.AswChartConstants.fontSize16;
        };
        AswSemiCircleDonut.prototype.setLegendAlignment = function () {
            if (this.deviceSize === core.GridOptionsEnum.ExtraSmall) {
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
        };
        AswSemiCircleDonut.prototype.setLegendVerticalAlignment = function () {
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
        };
        AswSemiCircleDonut.prototype.setDonutChartLegendWithHeader = function (legendWidthPx, name, percentage, value) {
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
        };
        AswSemiCircleDonut.prototype.findDeviceSize = function () {
            var containerWidth = this.semiCircleDonutChart.nativeElement.clientWidth;
            if (containerWidth >= 1400) {
                this.deviceSize = core.GridOptionsEnum.ExtraExtraLarge;
            }
            else if (containerWidth >= 1200) {
                this.deviceSize = core.GridOptionsEnum.ExtraLarge;
            }
            else if (containerWidth >= 992) {
                this.deviceSize = core.GridOptionsEnum.Large;
            }
            else if (containerWidth >= 768) {
                this.deviceSize = core.GridOptionsEnum.Medium;
            }
            else if (containerWidth >= 576) {
                this.deviceSize = core.GridOptionsEnum.Small;
            }
            else if (containerWidth < 576) {
                this.deviceSize = core.GridOptionsEnum.ExtraSmall;
            }
        };
        AswSemiCircleDonut.prototype.setDonutChartInnerText = function () {
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
        AswSemiCircleDonut.prototype.setInnerTextLabel = function (width) {
            return "\n         <div style=\"width: " + width + "px; opacity: " + (this.isMute ? 0.35 : 1) + "\">\n             <div class=\"row\">\n                 <div class=\"col-md-12 text-truncate\">\n                     " + this.label + "\n                 </div>\n             </div>\n         </div>\n         ";
        };
        AswSemiCircleDonut.prototype.setInnerTextIcon = function (width) {
            return "\n         <div style=\"width: " + width + "px; opacity: " + (this.isMute ? 0.35 : 1) + "\">\n             <div class=\"row\">\n                 <div class=\"col-md-12 text-truncate\">\n                     " + this.icon + "\n                 </div>\n             </div>\n         </div>\n         ";
        };
        AswSemiCircleDonut.prototype.setInnerTextValue = function (width) {
            return "\n         <div style=\"width: " + width + "px; opacity: " + (this.isMute ? 0.35 : 1) + "\">\n             <div class=\"row\">\n                 <div class=\"col-md-12 text-truncate\">\n                     <strong>" + this.currencyPipe.transform(this.amount, this.currencyCode) + "</strong>\n                 </div>\n             </div>\n         </div>\n         ";
        };
        AswSemiCircleDonut.prototype.setInnerTextTarget = function (width) {
            return "\n         <div style=\"width: " + width + "px; opacity: " + (this.isMute ? 0.35 : 1) + "\">\n             <div class=\"row\">\n                 <div class=\"col-md-12 text-truncate\">\n                     " + (this.target ? this.target : '') + "\n                 </div>\n             </div>\n         </div>\n         ";
        };
        return AswSemiCircleDonut;
    }());
    AswSemiCircleDonut.decorators = [
        { type: core$1.Component, args: [{
                    selector: 'asw-semi-circle-donut',
                    template: "<div #semiCircleDonutChart></div>",
                    styles: [""]
                },] }
    ];
    AswSemiCircleDonut.ctorParameters = function () { return [
        { type: common.PercentPipe },
        { type: common.CurrencyPipe }
    ]; };
    AswSemiCircleDonut.propDecorators = {
        config: [{ type: core$1.Input }],
        isLegendSort: [{ type: core$1.Input }],
        isMute: [{ type: core$1.Input }],
        isLegendDisplay: [{ type: core$1.Input }],
        icon: [{ type: core$1.Input }],
        label: [{ type: core$1.Input }],
        amount: [{ type: core$1.Input }],
        target: [{ type: core$1.Input }],
        currencyCode: [{ type: core$1.Input }],
        legendWidthPx: [{ type: core$1.Input }],
        donutSliceClick: [{ type: core$1.Output }],
        semiCircleDonutChart: [{ type: core$1.ViewChild, args: ['semiCircleDonutChart', { static: true },] }],
        chartId: [{ type: core$1.ViewChild, args: ['chartId', { static: true },] }]
    };

    /**
     * @license
     * Copyright ASW (A Software World) All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file
     */
    var AswSemiCircleDonutModule = /** @class */ (function () {
        function AswSemiCircleDonutModule() {
        }
        return AswSemiCircleDonutModule;
    }());
    AswSemiCircleDonutModule.decorators = [
        { type: core$1.NgModule, args: [{
                    declarations: [
                        AswSemiCircleDonut
                    ],
                    imports: [
                        common.CommonModule,
                    ],
                    exports: [
                        AswSemiCircleDonut
                    ],
                    providers: [
                        common.PercentPipe,
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

    exports.AswSemiCircleDonut = AswSemiCircleDonut;
    exports.AswSemiCircleDonutModule = AswSemiCircleDonutModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=asoftwareworld-charts-semi-circle-donut.umd.js.map
