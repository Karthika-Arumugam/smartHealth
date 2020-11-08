import React, { Component } from 'react';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import './ActivePatient.css'
import cookie from 'react-cookies';
import { isArray } from 'highcharts';

class Resource extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            authFlag: cookie.load('cookie') || false,
            providerName: props.match.params.providerName,
            image: '/images/a2.jpg' || '',
            healthcarelist: {}
        }
        this.imageHandler = this.imageHandler.bind(this);
        this.changeQuantity = this.changeQuantity.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.repaint = this.repaint.bind(this);
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
    changeQuantity = (index) => async e => {
        const newQty = parseInt(e.target.value);
        const newHealthcareList = JSON.parse(JSON.stringify(this.state.healthcarelist));
        newHealthcareList[index].totalCount = newQty;
        newHealthcareList[index].quantity = newQty;
        this.setState({ healthcarelist: newHealthcareList });
    }
    deleteHandler = (resourceObj) => async e => {
        e.preventDefault();
        if (!resourceObj) {
            this.setState({ message: "Mandatory resource details missing" });
            return;
        }
        const { healthcareProvider, type } = resourceObj;
        if (!healthcareProvider || !type) {
            this.setState({ message: "Mandatory resource details missing" });
            console.error("Mandatory resource details missing");
            return;
        }
        const sleep = msec => new Promise(r => setTimeout(r, msec));
        try {
            const authToken = cookie.load('cookie') || '';
            if (!authToken) {
                this.setState({ message: "Session expired login to continue" });
                console.error("Session expired login to continue");
                return;
            }
            //add to logic to return if usergroup is not admin
            const delResourceObj = {
                type: type,
                healthcareProvider: healthcareProvider
            };
            const response = await fetch('/api/v1/resource/delete', {
                method: 'delete',
                mode: "cors",
                redirect: 'follow',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(delResourceObj)
            });
            const body = await response.json();
            await sleep(2000);
            this.setState({ message: body.message });
            this.repaint();
        } catch (e) {
            console.error(e.message || e);
            this.setState({ message: e.message || e });
        }
    }
    async componentDidMount() {
        try {
            const authToken = cookie.load('cookie') || '';
            if (authToken) {
                const response = await fetch(`/api/v1/resource/all?healthcareProvider=${this.state.providerName}`, {
                    method: 'get',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': authToken
                    },
                });
                if (response.status === 200) {
                    const body1 = await response.json();
                    if (body1 && Array.isArray(body1)) {
                        body1.forEach(ob => ob.quantity = ob.totalCount);
                        this.setState({
                            healthcarelist: body1,
                            deltaObj: body1
                        });
                    }
                }
            }
            else
                this.setState({ message: "Session expired login to continue" });
        } catch (e) {
            this.setState({ message: e.message || e });
        }
    }
    repaint = async () => {

        try {
            const authToken = cookie.load('cookie') || '';
            if (authToken) {
                const response = await fetch(`/api/v1/resource/all?healthcareProvider=${this.state.providerName}`, {
                    method: 'get',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': authToken
                    },
                });
                if (response.status === 200) {
                    const body1 = await response.json();
                    if (body1) {
                        this.setState({
                            healthcarelist: body1
                        });
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
                    <h2 ><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />Actively Monitored Patients</h2>
                    <Container className="recipes-list" >
                        <article className="recipe">
                            <figure className="recipe-image"><img src="/images/photo-3.jpg" alt="Resource Icon" /></figure>
                            <div className="recipe-detail">
                                <h3 className="recipe-title"><Link to="/patientprof"><b>Patient Name</b> Patient Name</Link></h3>
                                <h5><b>Risk Prediction</b> Healthy</h5>
                                <div className="recipe-meta" >
                                    <span className="time"><img src="/images/icon-envelope.png" alt="email" />Email priya@gmail.com</span>
                                    <span className="time"><img src="/images/icon-phone.png" alt="contact" />Contact Number 6691231234</span>
                                    <span className="time"><img src="/images/icon-pie-chart.png" alt="gender" />Gender Female</span>
                                    <span className="time"><img src="/images/icon-pie-chart.png" alt="age" />Age 27</span>
                                    <span className="time"><img src="/images/icon-map-marker-alt.png" alt="address" />Address San Jose</span>
                                </div>
                            </div>
                        </article>
                    </Container>
                    <Container className="recipes-list" >
                        <article className="recipe">
                            <figure className="recipe-image"><img src="/images/photo-4.jpg" alt="Resource Icon" /></figure>
                            <div className="recipe-detail">
                                <h3 className="recipe-title"><b>Patient Name</b> Patient Name</h3>
                                <h5><b>Risk Prediction</b> Healthy</h5>
                                <div className="recipe-meta" >
                                    <span className="time"><img src="/images/icon-envelope.png" alt="email" />Email priya@gmail.com</span>
                                    <span className="time"><img src="/images/icon-phone.png" alt="contact" />Contact Number 6691231234</span>
                                    <span className="time"><img src="/images/icon-pie-chart.png" alt="gender" />Gender Female</span>
                                    <span className="time"><img src="/images/icon-pie-chart.png" alt="age" />Age 27</span>
                                    <span className="time"><img src="/images/icon-map-marker-alt.png" alt="address" />Address San Jose</span>
                                </div>
                            </div>
                        </article>
                    </Container>
                    {/* {Array.isArray(this.state.healthcarelist) ? (
                        this.state.healthcarelist.map((ob, index) => (
                            <Container className="recipes-list" key={index}>
                                <article className="recipe">
                                    <figure className="recipe-image"><img src={this.imageHandler(ob.type)} alt="Resource Icon" /></figure>
                                    <div className="recipe-detail">
                                        <h3 className="recipe-title"><b>Provider Name</b> {ob.healthcareProvider}</h3>
                                        <h5><b>Type</b> {ob.type}</h5>
                                        <div className="recipe-meta" >
                                            <span className="time"><img src="/images/tag-1.png" alt="Total" />Total Count {ob.totalCount}</span>
                                            <span className="time"><img src="/images/tag.png" alt="Available" />Available {ob.available}</span>
                                            <span className="time"><input style={{ width: "100px", marginLeft: "10px" }} type="number" onChange={this.changeQuantity(index)} min={ob.available} defaultValue={ob.quantity} />
                                            </span>
                                            <span className="contact-form" >
                                                <input type="button" className="btn btn-info" onClick={() => this.updateHandler(index)()} value="Update" style={{ margin: "5px" }} />
                                            </span>
                                            <span className="contact-form" >
                                                <input type="button" className="btn btn-danger" onClick={this.deleteHandler(ob)} value="Delete" style={{ margin: "5px" }} />
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Container>
                        ))
                    ) : null} */}
                </Container>
                <p>{this.state.message}</p>
            </Container >
        );
    }
}
export default Resource;