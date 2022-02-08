/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { AfterViewInit, ElementRef, EventEmitter, OnChanges } from '@angular/core';
import { AswCurrencyPipe, CurrencyCodeEnum, GridOptionsEnum, LegendLayoutEnum, LegendPositionEnum, LegendTypeEnum } from '@asoftwareworld/charts/core';
import { Options } from 'highcharts';
import { ChartTypeEnum } from '../enum/chart-type.enum';
export declare class AswPieDonut implements OnChanges, AfterViewInit {
    private percentPipe;
    private currencyPipe;
    private aswCurrencyPipe;
    private cloneConfiguration;
    deviceSize: GridOptionsEnum;
    private viewInitialized;
    config: Options;
    isLegendSort: boolean;
    isMute: boolean;
    isLegendDisplay: boolean;
    icon: string;
    label: string | undefined;
    amount: number | null | undefined;
    target: string;
    chartType: ChartTypeEnum;
    currencyCode: CurrencyCodeEnum;
    legendPosition: LegendPositionEnum;
    legendType: LegendTypeEnum;
    legendWidthPx: number;
    legendLayout: LegendLayoutEnum;
    donutSliceClick: EventEmitter<any>;
    pieDonutChart: ElementRef;
    constructor(percentPipe: PercentPipe, currencyPipe: CurrencyPipe, aswCurrencyPipe: AswCurrencyPipe);
    ngOnChanges(): void;
    ngAfterViewInit(): void;
    initializeChart(): void;
    onResize(): void;
    private removeChartCredit;
    private setDonutChartTooltip;
    private donutChartSliceClick;
    private setDonutChartSeriesOptions;
    private sortSeriesData;
    private handleNegativeSeriesData;
    private setDonutChartLegendOption;
    private setFontSize;
    private setLegendAlignment;
    private setLegendVerticalAlignment;
    private setDonutChartLegendWithHeader;
    private setDonutChartInnerText;
    private setInnerTextLabel;
    private setInnerTextIcon;
    private setInnerTextValue;
    private setInnerTextTarget;
}
