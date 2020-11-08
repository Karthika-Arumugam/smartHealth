import React, { Component } from 'react';
import { Container, Row, Col, Table, Button, Badge } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cookie from 'react-cookies';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from "highcharts/highcharts.js";
import './Dashboard.css';

class HealthCareDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authToken: cookie.load('cookie') || false,
            message: '',
            deviceCount: 0
        }
    }

    render() {
        const lineAlloc = {
            chart: {
                type: 'areaspline'
            },
            title: {
                text: 'Average fruit consumption during one week'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 150,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
            },
            xAxis: {
                categories: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday'
                ],
                plotBands: [{ // visualize the weekend
                    from: 4.5,
                    to: 6.5,
                    color: 'rgba(68, 170, 213, .2)'
                }]
            },
            yAxis: {
                title: {
                    text: 'Fruit units'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' units'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: [{
                name: 'John',
                data: [3, 4, 3, 5, 4, 10, 12]
            }, {
                name: 'Jane',
                data: [1, 3, 4, 3, 3, 5, 4]
            }]

        }
        return (
            <Container>
                <div aria-live="polite" aria-atomic="true" style={{ position: 'relative', minHeight: '100px', }}>
                    <h2 ><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />Health Care Dashboard</h2>
                </div>
                <h3>Today's Patients Stats</h3>
                <Row className='text-stats-panel'>

                    <Col md={3}><h2><Badge variant="secondary">Active Devices<br></br><br></br>{this.state.deviceCount}<br></br><br></br><h6><a>more info</a></h6></Badge></h2></Col>
                    <Col md={3}><h2><Badge variant="danger">Critical Patients<br></br><br></br>{this.state.deviceCount}<br></br><br></br><h6><a>more info</a></h6></Badge></h2></Col>
                    <Col md={3}><h2><Badge variant="warning">High Patients<br></br><br></br>{this.state.deviceCount}<br></br><br></br><h6><a>more info</a></h6></Badge></h2></Col>
                    <Col md={3}><h2><Badge variant="success">Healthy Patients<br></br><br></br>{this.state.deviceCount}<br></br><br></br><h6><a>more info</a></h6></Badge></h2></Col>
                </Row>
                <Row className='text-stats-panel'>

                    <Col><HighchartsReact highcharts={Highcharts} options={lineAlloc} /></Col>
                    {/* <Col sm={5}><HighchartsReact highcharts={Highcharts} options={ResourcePie} /></Col> */}

                </Row>
            </Container>
        );
    }
}
export default HealthCareDashboard;