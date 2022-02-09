/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { AfterViewInit, ElementRef, EventEmitter, OnChanges } from '@angular/core';
import { CurrencyCodeEnum, GridOptionsEnum } from '@asoftwareworld/charts/core';
import { Options } from 'highcharts';
export declare class AswSemiCircleDonut implements OnChanges, AfterViewInit {
    private percentPipe;
    private currencyPipe;
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
    currencyCode: CurrencyCodeEnum;
    legendWidthPx: number;
    donutSliceClick: EventEmitter<any>;
    semiCircleDonutChart: ElementRef;
    chartId: ElementRef;
    constructor(percentPipe: PercentPipe, currencyPipe: CurrencyPipe);
    ngOnChanges(): void;
    ngAfterViewInit(): void;
    initializeChart(): void;
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
    private findDeviceSize;
    private setDonutChartInnerText;
    private setInnerTextLabel;
    private setInnerTextIcon;
    private setInnerTextValue;
    private setInnerTextTarget;
}