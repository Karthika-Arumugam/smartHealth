import React, { Component } from 'react';
import { Container, Row, Col, Table, Button, Badge } from 'react-bootstrap';
import { faHeartbeat, faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cookie from 'react-cookies';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from "highcharts/highcharts.js";
import { Link } from 'react-router-dom';
import './Dashboard.css';

class HealthCareDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authToken: cookie.load('cookie') || false,
            message: '',
            deviceCount: 0,
            healthCareProvider: '',
            firstName: '',
            lastName: '',
            resources: [],
            high: 0,
            medium: 0,
            low: 0,
            healthy: 0
        }
        this.getResourceCount = this.getResourceCount.bind(this);
    }
    getResourceCount = () => {
        const ambulance = {}, prescription = {}, monitoring = {}, cardiologist = {}, equipment = {};
        //create recource type obj as {10/10/2020:3,10/11/2020:4} date:count
        for (let key of this.state.resources) {
            const datealloc = new Date(key.lastUpdatedAt)
            // const dateString = datealloc.toLocaleDateString()
            let dateString = new Intl.DateTimeFormat().format(datealloc)
            switch (key.resourceType) {
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
                default:
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
        for (let key in monitoring) {
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
            this.setState({
                authToken: cookie.load('cookie') || false
            })
            if (this.state.authToken) {
                const { emailId } = JSON.parse(window.atob(this.state.authToken.split('.')[1]));
                //get healthcare provider from /profile
                const response = await fetch(`/api/v1/users/profile?emailId=${emailId}`, {
                    method: 'get',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': this.state.authToken
                    },
                });
                if (response.status === 200) {
                    const body = await response.json();
                    if (body) {
                        this.setState({
                            firstName: body.firstName,
                            lastName: body.lastName,
                            healthCareProvider: body.healthCareProvider
                        });
                    }
                }
                if (this.state.healthCareProvider) {

                    //call active device counts
                    fetch(`api/v1/patient/activeDeviceCount?healthcareProvider=${this.state.healthCareProvider}`, {
                        method: 'get',
                        mode: "cors",
                        redirect: 'follow',
                        headers: {
                            'content-type': 'application/json'
                        },
                    }).then(async function (response) {
                        const body = await response.json();
                        return { status: response.status, body };
                    }).then(async response => {
                        if (response.status === 200) {
                            console.log("active decive api response ", response.body);
                            this.setState({
                                deviceCount: response.body.activeDeviceCount,
                                high: response.body.high,
                                medium: response.body.medium,
                                low: response.body.low,
                                healthy: response.body.healthy
                            });
                        } else {
                            this.setState({
                                msg: body.message
                            })
                        }
                    }).catch(async err => {
                        console.log(err)
                    });


                    //Resource Type availability Pie Chart
                    const resourcePieChart = await fetch(`/api/v1/resource/availabilityInfo?healthcareProvider=${this.state.healthCareProvider}`, {
                        method: 'get',
                        mode: "cors",
                        redirect: 'follow',
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': this.state.authToken
                        }
                        //add body
                    });
                    const resourcePieRes = await resourcePieChart.json();
                    if (resourcePieRes) {
                        for (let res of resourcePieRes) {

                            switch (res._id) {
                                case ("Cardiologist"):
                                    this.setState({ CardiologistPie: res.availableResourcesCount });
                                    break;
                                case ("Ambulance"):
                                    this.setState({ AmbulancePie: res.availableResourcesCount });
                                    break;
                                case ("Monitoring"):
                                    this.setState({ MonitoringPie: res.availableResourcesCount });
                                    break;
                                case ("Equipment"):
                                    this.setState({ EquipmentPie: res.availableResourcesCount });
                                    break;
                                case ("Medical Prescription"):
                                    this.setState({ PrescriptionPie: res.availableResourcesCount });
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    //Call resource allocation details
                    const response = await fetch(`/api/v1/resourceAllocation/all?healthcareProvider=${this.state.healthCareProvider}`, {
                        method: 'get',
                        mode: "cors",
                        redirect: 'follow',
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': this.state.authToken
                        },
                        //add body
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
                    console.log(this.state.resources)
                    this.getResourceCount();

                }
            } else
                this.setState({ message: "Session expired login to continue" });
        }
        catch (e) {
            console.error(e);
            this.setState({ message: e.message || e });
        }
    }

    render() {
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
        const ResourcePie = {
            chart: {
                type: 'pie',
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
                    ['Ambulance', Number(this.state.AmbulancePie)],
                    ['Cardiologist', Number(this.state.CardiologistPie)],
                    ['Monitoring', Number(this.state.MonitoringPie)],
                    ['Medical Prescription', Number(this.state.PrescriptionPie)],
                    ['Equipment', Number(this.state.EquipmentPie)]
                ]
            }]
        }
        const getTableEntries = () => {
            const xx = [];
            for (let [index, key] of this.state.resources.entries()) {
                if (index < 10) {
                    const datealloc = new Date(key.lastUpdatedAt)
                    let dateString = new Intl.DateTimeFormat(['ban', 'id']).format(datealloc)
                    xx.push(
                        <tr>
                            <td>{key.resourceType}</td>
                            <td>{key.healthcareProvider}</td>
                            <td>{key.patient}</td>
                            <td>{dateString}</td>
                            <td>{key.status}</td>
                            <td><Link to={`/resource/${this.state.healthCareProvider}`}><Button variant="info" >Manage</Button></Link></td>
                        </tr>
                    )
                }
            }
            return xx;
        }
        return (
            <Container>
                <div aria-live="polite" aria-atomic="true" style={{ position: 'relative', minHeight: '100px', }}>
                    <h2 ><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />Health Care Dashboard</h2>
                </div>
                <h3>Today's Patients Stats</h3>
                <Row className='text-stats-panel'>

                    <Col md={3}><h2><Badge variant="secondary">Active Devices <br></br><br></br>{this.state.deviceCount}<br></br><br></br><h6><Link to="/activepatient/all">more info</Link></h6></Badge></h2></Col>
                    <Col md={3}><h2><Badge variant="danger">High Risk Count <br></br><br></br>{this.state.high}<br></br><br></br><h6><Link to="/activepatient/high">more info</Link></h6></Badge></h2></Col>
                    <Col md={3}><h2><Badge variant="warning">Medium Risk Count<br></br><br></br>{this.state.medium}<br></br><br></br><h6><Link to="/activepatient/medium">more info</Link></h6></Badge></h2></Col>
                    <Col md={3}><h2><Badge variant="success">Low Risk Count <br></br><br></br>{this.state.low}<br></br><br></br><h6><Link to="/activepatient/low">more info</Link></h6></Badge></h2></Col>
                </Row>
                <Row >

                    <Col><HighchartsReact highcharts={Highcharts} options={lineAlloc} /></Col>
                    <Col sm={5}><HighchartsReact highcharts={Highcharts} options={ResourcePie} /></Col>

                </Row>
                <div aria-live="polite" aria-atomic="true" style={{ position: 'relative', minHeight: '100px', }}>
                    <h3><FontAwesomeIcon icon={faTable} size="1x" style={{ marginRight: "1vw" }} />Resource Allocation Details</h3>
                </div>
                <Row >
                    <Table striped hover variant="light">
                        <thead>
                            <tr>
                                <th>Resource Type</th>
                                <th>Provider Name</th>
                                <th>Assigned To</th>
                                <th>Assigned Date</th>
                                <th>Status</th>
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
export default HealthCareDashboard;