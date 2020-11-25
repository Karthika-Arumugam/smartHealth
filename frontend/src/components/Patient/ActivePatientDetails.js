import React, { Component } from 'react';
import { Container, Row } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

import './ActivePatient.css'
import cookie from 'react-cookies';


class ActivePatientDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            authFlag: cookie.load('cookie') || false,
            emailID: props.match.params.patientid,
            image: '/images/a2.jpg' || '',
            patientDetails: {}
        }
        this.imageHandler = this.imageHandler.bind(this);

    }
    imageHandler = type => {
        switch (type) {
            case ('Ambulance'):
                return '/images/a1.jpg';
            case ('Medical Prescription'):
                return '/images/a2.jpg';
            case ('Equipment'):
                return '/images/a4.jpg';
            case ('Monitoring'):
                return '/images/a3.jpg';
            case ('Cardiologist'):
                return '/images/8.jpg';
            default:
                return '/images/8.jpg';
        }
    }
    async componentDidMount() {
        let heartRateData = [];
        let riskStatusData = [];
        let highRiskCount = 0, lowRiskcount = 0;
        try {
            const authToken = cookie.load('cookie') || '';
            if (authToken) {
                // check if usergroup is Health Care Provider, if yes then add query params

                const response = await fetch(`/api/v1/patient/morePatientInfo`, {
                    method: 'get',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': authToken
                    },
                });
                if (response.status === 200) {
                    const patientList = await response.json();
                    console.log("risk status", patientList);
                    //match the currStatus codes 0,1,2,3 with all,high,medium and low
                    switch (this.state.riskStatus) {
                        case 'all':
                            this.setState({ currRisk: 4 });
                            break;
                        case 'high':
                            this.setState({ currRisk: 3 });
                            break;
                        case 'medium':
                            this.setState({ currRisk: 2 });
                            break;
                        case 'low':
                            this.setState({ currRisk: 1 });
                            break;
                        case 'healthy':
                            this.setState({ currRisk: 0 });
                            break;
                        default:
                            this.setState({ currRisk: 4 });
                    }

                    if (patientList && Array.isArray(patientList)) {
                        let patientDeatils = patientList.filter(patient => this.state.emailID == patient.emailId);


                        console.log("this.state.thispatient")
                        switch (patientDeatils[0].currRiskStatus) {
                            case 0:
                                patientDeatils[0].riskString = "Healthy";
                                break;
                            case 1:
                                patientDeatils[0].riskString = "Low";
                                break;
                            case 2:
                                patientDeatils[0].riskString = "Medium";
                                break;
                            case 3:
                                patientDeatils[0].riskString = "High";
                                break;
                            default:
                        }
                        console.log(patientDeatils[0]);
                        this.setState({
                            patient: patientDeatils[0]
                        })

                        console.log(this.state.patient)

                    }
                }

                const { id, emailId, userGroup } = JSON.parse(window.atob(authToken.split('.')[1]));

                const responseDash = await fetch(`/api/v1/patient/dashboard?emailId=${emailId}`, {
                    method: 'get',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': this.state.authToken
                    },
                });
                const body = await responseDash.json();
                if (responseDash.status === 200) {
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
    render() {
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
            <Container className="back-resource" >
                <Container className="resource-row">
                    <h2 ><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />Patient Details</h2>

                    <div style={{ width: "20%", height: "auto", margin: "0 auto" }}>

                        <img style={{ imageOrientation: "from-image", width: "13vw", height: "auto", position: "relative" }} src="/images/profile.png"></img>

                    </div>
                    <Container className="recipes-list" >

                        {this.state.patient ? <article className="recipe">
                            <h3 className="recipe-title"><b> {this.state.patient.firstName} {this.state.patient.lastName} </b></h3>
                            <div className="recipe-detail">
                                <h5><b>Current Risk Prediction</b> {this.state.patient.riskString}</h5>
                                <div className="recipe-meta" >
                                    <span className="calorie"><img src="/images/icon-envelope.png" alt="email" /><b>Email</b> {this.state.patient.emailId} </span>
                                    <span className="calorie"><img src="/images/icon-phone.png" alt="contact" /><b>Contact Number</b> {this.state.patient.phone} </span>
                                </div>
                                <div className="recipe-meta">
                                    <span className="calorie"><img src="/images/icon-pie-chart.png" alt="gender" /><b>Gender</b> {this.state.patient.gender} </span>
                                    <span className="calorie"><img src="/images/icon-pie-chart.png" alt="age" /><b>Age</b> {this.state.patient.age}</span>
                                </div>
                            </div>
                        </article> : ""}
                        <HighchartsReact highcharts={Highcharts} options={healthstats4Risk} />
                    </Container>
                </Container>
                <p>{this.state.message}</p>
            </Container >
        );
    }
}
export default ActivePatientDetails;