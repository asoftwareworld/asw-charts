import { CurrencyPipe, PercentPipe } from '@angular/common';
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
    ChartLegendTypeEnum,
    ChartPointerEvent,
    CurrencyCodeEnum,
    GridOptionsEnum,
    LegendLayoutEnum,
    LegendPositionEnum,
} from '@asoftwareworld/charts/core';
import { ObjectUtils } from '@asoftwareworld/charts/utils';
import * as Highcharts from 'highcharts';
import HighchartsSankey from 'highcharts/modules/sankey';
import {
    AlignValue,
    Options,
    PointClickEventObject,
    PointOptionsObject,
    Point,
    Series,
    SeriesPieOptions,
    VerticalAlignValue
} from 'highcharts';
import { SankeyChartPointerEvent } from './../interface/sankey-pointer-event';
HighchartsSankey(Highcharts);

@Component({
    selector: 'asw-sankey-chart',
    templateUrl: './sankey-chart.html',
    styleUrls: ['./sankey-chart.scss']
})
export class AswSankeyChart implements OnChanges, AfterViewInit {

    private cloneConfiguration!: Options;
    public deviceSize: GridOptionsEnum = GridOptionsEnum.Large;
    private viewInitialized = false;
    @Input() config!: Options;
    @Input() isLegendSort = true;
    @Input() icon!: string;
    @Input() label: string | undefined;
    @Input() amount: number | null | undefined;
    @Input() target!: string;
    @Input() currencyCode: CurrencyCodeEnum = CurrencyCodeEnum.Blank;
    @Input() legendPosition: LegendPositionEnum = LegendPositionEnum.Right;
    @Input() legendType: ChartLegendTypeEnum = ChartLegendTypeEnum.Both;
    @Input() legendWidthPx = 250;
    @Input() legendLayout: LegendLayoutEnum = LegendLayoutEnum.Vertical;

    @Output() sankeyClick: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('sankeyChart', { static: true }) sankeyChart!: ElementRef;
    constructor(
        private currencyPipe: CurrencyPipe) { }

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
            const containerWidth = this.sankeyChart.nativeElement.clientWidth;
            this.deviceSize = ObjectUtils.findDeviceSize(containerWidth);
            this.removeChartCredit();
            this.setSankeyChartTooltip();
            const series: SeriesPieOptions[] = this.cloneConfiguration.series as SeriesPieOptions[];
            if (this.legendLayout === LegendLayoutEnum.Vertical) {
               // this.setSankeyChartLegendOption(this.legendWidthPx);
            }
            this.clickOnSankey();
            Highcharts.chart(this.sankeyChart.nativeElement, this.cloneConfiguration);
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

    private setSankeyChartTooltip(): void {
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
                const point: any = this.point;
                return `
                    <div class="row">
                        <div class="col-md-12 text-end text-right">
                            <span style="color: ${point.color}">\u25A0</span>
                            <strong>${point.series.name}</strong>
                        </div>
                        <div class="col-md-12 text-end text-right">
                            ${point.options.weight
                                ? point.options.from + ' → ' + point.options.to + ': ' + point.options.weight
                                : point.options.id + ': ' + point.sum
                            }
                        </div>
                    </div>
                `;
            }
        };
    }

    private clickOnSankey(): void {
        if (this.cloneConfiguration.plotOptions) {
            // tslint:disable-next-line:no-non-null-assertion
            this.cloneConfiguration.plotOptions!.sankey!.point = {
                events: {
                    click: ((event: any) => {
                        const pointClickEvent: SankeyChartPointerEvent = {
                            name: event.point.series.name,
                            from: event.point.options.from ?? event.point.id,
                            to: event.point.options.to,
                            weight: event.point.options.weight,
                            sum: event.point.sum
                        };
                        this.sankeyClick.emit(pointClickEvent);
                    })
                }
            };
        } else {
            this.cloneConfiguration.plotOptions = {
                sankey: {
                    point: {
                        events: {
                            click: ((event: any) => {
                                const pointClickEvent: SankeyChartPointerEvent = {
                                    name: event.point.series.name,
                                    from: event.point.options.from ?? event.point.id,
                                    to: event.point.options.to,
                                    weight: event.point.options.weight,
                                    sum: event.point.sum
                                };
                                this.sankeyClick.emit(pointClickEvent);
                            })
                        }
                    }
                }
            };
        }
    }

    private setDonutChartSeriesOptions(series: SeriesPieOptions[]): void {
        series.forEach((seriesOption: SeriesPieOptions) => {
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
            const data: PointOptionsObject[] = seriesOption.data as PointOptionsObject[];
            this.handleNegativeSeriesData(data);
            const sortedSeriesOptionData: PointOptionsObject[] = this.isLegendSort ? this.sortSeriesData(data) : data;
            seriesOption.data = sortedSeriesOptionData;
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

    private setFontSize(): string {
        return this.deviceSize === GridOptionsEnum.ExtraSmall ? AswChartConstants.fontSize14 : AswChartConstants.fontSize16;
    }

    private setSankeyChartLegendOption(legendWidthPx: number): void {
        const this$: this = this;
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
            itemMarginTop: 3, // Space between each category in the legend
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
            labelFormatter(): string {
                const point: any = this as Point;
                const value = point.yData.reduce((acc: any, cur: any) => acc + cur, 0);
                return this$.setLineChartLegendWithHeader(
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

    private setLineChartLegendWithHeader(
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
