import React, { Component } from 'react';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Redirect } from 'react-router-dom';
import './Resource.css'
import cookie from 'react-cookies';

class Resource extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            authFlag: cookie.load('cookie') || false,
            providerName: props.match.params.providerName,
            image: '/images/a1.jpg' || '',
            healthcarelist: {}
        }
        this.imageHandler = this.imageHandler.bind(this);
        this.changeQuantity = this.changeQuantity.bind(this);

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
    changeQuantity = () => async e => {

        console.log(e.target.value);
        const num = this.state.healthcarelist.totalCount + parseInt(e.target.value, 10);
        const num1 = this.state.healthcarelist.available + parseInt(e.target.value, 10);
        const newHealthcareList = this.state.healthcarelist;
        newHealthcareList.totalCount = num;
        newHealthcareList.available = num1;
        this.setState({ healthcarelist: newHealthcareList });
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
    searchHandler = async e => {
        e.preventDefault();
        console.log("value", e.target.elements);
    }

    render() {
        return (
            <Container className="back-resource" >
                <Container className="resource-row">
                    {this.state.authFlag && this.state.usergroup === 'Patient' ? <Redirect to="/patientdash" /> : this.state.authFlag && this.state.usergroup === 'Healthcare' ? <Redirect to="/healthdash" /> : this.state.authFlag && this.state.usergroup === 'Admin' ? <Redirect to="/admindash" /> : ""}
                    <h2><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />Resources</h2>
                    <Form onSubmit={this.searchHandler.bind(this)}>
                        <Container className="recipes-list">
                            <span className="recipe-title" >
                                <input type="text" placeholder="Search Health Care Provider" style={{ width: "50%", height: "50px", margin: "10px" }} />
                                <input type="submit" className="btn btn-info btn-lg" value="Search" style={{ margin: "5px" }} />
                            </span>
                        </Container>
                    </Form>
                    {Array.isArray(this.state.healthcarelist) ? (
                        this.state.healthcarelist.map(ob => (
                            <Container className="recipes-list">
                                <article className="recipe">
                                    <figure className="recipe-image"><img src={this.imageHandler(ob.type)} alt="Resource Icon" /></figure>
                                    <div className="recipe-detail">
                                        <h3 className="recipe-title"><b>Provider Name</b> {ob.healthcareProvider}</h3>
                                        <h5><b>Type</b> {ob.type}</h5>
                                        <div className="recipe-meta" >
                                            <span className="time"><img src="/images/tag-1.png" alt="Total" />Total Count {ob.totalCount}</span>
                                            <span className="time"><img src="/images/tag.png" alt="Available" />Available {ob.available}</span>
                                            <span className="time"><img src="/images/icon-pie-chart@2x.png" alt="Date" />Last Updated {new Date(ob.createdDate).toLocaleDateString()}
                                                <input style={{ width: "100px", marginLeft: "10px" }} type="number" onChange={this.changeQuantity()} min="0" defaultValue="0" />
                                            </span>
                                            <span className="contact-form" >
                                                <input type="button" className="btn btn-info" value="Update" style={{ margin: "5px" }} />
                                            </span>
                                            <span className="contact-form" >
                                                <input type="button" className="btn btn-danger" value="Delete" style={{ margin: "5px" }} />
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Container>
                        ))
                    ) : null}
                    {/* <Container className="recipes-list">
                        <article className="recipe">
                            <figure className="recipe-image"><img src={this.state.healthcarelist.image} alt="Resource Icon" /></figure>
                            <div className="recipe-detail">
                                <h3 className="recipe-title"><b>Provider Name</b> {this.state.healthcarelist.healthcareProvider}</h3>
                                <h5><b>Resource Type</b> {this.state.healthcarelist.type}</h5>
                                <div className="recipe-meta" >
                                    <span className="time"><img src="/images/tag-1.png" />Total Count {this.state.healthcarelist.totalCount}</span>
                                    <span className="time"><img src="/images/tag.png" />Available {this.state.healthcarelist.available}</span>
                                    <span className="time" ><img src="/images/icon-pie-chart@2x.png" />Last Updated Date {this.state.healthcarelist.createdDate}
                                        <input style={{ width: "100px" }} type="number" onChange={this.changeQuantity()} min="0" defaultValue="0" />
                                    </span>
                                    <span className="contact-form" >
                                        <input type="button" className="btn btn-info" value="Update Resources" style={{ marginTop: "5px" }} />
                                    </span>
                                </div>
                            </div>
                        </article>
                    </Container> */}
                    {/* <Container className="recipes-list">
                        <article className="recipe">
                            <figure className="recipe-image"><img src='/images/a4.jpg' alt="Resource Icon" /></figure>
                            <div className="recipe-detail">
                                <h3 className="recipe-title"><b>Provider Name</b> {this.state.healthcarelist.healthcareProvider}</h3>
                                <h5><b>Resource Type</b> Ambulance</h5>
                                <div className="recipe-meta" >
                                    <span className="time"><img src="/images/tag-1.png" />Total Count {this.state.healthcarelist.totalCount}</span>
                                    <span className="time"><img src="/images/tag.png" />Available {this.state.healthcarelist.available}</span>
                                    <span className="time" ><img src="/images/icon-pie-chart@2x.png" />Last Updated Date {this.state.healthcarelist.createdDate}
                                        <input style={{ width: "100px" }} type="number" onChange={this.changeQuantity()} min="0" defaultValue="0" />
                                    </span>
                                    <span className="contact-form" >
                                        <input type="button" className="btn btn-info" value="Update Resources" style={{ marginTop: "5px" }} />
                                    </span>
                                </div>
                            </div>
                        </article>
                    </Container> */}
                    <h4 style={{ marginTop: "5vh" }} >Add New Resource Type</h4>
                    <Form onSubmit={this.submitLogin}>
                        <Row style={{ padding: "50px" }}>
                            {/* <Col md={2}>
                                <figure className="recipe-image"><img src={this.state.image} alt="Resource Image" /></figure>
                            </Col> */}
                            <Col md={3}>
                                <Form.Control name="provider" as="select" required>
                                    <option>{this.state.providerName}</option>
                                </Form.Control>
                            </Col>
                            <Col md={3}>
                                <Form.Control name="provider" as="select" onChange={this.imageHandler} required>
                                    <option>Ambulance</option>
                                    <option>Medical Prescription</option>
                                    <option>Monitoring</option>
                                    <option>Cardiologist</option>
                                    <option>Equipment</option>
                                </Form.Control>
                            </Col>
                            <Col md={3}><Form.Control name="allocated" type="number" placeholder="allocated" required /></Col>
                            <Col md={2}><Button variant="success" type="submit" style={{ marginRight: "2vw" }}>Allocate</Button></Col>
                        </Row>
                    </Form>
                    <p>{this.state.msg}</p>
                </Container>
            </Container>
        );
    }
}
export default Resource;