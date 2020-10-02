import React, { Component } from 'react';
import { Container, Row, Col, Table, Button, Badge } from 'react-bootstrap';
import { faHeartbeat, faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HighchartsReact from 'highcharts-react-official';
import highcharts3d from 'highcharts/highcharts-3d'
import './Dashboard.css';
import cookie from 'react-cookies';

import Highcharts from "highcharts/highcharts.js";
import highchartsMore from "highcharts/highcharts-more.js";
import solidGauge from "highcharts/modules/solid-gauge.js";
import { Link } from 'react-router-dom';
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
            ['Ambulance', 40.0],
            ['Cardiologist', 26.8],
            {
                name: 'Monitoring',
                y: 12.8,
                sliced: true,
                selected: true
            },
            ['Medical Prescription', 7.1],
            ['Equipment', 5.0]
        ]
    }]
}

class ITAdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resources: []
        }
        this.getResourceCount = this.getResourceCount.bind(this);
    }
    getResourceCount = () => {
        const ambulance = {}, prescription = {}, monitoring = {}, cardiologist = {}, equipment = {};
        //create recource type obj as {10/10/2020:3,10/11/2020:4} date:count
        for (let key of this.state.resources) {
            const datealloc = new Date(key.createdDate)
            const dateString = datealloc.toLocaleDateString()
            switch (key.type) {
                case ('Ambulance'):
                    ambulance[dateString] = ambulance[dateString] ? ambulance[dateString] + 1 : 1;
                    break;
                case ("Medical Prescription"):
                    prescription[dateString] = prescription[dateString] ? prescription[dateString] + 1 : 1;
                    break;
                case ('Monitoring'):
                    monitoring[dateString] = monitoring[dateString] ? monitoring[dateString] + 1 : 1;
                    break;
                case ('Cardiologist'):
                    cardiologist[dateString] = cardiologist[dateString] ? cardiologist[dateString] + 1 : 1;
                    break;
                case ('Equipment'):
                    equipment[dateString] = equipment[dateString] ? equipment[dateString] + 1 : 1;
                    break;
            }
        }
        // convert date : count to below format for each type
        //data: [[Date.UTC(2013, 11, 31), 43], [Date.UTC(2013, 11, 30), 52], [Date.UTC(2013, 11, 29), 57]]
        //1. Ambulance Chart Data
        const ambulanceData = [];
        for (let key in ambulance) {
            let d = new Date(key);
            ambulanceData.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()), ambulance[key]]);
        }
        this.setState({ ambulanceDataChart: ambulanceData });

        //2. Cardiologist Chart Data
        const cardiologistData = [];
        for (let key in cardiologist) {
            let d = new Date(key);
            cardiologistData.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()), cardiologist[key]]);
        }
        this.setState({ cardiologistDataChart: cardiologistData });

        //3. prescription Chart Data
        const prescriptionData = [];
        for (let key in prescription) {
            let d = new Date(key);
            prescriptionData.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()), prescription[key]]);
        }
        this.setState({ prescriptionDataChart: prescriptionData });

        //4. monitoring Chart Data
        const monitoringData = [];
        for (let key in prescription) {
            let d = new Date(key);
            monitoringData.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()), monitoring[key]]);
        }
        this.setState({ monitoringDataChart: monitoringData });

        //5. Equipment Chart Data
        const equipmentData = [];
        for (let key in equipment) {
            let d = new Date(key);
            equipmentData.push([Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()), monitoring[key]]);
        }
        this.setState({ equipmentDataChart: equipmentData });
    };

    async componentDidMount() {
        try {
            const authToken = cookie.load('cookie') || '';

            if (authToken) {

                //call active device counts
                fetch('api/v1/patient/activeDeviceCount', {
                    method: 'get',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then(async function (response) {
                    const body = await response.json();
                    return { status: response.status, body };
                }).then(async response => {
                    if (response.status === 200) {

                        this.setState({
                            deviceCount: response.body,
                        });
                    } else {
                        this.setState({
                            msg: body.message
                        })
                    }
                }).catch(async err => {
                    console.log(err)
                });

                //Call Admin dashboard APIs
                const response = await fetch(`/api/v1/resource/all`, {
                    method: 'get',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': authToken
                    },
                })
                const body = await response.json();
                if (response.status === 200) {
                    if (body) {
                        this.setState({
                            resources: body
                        })
                    }
                }
                this.setState({ message: response.status === 200 ? 'Success' : body.message });
                //count the resources allocated each day
                this.getResourceCount();
                const throughput = await fetch('/api/v1/statistics/efficiency', {
                    method: 'get',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': authToken
                    },
                });
                const throughputbody = await throughput.json();
                if (throughputbody) {
                    this.setState({
                        avgallocation: throughputbody * 100
                    })
                }
                //avg response time graph
                const avgresbody = await fetch('/api/v1/statistics/avgResponseTime', {
                    method: 'get',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': authToken
                    },
                });
                let avgres = await avgresbody.json();
                if (avgres) {
                    const num = (avgres * 100).toFixed(2);
                    this.setState({
                        avgResponseTime: num
                    })
                }
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
                text: 'Track Resource Allocation by Status',
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
                text: 'Average Allocations %',
                style: {
                    fontSize: '24px'
                }
            },
            subtitle: {
                text: '% allocation done per request received'
            }, credits: {
                enabled: false
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
                    [0.10, '#DF5353'], // red
                    [0.50, '#DDDF0D'], // yellow
                    [0.70, '#55BF3B'] // green   
                ],
                lineWidth: 0,
                tickWidth: 0,
                minorTickInterval: null,
                tickAmount: 2,

                labels: {
                    y: 16
                },
                min: 0,
                max: 100,
                title: {
                    y: -70,
                    text: 'Avg Allocation %'

                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Resource Allocation Response Time',
                data: [this.state.avgallocation],
                dataLabels: {
                    format:
                        '<div style="text-align:center">' +
                        '<span style="font-size:25px">{y}</span><br/>' +
                        '<span style="font-size:12px;opacity:0.4">% allocations</span>' +
                        '</div>'
                },
                tooltip: {
                    valueSuffix: ' Avg allocations %'
                }
            }]
        }
        const waitgauge = {
            chart: {
                type: "solidgauge"
            },
            title: {
                text: 'Average response time',
                style: {
                    fontSize: '24px'
                }
            },
            subtitle: {
                text: '% response time within SLA(5 mins)'
            }, credits: {
                enabled: false
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
                labels: {
                    y: 16
                },
                min: 0,
                max: 100,
                title: {
                    // text: 'Avg % response',
                    y: -70
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Average response time',
                data: [parseFloat(this.state.avgResponseTime)],
                dataLabels: {
                    format:
                        '<div style="text-align:center">' +
                        '<span style="font-size:25px">{y}</span><br/>' +
                        '<span style="font-size:12px;opacity:0.4">% response within SLA</span>' +
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
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%e %b'
                },
                accessibility: {
                    rangeDescription: 'Range: 2019 to 2020'
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
                data: this.state.ambulanceDataChart
            }, {
                name: 'Cardiologist',
                data: this.state.cardiologistDataChart
            }, {
                name: "Medical Prescription",
                data: this.state.prescriptionDataChart
            }, {
                name: 'Monitoring',
                data: this.state.monitoringDataChart
            }, {
                name: 'Equipment',
                data: this.state.equipmentDataChart
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
            const xx = [];
            for (let key of this.state.resources) {
                const datealloc = new Date(key.createdDate)
                const dateString = datealloc.toLocaleDateString()
                xx.push(
                    <tr>
                        <td>{key.type}</td>
                        <td>{key.healthcareProvider}</td>
                        <td>{key.owner}</td>
                        <td>{dateString}</td>
                        <td><Link to={`/resource/${key.healthcareProvider}`}><Button variant="info" >Manage</Button></Link></td>
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
                    <Col><h1><Badge variant="info">Active Devices<br></br><br></br>{this.state.deviceCount}<br></br><br></br><h6><a>more info</a></h6></Badge></h1></Col>
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
                <div aria-live="polite" aria-atomic="true" style={{ position: 'relative', minHeight: '100px', }}>
                    <h3><FontAwesomeIcon icon={faTable} size="1x" style={{ marginRight: "1vw" }} />Resource Allocation details</h3>
                </div>
                <Row >
                    <Table striped hover variant="light">
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
                        </tbody>
                    </Table>
                </Row>
            </Container>
        );
    }
}
export default ITAdminDashboard;