import React, { Component } from 'react';
import { Form, Container, Badge, Row, Col, Toast, Alert } from 'react-bootstrap';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Dashboard.css';
import cookie from 'react-cookies';

class PatientDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stats4Risk: [],
            heartRate: [],
            alerts: [],
            medication: [],
            doctor: [],
            time: [],
            docCount: 0,
            medCount: 0,
            riskPercent: {},
            deviceStatus: "",
            authToken: cookie.load('cookie') || false,
            message: '',
        }
    }
    async componentDidMount() {
        let heartRateData = [];
        let riskStatusData = [];
        let highRiskCount = 0, lowRiskcount = 0;

        try {
            const authToken = cookie.load('cookie') || '';

            if (authToken) {
                const { id, emailId, userGroup } = JSON.parse(window.atob(this.state.authToken.split('.')[1]));
                //TO ADD LOGIC FOR userGroup is Patient then call patient dashboard
                const response = await fetch(`/api/v1/patient/dashboard?emailId=${emailId}`, {
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
                        for (let index in body.time) {
                            heartRateData.push([new Date(body.time[index]).getTime(), body.heartRates[index]]);
                            riskStatusData.push([new Date(body.time[index]).getTime(), body.riskStatus[index]]);
                            body.riskStatus[index] > 50 ? highRiskCount++ : lowRiskcount++;
                        }
                        const total = highRiskCount + lowRiskcount;
                        this.setState({
                            stats4Risk: riskStatusData,
                            heartRate: heartRateData,
                            docCount: body.allocatedSpecialists.length,
                            medCount: body.medications.length,
                            riskPercent: {
                                High: (highRiskCount / total) * 100,
                                Low: (lowRiskcount / total) * 100
                            },
                            deviceStatus: body.deviceStatus
                        })
                    }
                }
                this.setState({ message: response.status !== 200 ? body.message : '' });
            }
            else
                this.setState({ message: "Session expired login to continue" });

        } catch (e) {
            this.setState({ message: e.message || e });
        }
    }
    async onClickDeviceCheckbox() {

        //Change device state staus
        this.setState({
            deviceStatus: !this.state.deviceStatus
        });

        //Call /activateDevice api
        try {
            const authToken = cookie.load('cookie') || '';
            if (authToken) {

                const endpoint = this.state.deviceStatus == false ? "activateDevice" : "deactivateDevice";
                const response = await fetch(`api/v1/patient/${endpoint}`, {
                    method: 'post',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': authToken
                    },
                });
                const body = await response.json();
                this.setState({ message: response.status === 200 ? 'Device activated and data is monitored' : body.message });
            }
            else
                this.setState({ message: "Session expired login to continue" });
        } catch (e) {
            this.setState({ message: e.message || e });
        }

    }
    render() {

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
                data: this.state.heartRate,
                // data: ranges,
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
                type: 'line',
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
                data: this.state.stats4Risk,
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
                    ['Low', this.state.riskPercent.Low],
                    ['High', this.state.riskPercent.High],
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
        const deviceStatusTitle = this.state.deviceStatus == false ? "Disabled" : "Active";
        const switchLabel = this.state.deviceStatus == false ? "Enable?" : "Disable?";
        return (
            <Container>
                {this.state.authToken ? <Container>
                    <div aria-live="polite" aria-atomic="true" style={{ position: 'relative', minHeight: '100px', }}>
                        <h2 ><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />Patient Dashboard</h2>
                        {/* <Toast style={{ position: 'absolute', top: 0, right: 0, }}>
                        <Toast.Header>
                            <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                            <strong className="mr-auto">Recommended</strong>
                            <small> just now</small>
                        </Toast.Header>
                        <Toast.Body>See? Just like this.</Toast.Body>
                    </Toast> */}
                    </div>
                    <Row style={{ width: '100%', margin: "0px 0px 0px 0px" }}>
                        <Row className='text-stats-panel' style={{ width: '100%' }}>
                            <div style={{ margin: "0 auto", padding: "0", width: "30%" }}>
                                My Resources Stats
                        </div>
                        </Row>

                        <Row className='text-stats-panel' style={{ width: "100%" }} >
                            <Col>
                                <h1>
                                    <Badge variant={this.state.deviceStatus == false ? "warning" : "success"}>My Device Status<br></br>{deviceStatusTitle}<br></br><br></br>
                                        <h5><Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            size="small"
                                            label={switchLabel}
                                            checked={this.state.deviceStatus}
                                            onChange={this.onClickDeviceCheckbox.bind(this)}
                                        /></h5>
                                    </Badge>
                                </h1>
                            </Col>
                            <Col><h1><Badge variant="warning">My Doctors<br></br>{this.state.docCount}<br></br><br></br><h6><a>more info</a></h6></Badge></h1></Col>
                            <Col><h1><Badge variant="info">Medication<br></br>{this.state.medCount}<br></br><br></br><h6><a>more info</a></h6></Badge></h1></Col>
                        </Row>
                    </Row>
                    <Row>
                        <Col xs={9} ><HighchartsReact highcharts={Highcharts} options={healthstats4Risk} /></Col>
                        <Col><HighchartsReact highcharts={Highcharts} options={RiskAggregate} /></Col>
                    </Row>
                    <HighchartsReact highcharts={Highcharts} options={heartRate} />
                    <HighchartsReact highcharts={Highcharts} options={healthstats2Risk} />
                </Container> : ""}
                <p>{this.state.message}</p>
            </Container>
        );
    }
}
export default PatientDashboard;