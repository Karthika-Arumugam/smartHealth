import React, { Component } from 'react';
import { Container, Badge, Row, Col, Toast, Alert } from 'react-bootstrap';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Dashboard.css';

class PatientDashboard extends Component {

    render() {
        const ranges = [
            [1246406400000, 14.3, 27.7],
            [1246492800000, 14.5, 27.8],
            [1246579200000, 15.5, 29.6],
            [1246665600000, 16.7, 30.7],
            [1246752000000, 16.5, 25.0],
            [1246838400000, 17.8, 25.7],
            [1246924800000, 13.5, 24.8],
            [1247011200000, 10.5, 21.4],
            [1247097600000, 9.2, 23.8],
            [1247184000000, 11.6, 21.8],
            [1247270400000, 10.7, 23.7],
            [1247356800000, 11.0, 23.3],
            [1247443200000, 11.6, 23.7],
            [1247529600000, 11.8, 20.7],
            [1247616000000, 12.6, 22.4],
            [1247702400000, 13.6, 19.6],
            [1247788800000, 11.4, 22.6],
            [1247875200000, 13.2, 25.0],
            [1247961600000, 14.2, 21.6],
            [1248048000000, 13.1, 17.1],
            [1248134400000, 12.2, 15.5],
            [1248220800000, 12.0, 20.8],
            [1248307200000, 12.0, 17.1],
            [1248393600000, 12.7, 18.3],
            [1248480000000, 12.4, 19.4],
            [1248566400000, 12.6, 19.9],
            [1248652800000, 11.9, 20.2],
            [1248739200000, 11.0, 19.3],
            [1248825600000, 10.8, 17.8],
            [1248912000000, 11.8, 18.5],
            [1248998400000, 10.8, 16.1]
        ]
        const heartRate = {
            colors: ['#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066',
                '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
            chart: {
                backgroundColor: null,
                style: {
                    fontFamily: 'Dosis, sans-serif'
                },
                zoomType: 'x',
                type: 'spline'
            },
            title: {
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                },
                text: 'Heartbeat statistics'
            },
            subtitle: {
                text: 'Heartbeat statistics'
            },
            tooltip: {
                borderWidth: 0,
                backgroundColor: 'rgba(219,219,216,0.8)',
                shadow: false
            },
            legend: {
                backgroundColor: '#F0F0EA',
                itemStyle: {
                    fontWeight: 'bold',
                    fontSize: '13px'
                }
            },
            xAxis: {
                type: 'datetime',
                accessibility: {
                    rangeDescription: 'Range: Jul 1st 2009 to Jul 31st 2009.'
                },
                gridLineWidth: 1,
                labels: {
                    style: {
                        fontSize: '12px'
                    }
                }
            },
            yAxis: {
                minorTickInterval: 'auto',
                title: {
                    style: {
                        textTransform: 'uppercase'
                    }
                },
                labels: {
                    style: {
                        fontSize: '12px'
                    }
                }
            },
            plotOptions: {
                candlestick: {
                    lineColor: '#404048'
                }
            },
            series: [{
                name: 'Heatbeat',
                data: ranges,
                type: 'area',
                lineWidth: 0,
                linkedTo: ':previous',
                color: Highcharts.getOptions().colors[0],
                fillOpacity: 0.3,
                zIndex: 1,
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            }]
        };
        const healthstats4Risk = {
            chart: {
                type: 'area',
                scrollablePlotArea: {
                    minWidth: 600,
                    scrollPositionX: 1
                },
                zoomType: 'x',
                style: {
                    fontFamily: 'Dosis, sans-serif'
                }
            },
            colors: ['#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066',
                '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
            title: {
                text: 'Heart Health Risk',
                align: 'center',
            },
            subtitle: {
                text: 'Predicted heart health History',
                align: 'center'
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    overflow: 'justify'
                }
            },
            yAxis: {
                title: {
                    text: 'Health Risk '
                },
                minorGridLineWidth: 0,
                gridLineWidth: 0,
                alternateGridColor: null,
                plotBands: [{ // Low
                    from: 0,
                    to: 25,
                    // color: 'rgb(229, 238, 176)',
                    color: 'rgb(234, 241, 195)',
                    label: {
                        text: 'Low',
                        style: {
                            color: '#606060'
                        }
                    }
                }, { // Medium
                    from: 25,
                    to: 50,
                    // color: 'rgb(255,250,205)',
                    color: 'rgb(248, 244, 210)',
                    label: {
                        text: 'Medium',
                        style: {
                            color: '#606060'
                        }
                    }
                }, { // High Risk
                    from: 50,
                    to: 75,
                    // color: 'rgb(243, 220, 178)',
                    color: 'rgb(245, 227, 194)',
                    label: {
                        text: 'High',
                        style: {
                            color: '#606060'
                        }
                    }
                }, { // Moderate breeze
                    from: 75,
                    to: 100,
                    color: 'rgb(246, 191, 191)',
                    label: {
                        text: 'Critical',
                        style: {
                            color: '#606060'
                        }
                    }
                }]
            },
            tooltip: {
                valueSuffix: '%'
            },
            plotOptions: {
                spline: {
                    lineWidth: 4,
                    states: {
                        hover: {
                            lineWidth: 5
                        }
                    },
                    marker: {
                        enabled: false
                    },
                    pointInterval: 3600000, // one hour
                    pointStart: Date.UTC(2018, 1, 13, 0, 0, 0)
                }
            },
            series: [{
                name: 'Health Risk %',
                data: [
                    3.7, 3.3, 3.9, 5.1, 3.5, 3.8, 4.0, 5.0, 6.1, 3.7, 3.3, 6.4,
                    6.9, 6.0, 6.8, 4.4, 4.0, 3.8, 5.0, 4.9, 9.2, 9.6, 9.5, 6.3,
                    9.5, 10.8, 14.0, 11.5, 13, 10.0, 14, 10.2, 10.3, 9.4, 8.9, 10.6, 10.5, 11.1,
                    10.4, 10.7, 11.3, 10.2, 9.6, 10.2, 11.1, 10.8, 13.0, 12.5, 12.5, 11.3,
                    10.1, 13, 60, 60, 55
                ],
            }],
            navigation: {
                menuItemStyle: {
                    fontSize: '10px'
                }
            }
        }
        const RiskAggregate = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            colors: ['#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066',
                '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
            title: {
                text: 'Health Risk',
                align: 'center',
                verticalAlign: 'middle',
                y: 60
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: '25',
                            color: 'black'
                        }
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%'],
                    size: '110%'
                }
            },
            series: [{
                type: 'pie',
                name: 'HealthRisk',
                innerSize: '55%',
                data: [
                    ['High', 20],
                    ['Low', 80],
                    {
                        dataLabels: {
                            enabled: true
                        }
                    }
                ]
            }]
        }
        const healthstats2Risk = {
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {
                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }
            },
            time: {
                useUTC: false
            },
            title: {
                text: 'Live random data'
            },
            accessibility: {
                announceNewData: {
                    enabled: true,
                    minAnnounceInterval: 15000,
                    announcementFormatter: function (allSeries, newSeries, newPoint) {
                        if (newPoint) {
                            return 'New point added. Value: ' + newPoint.y;
                        }
                        return false;
                    }
                }
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }],
                  plotBands: [{ // Low
                from: 0,
                to: 0.5,
                // color: 'rgb(229, 238, 176)',
                color: 'rgb(234, 241, 195)',
                label: {
                    text: 'Low',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // critical
                from: 0.5,
                to: 1,
                color: 'rgb(246, 191, 191)',
                label: {
                    text: 'Critical',
                    style: {
                        color: '#606060'
                    }
                }
            }]
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br/>',
                pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.round(Math.random())
                        });
                    }
                    return data;
                }())
            }],
          
        }
        return (
            <Container>
                <div aria-live="polite" aria-atomic="true" style={{ position: 'relative', minHeight: '100px', }}>
                    <h2 ><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />Patient Dashboard</h2>
                    <Toast style={{ position: 'absolute', top: 0, right: 0, }}>
                        <Toast.Header>
                            <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                            <strong className="mr-auto">Recommended</strong>
                            <small> just now</small>
                        </Toast.Header>
                        <Toast.Body>See? Just like this.</Toast.Body>
                    </Toast>
                </div>
                {/* <Alert variant='danger'><b> This is a danger alert—check it out </b></Alert> */}
                <Row style={{ width: '100%', margin: "0px 0px 0px 0px" }}>
                    <Row className='text-stats-panel' style={{ width: '100%' }}>
                        <div style={{ margin: "0 auto", padding: "0", width: "30%" }}>
                            My Resources Stats
                        </div>
                    </Row>
                    <Row className='text-stats-panel' style={{ width: "100%" }} >
                        <Col><h1><Badge variant="success">Device Active</Badge></h1></Col>
                        <Col><h1><Badge variant="warning">My Doctors</Badge></h1></Col>
                        <Col><h1><Badge variant="info">Medication</Badge></h1></Col>
                    </Row>
                </Row>
                <Row>
                    <Col xs={9} ><HighchartsReact highcharts={Highcharts} options={healthstats4Risk} /></Col>
                    <Col><HighchartsReact highcharts={Highcharts} options={RiskAggregate} /></Col>
                </Row>
                <HighchartsReact highcharts={Highcharts} options={heartRate} />
                <HighchartsReact highcharts={Highcharts} options={healthstats2Risk} />
            </Container>
        );
    }
}
export default PatientDashboard;