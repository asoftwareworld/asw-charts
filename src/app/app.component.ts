import { Component, OnInit } from '@angular/core';
import { CurrencyCodeEnum, LegendTypeEnum } from '@asoftwareworld/charts/core';
import { Options } from 'highcharts';
import { LegendLayoutEnum } from './component/core/enum/legend-type.enum';
import { PointClickEvent } from './component/core/interface/point-click-event';

@Component({
    selector: 'asw-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    isLegendSort = true;
    title = 'Donut chart';
    label: string | undefined;
    currencyCode = CurrencyCodeEnum.INR;
    legendLayout = LegendLayoutEnum.Vertical;
    amount: number | null | undefined = -345345;
    legendType = LegendTypeEnum.Both;
    config: Options = {
        chart: {
            type: 'pie'
        },
        colors: ['#FAD331', '#96D5DF', '#1BA8BB', '#C5D930', '#C1A0C5'],
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                },
                dataLabels: {
                    enabled: false
                }
            }
        },
        series: [
            {
                type: 'pie',
                name: 'Price',
                data: [
                    {
                        id: '1',
                        name: 'Fuel',
                        y: 7450.00
                    },
                    {
                        id: '2',
                        name: 'Lubricants',
                        y: 435.00,
                    },
                    {
                        name: 'Road Services',
                        y: 200.87,
                        id: '3',
                    },
                    {
                        name: 'Food',
                        y: 45.67,
                        id: '4',
                    },
                    {
                        name: 'Shop',
                        y: 42.45,
                        id: '5',
                    }
                ]
            },
        ]
    };


    currentValue = 70;
    totalValue = 180;
    // const degree = ((currentValue * totalValue) / 100);
    semiCircleDonut: Options = {
        chart: {
            plotBorderWidth: 0,
            plotShadow: false
        },
        pane: {
            center: ['50%', '70%'],
            size: '60%',
            startAngle: -90,
            endAngle: 90,
            background: [{
                borderWidth: 0,
                backgroundColor: 'none',
                shape: 'arc'
            }]
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        // tooltip: {
        //     enabled: false
        // },

        // the value axis
        yAxis: {
            lineWidth: 0,
            min: 0,
            max: 180,
            minorTickLength: 0,
            tickLength: 0,
            tickWidth: 0,
            labels: {
                enabled: false
            },
            // title: {
            //     text: '', // '<div class="gaugeFooter">46% Rate</div>',
            //     useHTML: true,
            //     y: 80
            // },
            // plotBands: [{ // mark the weekend
            //     // color: {
            //     //     linearGradient: [0, 0, 300, 0],
            //     //     stops: [
            //     //         [0.1, '#DF5353'], // red
            //     //         [0.4, '#DDDF0D'], // yellow
            //     //         [0.65, '#55BF3B'] // green
            //     //     ]
            //     // },
            //     from: 0,
            //     to: 180,
            //     innerRadius: '50%',
            //     outerRadius: '100%',
            // }],
            // pane: 0
        },
        // series: [{
        //     name: 'Cost Efficiency',
        //     type: 'gauge',
        //     data: [Math.floor(((this.currentValue * this.totalValue) / 100))],
        //     dataLabels: {
        //         format: '<span style="font-size:10px;color:grey;">' + this.currentValue + '%</span></div>',
        //     },
        //     tooltip: {
        //         valueSuffix: ' revolutions/min'
        //     }
        // }],
        series: [{
            type: 'pie',
            name: 'Browser share',
            innerSize: '50%',
            data: [
                ['Firefox', 25],
                ['IE', 25],
                ['Chrome', 25],
                ['Opera', 25]
            ]
        },
        {
            type: 'gauge',
            data: [40],
            dial: {
                rearLength: '0'
            }
        }],

        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%']
            },
            gauge: {
                dataLabels: {
                    enabled: false
                },
                dial: {
                    radius: '100%'
                }
            }
        }
    };
    ngOnInit(): void {

    }

    donutSliceClick(event: PointClickEvent): void {
        this.label = event.name;
        this.amount = event.value;
        console.log(event);
    }
}
