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
            providerName: this.props.match.params.providerName,
            image: '/images/a1.jpg' || '',
            healthcarelist: {
                _id: "5f73f2e05803b7c3928a5110",
                type: "Cardiologist",
                available: 20,
                totalCount: 100,
                healthcareProvider: "care",
                owner: "deeps4@gmail.com",
                createdDate: "2020-10-10",
                __v: 0
            }
        }
        this.imageHandler = this.imageHandler.bind(this);
    }
    imageHandler = (e) => {
        console.log("inside image handler")
        switch (e.target.value) {
            case ('Ambulance'):
                this.setState({
                    image: '/images/a1.jpg'
                })
                break;
            case ('Medical Prescription'):
                this.setState({
                    image: '/images/a2.jpg'
                })
                break;
            case ('Equipment'):
                this.setState({
                    image: '/images/a4.jpg'
                })
                break;
            case ('Monitoring'):
                this.setState({
                    image: '/images/a3.jpg'
                })
                break;
            case ('Cardiologist'):
                this.setState({
                    image: '/images/8.jpg'
                })
                break;
        }
    }
    async componentDidMount() {
        try {
            const authToken = cookie.load('cookie') || '';
            if (authToken) {
                //http://localhost:3001/api/v1/resource/all?healthcareProvider=apollo
                const response = await fetch(`/api/v1/resource/all`, {
                    method: 'get',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': authToken
                    },
                });
                if (response.status === 200) {
                    // const body = await response.json();
                    const body = {
                        _id: "5f73f2e05803b7c3928a5110",
                        type: "Monitoring",
                        available: 20,
                        totalCount: 100,
                        healthcareProvider: "care",
                        owner: "deeps4@gmail.com",
                        createdDate: "2020-10-10",
                        __v: 0,
                        image: '/images/a3.jpg'
                    }
                    if (body) {
                        this.setState({
                            healthcarelist: body
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
                    {this.state.authFlag && this.state.usergroup === 'Patient' ? <Redirect to="/patientdash" /> : this.state.authFlag && this.state.usergroup === 'Healthcare' ? <Redirect to="/healthdash" /> : this.state.authFlag && this.state.usergroup === 'Admin' ? <Redirect to="/admindash" /> : ""}
                    <h2><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />Allocate Resources</h2>
                    <Form onSubmit={this.submitLogin}>
                        {/* <Row>
                            <Col md={2}>
                                <figure className="recipe-image"><img src={this.state.image} alt="Resource Image" /></figure>
                            </Col>
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
                            <Col md={1}><button type="button" className="btn btn-info">-</button></Col>
                            <Col md={2}><Form.Control name="allocated" type="number" placeholder="allocated" required /></Col>
                            <Col md={1}><button type="button" className="btn btn-info" >+</button></Col>
                        </Row> */}
                        {/* <Button variant="success" type="submit" style={{ marginRight: "2vw" }}>Allocate</Button> */}
                    </Form>
                    <Container className="recipes-list">
                        <article className="recipe">
                            <figure className="recipe-image"><img src={this.state.healthcarelist.image} alt="Resource Icon" /></figure>
                            <div className="recipe-detail">
                                <h3 className="recipe-title"><b>Provider Name</b> {this.state.healthcarelist.healthcareProvider}</h3>
                                <h5><b>Resource Type</b> {this.state.healthcarelist.type}</h5>
                                <div className="recipe-meta" >
                                    <span className="time"><img src="/images/tag-1.png" />Total Count {this.state.healthcarelist.totalCount}</span>
                                    <span className="time"><img src="/images/tag.png" />Available {this.state.healthcarelist.available}</span>
                                    <span className="time" ><img src="/images/icon-pie-chart@2x.png" />Last Updated Date {this.state.healthcarelist.createdDate}
                                        <input style={{ width: "100px" }} type="number" onChange="" min="1" defaultValue="1" />
                                    </span>
                                    <span className="contact-form" >
                                        <input type="button" className="btn btn-info" value="Update Resources" style={{ marginTop: "5px" }} />
                                    </span>
                                </div>
                            </div>
                        </article>
                    </Container>
                    <Container className="recipes-list">
                        <article className="recipe">
                            <figure className="recipe-image"><img src='/images/a4.jpg' alt="Resource Icon" /></figure>
                            <div className="recipe-detail">
                                <h3 className="recipe-title"><b>Provider Name</b> {this.state.healthcarelist.healthcareProvider}</h3>
                                <h5><b>Resource Type</b> Monitoring</h5>
                                <div className="recipe-meta" >
                                    <span className="time"><img src="/images/tag-1.png" />Total Count {this.state.healthcarelist.totalCount}</span>
                                    <span className="time"><img src="/images/tag.png" />Available {this.state.healthcarelist.available}</span>
                                    <span className="time" ><img src="/images/icon-pie-chart@2x.png" />Last Updated Date {this.state.healthcarelist.createdDate}
                                        <input style={{ width: "100px" }} type="number" onChange="" min="1" defaultValue="1" />
                                    </span>
                                    <span className="contact-form" >
                                        <input type="button" className="btn btn-info" value="Update Resources" style={{ marginTop: "5px" }} />
                                    </span>
                                </div>
                            </div>
                        </article>
                    </Container>
                    <p>{this.state.msg}</p>
                </Container>
            </Container>
        );
    }
}
export default Resource;