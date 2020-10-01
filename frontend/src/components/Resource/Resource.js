import React, { Component } from 'react';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Redirect } from 'react-router-dom';
import './Resource.css'
import cookie from 'react-cookies';

class Resource extends Component {

    constructor(props) {
        super(props);
        this.state = {

            msg: '',
            authFlag: cookie.load('cookie') || false,

        }

        this.submitLogin = this.submitLogin.bind(this);

    }

    async componentDidMount() {
        try {

            const authToken = cookie.load('cookie') || '';
            if (authToken) {
                const data = {
                    "type": "ambulance",
                    "healthcareProvider": "apollo"
                }
                console.log("inside component did mount")
                const response = await fetch(`/api/v1/resource/getAvailability`, {
                    method: 'get',
                    mode: "cors",
                    redirect: 'follow',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': authToken
                    },
                    body: JSON.stringify.data
                });

                if (response.status === 200) {

                    const body = await response.json();
                    if (body) {
                        console.log("within body", body);

                    }
                }
            }
            else
                this.setState({ message: "Session expired login to continue" });
        } catch (e) {
            this.setState({ message: e.message || e });
        }
    }

    submitLogin = (e) => {
        const sleep = msec => new Promise(r => setTimeout(r, msec));
        e.preventDefault();
        const data = {
            emailId: this.state.username,
            password: this.state.password
        }
        fetch('/api/v1/users/login', {
            method: 'post',
            mode: "cors",
            redirect: 'follow',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(async function (response) {
            const body = await response.json();
            return { status: response.status, body };
        }).then(async response => {
            await sleep(2000);
            if (response.status === 200) {
                const { userGroup: usergroup } = JSON.parse(window.atob(cookie.load('cookie').split('.')[1]));
                this.setState({
                    authFlag: true,
                    token: response.body.token,
                    usergroup
                });
                this.loginHandler(); // update parent component login state
            } else {
                this.setState({
                    authFlag: false,
                    msg: "Invalid Credentials"
                })
            }
        }).catch(async err => {
            await sleep(2000);
            console.log(err)
        });
    }

    render() {
        return (
            <Container className="parlex-back-resource" >
                {this.state.authFlag && this.state.usergroup === 'Patient' ? <Redirect to="/patientdash" /> : this.state.authFlag && this.state.usergroup === 'Healthcare' ? <Redirect to="/healthdash" /> : this.state.authFlag && this.state.usergroup === 'Admin' ? <Redirect to="/admindash" /> : ""}
                <h2><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />Allocate Resources</h2>

                <Container className="resource-row" >
                    <Form onSubmit={this.submitLogin}>
                        <Row>
                            <Col md={3}>
                                <Form.Control name="provider" as="select" required>
                                    <option>AL</option>
                                    <option>AK</option>
                                    <option>AZ</option>
                                </Form.Control>
                            </Col>
                            <Col md={3}>
                                <Form.Control name="provider" as="select" required>
                                    <option>AL</option>
                                    <option>AK</option>
                                    <option>AZ</option>
                                </Form.Control>
                            </Col>
                            <Col md={3}>
                                <Form.Control name="allocated" type="number" placeholder="allocated" required />
                            </Col>
                        </Row>
                        <Button variant="info" type="submit" style={{ marginRight: "2vw" }}>Allocate</Button>
                    </Form>
                </Container>
                <p>{this.state.msg}</p>
            </Container>
        );
    }
}
export default Resource;