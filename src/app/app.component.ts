import { Component, OnInit } from '@angular/core';
import {
    ChartLegendTypeEnum,
    ChartPointerEvent,
    CurrencyCodeEnum,
    LegendLayoutEnum,
    LegendPositionEnum,
    PieLegendTypeEnum,
    PointClickEvent
} from '@asoftwareworld/charts/core';
import { Options } from 'highcharts';

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
    legendType = PieLegendTypeEnum.Both;
    lineChartLegendType = ChartLegendTypeEnum.Both;
    legendPosition = LegendPositionEnum.Right;
    isLegendDisplay = true;
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

    semiCircleDonut: Options = {
        chart: {
            type: 'solidgauge'
        },
        title: undefined,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: [{
                backgroundColor: '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }]
        },

        exporting: {
            enabled: false
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            tickWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    currentValue = 70;
    totalValue = 180;
    // const degree = ((currentValue * totalValue) / 100);
    // semiCircleDonut: Options = {
    //     chart: {
    //         type: 'pie',
    //         plotBorderWidth: 0,
    //         plotShadow: false,
    //         marginTop: -50,
    //     },
    //     colors: ['#DF5353', '#DDDF0D', '#55BF3B'],
    //     title: {
    //         text: 'Cost Efficiency',
    //     },
    //     accessibility: {
    //         point: {
    //             valueSuffix: '%'
    //         }
    //     },
    //     plotOptions: {
    //         pie: {
    //             dataLabels: {
    //                 enabled: true,
    //                 distance: -40,
    //                 style: {
    //                     fontWeight: 'bold',
    //                     color: 'white',
    //                     textShadow: '0px 1px 2px black'
    //                 }
    //             },
    //             startAngle: -90,
    //             endAngle: 90,
    //             center: ['50%', '75%'],
    //             size: '110%'
    //         },
    //         // gauge: {
    //         //     dataLabels: {
    //         //         enabled: false
    //         //     },
    //         //     dial: {
    //         //         radius: '100%'
    //         //     }
    //         // }
    //     },
    //     pane: {
    //         center: ['50%', '70%'],
    //         size: '70%',
    //         startAngle: -90,
    //         endAngle: 90,
    //         background: [{
    //             borderWidth: 0,
    //             backgroundColor: 'none',
    //             shape: 'arc',
    //         }],
    //     },
    //     // exporting: {
    //     //     enabled: false
    //     // },
    //     credits: {
    //         enabled: false
    //     },
    //     // tooltip: {
    //     //     enabled: false
    //     // },

    //     // the value axis
    //     yAxis: {
    //         lineWidth: 0,
    //         min: 0,
    //         max: 180,
    //         minorTickLength: 0,
    //         tickLength: 0,
    //         tickWidth: 0,
    //         labels: {
    //             enabled: false
    //         },
    //         // title: {
    //         //     text: '', // '<div class="gaugeFooter">46% Rate</div>',
    //         //     useHTML: true,
    //         //     y: 80
    //         // },
    //         // plotBands: [{ // mark the weekend
    //         //     // color: {
    //         //     //     linearGradient: [0, 0, 300, 0],
    //         //     //     stops: [
    //         //     //         [0.1, '#DF5353'], // red
    //         //     //         [0.4, '#DDDF0D'], // yellow
    //         //     //         [0.65, '#55BF3B'] // green
    //         //     //     ]
    //         //     // },
    //         //     from: 0,
    //         //     to: 180,
    //         //     innerRadius: '50%',
    //         //     outerRadius: '100%',
    //         // }],
    //         // pane: 0
    //     },
    //     // series: [{
    //     //     name: 'Cost Efficiency',
    //     //     type: 'gauge',
    //     //     data: [Math.floor(((this.currentValue * this.totalValue) / 100))],
    //     //     dataLabels: {
    //     //         format: '<span style="font-size:10px;color:grey;">' + this.currentValue + '%</span></div>',
    //     //     },
    //     //     tooltip: {
    //     //         valueSuffix: ' revolutions/min'
    //     //     }
    //     // }],
    //     series: [{
    //         type: 'pie',
    //         name: 'Browser share',
    //         innerSize: '50%',
    //         data: [
    //             ['Firefox', 25],
    //             ['IE', 25],
    //             ['Chrome', 25]
    //         ]
    //     },
    //     {
    //         type: 'gauge',
    //         name: 'Speed',
    //         data: [Math.floor(40)],
    //         // dial: {
    //         //     rearLength: '0'
    //         // },
    //         dataLabels: {
    //             format: '<span style="font-size:10px;color:grey;">' + 40 + '%</span></div>',
    //         },
    //         tooltip: {
    //             valueSuffix: ' km/h'
    //         }
    //     }
    // ]
    // };

    lineConfig: Options = {
        title: {
            text: 'Solar Employment Growth by Sector, 2010-2016'
        },

        subtitle: {
            text: 'Source: thesolarfoundation.com'
        },

        yAxis: {
            title: {
                text: 'Number of Employees'
            }
        },

        xAxis: {
            accessibility: {
                rangeDescription: 'Range: 2010 to 2017'
            }
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },

        series: [{
            type: 'line',
            name: 'Installation',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
            type: 'line',
            name: 'Sales & Distribution',
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
            type: 'line',
            name: 'Manufacturing',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
        }, {
            type: 'line',
            name: 'Project Development',
            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        }, {
            type: 'line',
            name: 'Other',
            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    };

    barChartConfig: Options = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Average Rainfall'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Rainfall (mm)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            type: 'column',
            name: 'Tokyo',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

        }, {
            type: 'column',
            name: 'New York',
            data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

        }, {
            type: 'column',
            name: 'London',
            data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

        }, {
            type: 'column',
            name: 'Berlin',
            data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

        }]
    };

    ngOnInit(): void {

    }

    donutSliceClick(event: PointClickEvent): void {
        this.label = event.name;
        this.amount = event.value;
        console.log(event);
    }

    linePointClick(event: ChartPointerEvent): void {
        console.log(event);
    }

    barClick(event: ChartPointerEvent): void {
        console.log(event);
    }
}
