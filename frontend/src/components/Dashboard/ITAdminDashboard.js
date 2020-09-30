import React, { Component } from 'react';
import { Container, Row, Col, Table, Badge } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HighchartsReact from 'highcharts-react-official';
import highcharts3d from 'highcharts/highcharts-3d'
import './Dashboard.css';
import cookie from 'react-cookies';

import Highcharts from "highcharts/highcharts.js";
import highchartsMore from "highcharts/highcharts-more.js";
import solidGauge from "highcharts/modules/solid-gauge.js";
highchartsMore(Highcharts);
solidGauge(Highcharts);
highcharts3d(Highcharts);

const ResourcePie = {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: 'Resource Type Availability Chart'
    },
    credits: {
        enabled: false
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }
    },
    series: [{
        type: 'pie',
        name: 'Resource Availability Percent',
        data: [
            ['Ambulance', 45.0],
            ['Cardiologist', 26.8],
            {
                name: 'Specialist',
                y: 12.8,
                sliced: true,
                selected: true
            },
            ['Emergency', 8.5],
            ['Devices', 7.1]
        ]
    }]
}

class ITAdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resources: [],
        }
    }
    async componentDidMount() {
        try {
            const authToken = cookie.load('cookie') || '';
            if (authToken) {
                //Call Admin dashboard APIs
                const response = await fetch(`/api/v1/resource/all`, {
                    method: 'get',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': authToken
                    },
                });
                const body = await response.json();
                if (response.status === 200) {
                    if (body) {
                        console.log(body);
                        this.setState({
                            resources: body
                        })
                    }
                }
                this.setState({ message: response.status === 200 ? 'account created successfully! please login to continue...' : body.message });
            }
        }
        catch (e) {
            this.setState({ message: e.message || e });
        }
    }

    render() {

        const allocstatus = {
            chart: {
                type: 'solidgauge',
                height: '110%',
                events: {
                    render: renderIcons
                }
            },

            title: {
                text: 'Activity',
                style: {
                    fontSize: '24px'
                }
            },

            tooltip: {
                borderWidth: 0,
                backgroundColor: 'none',
                shadow: false,
                style: {
                    fontSize: '16px'
                },
                valueSuffix: '%',
                pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
                positioner: function (labelWidth) {
                    return {
                        x: (this.chart.chartWidth - labelWidth) / 2,
                        y: (this.chart.plotHeight / 2) + 15
                    };
                }
            },

            pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{ // Track for Move
                    outerRadius: '112%',
                    innerRadius: '88%',
                    backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0])
                        .setOpacity(0.3)
                        .get(),
                    borderWidth: 0
                }, { // Track for Exercise
                    outerRadius: '87%',
                    innerRadius: '63%',
                    backgroundColor: Highcharts.color(Highcharts.getOptions().colors[1])
                        .setOpacity(0.3)
                        .get(),
                    borderWidth: 0
                }, { // Track for Stand
                    outerRadius: '62%',
                    innerRadius: '38%',
                    backgroundColor: Highcharts.color(Highcharts.getOptions().colors[2])
                        .setOpacity(0.3)
                        .get(),
                    borderWidth: 0
                }]
            },

            yAxis: {
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: []
            },

            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        enabled: false
                    },
                    linecap: 'round',
                    stickyTracking: false,
                    rounded: true
                }
            },

            series: [{
                name: 'Move',
                data: [{
                    color: Highcharts.getOptions().colors[0],
                    radius: '112%',
                    innerRadius: '88%',
                    y: 80
                }]
            }, {
                name: 'Exercise',
                data: [{
                    color: Highcharts.getOptions().colors[1],
                    radius: '87%',
                    innerRadius: '63%',
                    y: 65
                }]
            }, {
                name: 'Stand',
                data: [{
                    color: Highcharts.getOptions().colors[2],
                    radius: '62%',
                    innerRadius: '38%',
                    y: 50
                }]
            }]
        };

        const allocationgauge = {
            chart: {
                type: "solidgauge"
            },
            title: {
                text: 'Allocations per min'
            },
            pane: {
                center: ['50%', '85%'],
                size: '100%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor:
                        Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
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
                    [0.10, '#55BF3B'], // green
                    [0.50, '#DDDF0D'], // yellow
                    [0.70, '#DF5353'] // red
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
                },
                min: 0,
                max: 100,
                title: {
                    text: 'Allocations per min'
                }
            },

            credits: {
                enabled: false
            },

            series: [{
                name: 'Resource Allocation Response Time',
                data: [50],
                dataLabels: {
                    format:
                        '<div style="text-align:center">' +
                        '<span style="font-size:25px">{y}</span><br/>' +
                        '<span style="font-size:12px;opacity:0.4">Allocations</span>' +
                        '</div>'
                },
                tooltip: {
                    valueSuffix: ' Allocations'
                }
            }]


        }
        const waitgauge = {
            chart: {
                type: "solidgauge"
            },
            title: {
                text: 'Average response time'
            },
            pane: {
                center: ['50%', '85%'],
                size: '100%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor:
                        Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
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
                    [0.10, '#55BF3B'], // green
                    [0.50, '#DDDF0D'], // yellow
                    [0.90, '#DF5353'] // red
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
                },
                min: 0,
                max: 100,
                title: {
                    text: 'Average response time'
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Average response time',
                data: [30],
                dataLabels: {
                    format:
                        '<div style="text-align:center">' +
                        '<span style="font-size:25px">{y}</span><br/>' +
                        '<span style="font-size:12px;opacity:0.4">sec</span>' +
                        '</div>'
                },
                tooltip: {
                    valueSuffix: ' Average wait time'
                }
            }]


        }
        const lineAlloc = {
            title: {
                text: 'Resource Allocation Details by Resource Type'
            },

            subtitle: {
                text: 'Dynamic Resource Allocation Count'
            }, credits: {
                enabled: false
            },

            yAxis: {
                title: {
                    text: 'Number of Allocations'
                }
            },

            xAxis: {
                accessibility: {
                    rangeDescription: 'Range: 2010 to 2017'
                }
            },

            legend: {
                layout: 'vertical',
                align: 'center',
                verticalAlign: 'bottom'
            },

            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 20
                }
            },

            series: [{
                name: 'Ambulance',
                data: [43, 52, 57, 69, 97, 119, 137, 154]
            }, {
                name: 'Cardiologist',
                data: [24, 24, 29, 29, 32, 30, 38, 40]
            }, {
                name: 'Emergency',
                data: [11, 17, 16, 19, 20, 24, 32, 39]
            }, {
                name: 'Devices',
                data: [null, null, 5, 12, 15, 22, 34, 34]
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
        }
        const getTableEntries = () => {
            // const isAllocated = Math.floor(Math.random() * 2) === 0 ? "success" : "danger";
            console.log("inside gettable");
            const xx = [];
            for (let key of this.state.resources) {
                const datealloc = new Date(key.createdDate)
                const dateString = datealloc.toLocaleDateString()

                console.log(dateString)
                xx.push(
                    <tr>
                        <td>{key.type}</td>
                        <td>{key.healthcareProvider}</td>
                        <td>{key.owner}</td>
                        <td>{dateString}</td>
                        <td><Badge variant="success">Manage</Badge></td>
                    </tr>
                )
            }
            return xx;
        }
        function renderIcons() {

            // Move icon
            if (!this.series[0].icon) {
                this.series[0].icon = this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8])
                    .attr({
                        stroke: '#303030',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'stroke-width': 2,
                        zIndex: 10
                    })
                    .add(this.series[2].group);
            }
            this.series[0].icon.translate(
                this.chartWidth / 2 - 10,
                this.plotHeight / 2 - this.series[0].points[0].shapeArgs.innerR -
                (this.series[0].points[0].shapeArgs.r - this.series[0].points[0].shapeArgs.innerR) / 2
            );

            // Exercise icon
            if (!this.series[1].icon) {
                this.series[1].icon = this.renderer.path(
                    ['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8,
                        'M', 8, -8, 'L', 16, 0, 8, 8]
                )
                    .attr({
                        stroke: '#ffffff',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'stroke-width': 2,
                        zIndex: 10
                    })
                    .add(this.series[2].group);
            }
            this.series[1].icon.translate(
                this.chartWidth / 2 - 10,
                this.plotHeight / 2 - this.series[1].points[0].shapeArgs.innerR -
                (this.series[1].points[0].shapeArgs.r - this.series[1].points[0].shapeArgs.innerR) / 2
            );

            // Stand icon
            if (!this.series[2].icon) {
                this.series[2].icon = this.renderer.path(['M', 0, 8, 'L', 0, -8, 'M', -8, 0, 'L', 0, -8, 8, 0])
                    .attr({
                        stroke: '#303030',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'stroke-width': 2,
                        zIndex: 10
                    })
                    .add(this.series[2].group);
            }

            this.series[2].icon.translate(
                this.chartWidth / 2 - 10,
                this.plotHeight / 2 - this.series[2].points[0].shapeArgs.innerR -
                (this.series[2].points[0].shapeArgs.r - this.series[2].points[0].shapeArgs.innerR) / 2
            );
        }
        return (
            <Container>
                <div aria-live="polite" aria-atomic="true" style={{ position: 'relative', minHeight: '100px', }}>
                    <h2><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />IT Admin Dashboard</h2>
                </div>
                <Row>
                    <Col><h1><Badge variant="info">Activated Devices<br></br><br></br>40<br></br><br></br><h6><a>more info</a></h6></Badge></h1></Col>
                </Row>
                <Row >
                    <Col><HighchartsReact highcharts={Highcharts} options={allocstatus} /></Col>
                    <Col><HighchartsReact highcharts={Highcharts} options={allocationgauge} /></Col>
                    <Col><HighchartsReact highcharts={Highcharts} options={waitgauge} /></Col>
                </Row>

                <Row>
                    <Col><HighchartsReact highcharts={Highcharts} options={lineAlloc} /></Col>
                    <Col sm={5}><HighchartsReact highcharts={Highcharts} options={ResourcePie} /></Col>
                </Row>

                <Row>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Resource Type</th>
                                <th>Provider Name</th>
                                <th>Assigned To</th>
                                <th>Assigned Date</th>
                                <th>Manage Tab</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getTableEntries()}
                            {/* <tr>

                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td colSpan="2">Larry the Bird</td>
                                <td>@twitter</td>
                            </tr> */}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        );
    }
}
export default ITAdminDashboard;