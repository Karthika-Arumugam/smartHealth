import React, { Component } from 'react';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Redirect } from 'react-router-dom';
import './Resource.css'
import cookie from 'react-cookies';
import { isArray } from 'highcharts';

class Resource extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            authFlag: cookie.load('cookie') || false,
            providerName: props.match.params.providerName,
            image: '/images/a1.jpg' || '',
            healthcarelist: {}
        }
        this.imageHandler = this.imageHandler.bind(this);
        this.changeQuantity = this.changeQuantity.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.addHandler = this.addHandler.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
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
        // newHealthcareList[index].available = newQty;
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
    addHandler = () => async e => {
        e.preventDefault();
        const { type, provider, count } = e.target.elements;

        if (!type || !provider || !count) {
            console.error("Mandatory info missing to add resource type");
            this.setState({ message: "Mandatory info missing to add resource type" });
            return;
        }
        try {
            const authToken = cookie.load('cookie') || '';
            if (!authToken) {
                this.setState({ message: "Session expired login to continue" });
                return;
            }
            // call /add api to add new resource type
            const { emailId } = JSON.parse(window.atob(authToken.split('.')[1]))
            const d = (new Date().getMonth() + 1) + '-' + (new Date().getDate()) + '-' + (new Date().getFullYear())
            const addResourceObj = {
                type: type.value,
                totalCount: count.value,
                healthcareProvider: provider.value,
                createdDate: d,
                owner: emailId,
                available: count.value

            };
            const response = await fetch(`/api/v1/resource/add`, {
                method: 'post',
                mode: "cors",
                redirect: 'follow',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': authToken
                },
                body: JSON.stringify(addResourceObj)
            });
            const body = await response.json();
            this.setState({ message: body.message });
            this.repaint();
        } catch (e) {
            console.error(e.message || e);
            this.setState({ message: e.message || e });
        }
    }
    updateHandler = (index) => async () => {
        const resourceObj = JSON.parse(JSON.stringify(this.state.healthcarelist[index]));
        const { healthcareProvider, type, available, totalCount } = resourceObj;

        if (!healthcareProvider || !type || !totalCount || !available) {
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
            let delta;
            if (isArray(this.state.deltaObj)) {
                //check for healthcareProvider and type to get the delta value
                const origValues = this.state.deltaObj.find(ob => ob.type == type && ob.healthcareProvider == healthcareProvider)
                delta = Number(totalCount - origValues['totalCount']);
            }
            const updateResourceObj = { type, healthcareProvider, totalCount, available, delta };
            const response = await fetch('/api/v1/resource/update', {
                method: 'post',
                mode: "cors",
                redirect: 'follow',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(updateResourceObj)
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
    searchHandler = async e => {
        e.preventDefault();
        const provider = e.target.elements.searchText.value;
        try {
            const authToken = cookie.load('cookie') || '';
            if (authToken) {
                const response = await fetch(`/api/v1/resource/all?healthcareProvider=${provider}`, {
                    method: 'get',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': authToken
                    },
                });
                if (response.status === 200) {
                    const body = await response.json();
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
                    {this.state.authFlag && this.state.usergroup === 'Patient' ? <Redirect to="/patientdash" /> : this.state.authFlag && this.state.usergroup === 'Healthcare' ? <Redirect to="/healthdash" /> : this.state.authFlag && this.state.usergroup === 'Admin' ? <Redirect to="/admindash" /> : ""}
                    <h2><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />Resources</h2>
                    <Form onSubmit={this.searchHandler.bind(this)}>
                        <Container className="recipes-list">
                            <span className="recipe-title" >
                                <input type="text" name="searchText" placeholder="Search Health Care Provider" style={{ width: "50%", height: "50px", margin: "10px" }} required autoFocus />
                                <input type="submit" className="btn btn-info btn-lg" value="Search" style={{ margin: "5px" }} />
                            </span>
                        </Container>
                    </Form>
                    {Array.isArray(this.state.healthcarelist) ? (
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
                    <Container className="recipes-list" >
                        <h4 style={{ marginTop: "5vh" }} >Add New Resource Type</h4>
                        <Form onSubmit={this.addHandler()}>
                            <Row style={{ padding: "50px" }}>
                                <Col md={2}>
                                    <figure className="recipe-image"><img src={this.state.image} alt="Resource Type" /></figure>
                                </Col>
                                <Col md={2}>
                                    <Form.Control type="text" name="provider" placeholder={this.state.providerName} required>

                                    </Form.Control>
                                </Col>
                                <Col md={3}>
                                    <Form.Control name="type" as="select" onChange={this.imageHandler} required>
                                        <option>Ambulance</option>
                                        <option>Medical Prescription</option>
                                        <option>Monitoring</option>
                                        <option>Cardiologist</option>
                                        <option>Equipment</option>
                                    </Form.Control>
                                </Col>
                                <Col md={3}><Form.Control name="count" type="number" min="1" required /></Col>
                                <Col md={2}><Button variant="success" type="submit" style={{ marginRight: "2vw" }}>Add</Button></Col>
                            </Row>
                        </Form>
                    </Container>
                </Container>
                <p>{this.state.message}</p>
            </Container>
        );
    }
}
export default Resource;