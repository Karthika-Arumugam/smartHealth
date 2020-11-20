import React, { Component } from 'react';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import './ActivePatient.css'
import cookie from 'react-cookies';
import { isArray } from 'highcharts';

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
        try {
            const authToken = cookie.load('cookie') || '';
            if (authToken) {
                // /api/v1/users/profile?emailId=${emailId}
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
            }
            else
                this.setState({ message: "Session expired login to continue" });
        } catch (e) {
            this.setState({ message: e.message || e });
        }
    }
    render() {
        return (
            <Container className="back-resource" >
                <Container className="resource-row">
                    <h2 ><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />Patient Details</h2>

                    <div style={{ width: "20%", height: "auto", margin: "0 auto" }}>

                        <img style={{ imageOrientation: "from-image", width: "13vw", height: "auto", position: "relative" }} src="/images/photo-3.jpg"></img>

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
                    </Container>
                </Container>
                <p>{this.state.message}</p>
            </Container >
        );
    }
}
export default ActivePatientDetails;