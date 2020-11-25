import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import './ActivePatient.css'
import cookie from 'react-cookies';


class ActivePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            authFlag: cookie.load('cookie') || false,
            riskStatus: props.match.params.riskStatus,
            image: '/images/a2.jpg' || '',
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

            this.setState(
                {
                    authToken: cookie.load('cookie') || false
                },
                async () => {
                    if (this.state.authToken) {
                        //check usergroup if healthcare provider then add query parama
                        const { userGroup, emailId } = JSON.parse(window.atob(this.state.authToken.split('.')[1]));
                        let response;
                        console.log("userGroup", userGroup);
                        if (userGroup === "Healthcare") {

                            // get the healthcareprovider name to add in query params
                            console.log("healthcare provider email", emailId);

                            //call health care provider
                            if (emailId) {
                                //get healthcare provider from /profile
                                const healthResponse = await fetch(`/api/v1/users/profile?emailId=${emailId}`, {
                                    method: 'get',
                                    mode: "cors",
                                    redirect: 'follow',
                                    headers: {
                                        'content-type': 'application/json',
                                        'Authorization': this.state.authToken
                                    },
                                });
                                if (healthResponse.status === 200) {
                                    const body = await healthResponse.json();
                                    if (body) {
                                        this.setState({
                                            healthCareProvider: body.healthCareProvider
                                        });
                                    }
                                }
                            }

                            response = await fetch(`/api/v1/patient/morePatientInfo?healthcareProvider=${this.state.healthCareProvider}`, {
                                method: 'get',
                                mode: "cors",
                                redirect: 'follow',
                                headers: {
                                    'content-type': 'application/json',
                                    'Authorization': this.state.authToken
                                },
                            });
                        } else if (userGroup === "Admin") {
                            response = await fetch(`/api/v1/patient/morePatientInfo`, {
                                method: 'get',
                                mode: "cors",
                                redirect: 'follow',
                                headers: {
                                    'content-type': 'application/json',
                                    'Authorization': this.state.authToken
                                },
                            });
                        }

                        if (response.status === 200) {
                            const patientList = await response.json();
                            console.log("risk status", this.state.riskStatus);
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
                            let patientDetailsArr = [];
                            if (patientList && Array.isArray(patientList)) {
                                if (this.state.riskStatus === "all") {
                                    patientDetailsArr = patientList;
                                }
                                else {
                                    patientDetailsArr = patientList.filter(ob => this.state.currRisk === ob.currRiskStatus);
                                }
                                console.log("response patient details", this.state.patientDetails);

                                patientDetailsArr.forEach(patient => {
                                    switch (patient.currRiskStatus) {
                                        case 0:
                                            patient.riskString = "Healthy";
                                            break;
                                        case 1:
                                            patient.riskString = "Low";
                                            break;
                                        case 2:
                                            patient.riskString = "Medium";
                                            break;
                                        case 3:
                                            patient.riskString = "High";
                                            break;
                                        default:
                                    }
                                })
                                this.setState({
                                    patientDetails: patientDetailsArr
                                })
                            }
                        }
                    }
                    else
                        this.setState({ message: "Session expired login to continue" });
                }
            );

        } catch (e) {
            this.setState({ message: e.message || e });
        }
    }
    render() {
        return (
            <Container className="back-resource" >
                <Container className="resource-row">
                    <h2 ><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />Actively Monitored Patients</h2>
                    {Array.isArray(this.state.patientDetails) ? (
                        this.state.patientDetails.map((ob, index) => (
                            <Container className="recipes-list" key={index}>
                                <article className="recipe">
                                    <figure className="recipe-image"><img src="/images/photo-3.jpg" alt="Resource Icon" /></figure>
                                    <div className="recipe-detail">
                                        <h3 className="recipe-title"><Link to={`/activepatientdetails/${ob.emailId}`}><b> {ob.firstName} {ob.lastName}</b></Link></h3>
                                        <h5><b>Risk Prediction</b> {ob.riskString}</h5>
                                        <div className="recipe-meta" >
                                            <span className="time"><img src="/images/icon-envelope.png" alt="email" />Email {ob.emailId}</span>
                                            <span className="time"><img src="/images/icon-phone.png" alt="contact" />Contact Number {ob.phone}</span>
                                            <span className="time"><img src="/images/icon-pie-chart.png" alt="gender" />Gender {ob.gender}</span>
                                            <span className="time"><img src="/images/icon-pie-chart.png" alt="age" />Age {ob.age}</span>
                                        </div>
                                    </div>
                                </article>
                            </Container>
                        ))
                    ) : null}
                </Container>
                <p>{this.state.message}</p>
            </Container >
        );
    }
}
export default ActivePatient;