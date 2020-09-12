import React, { Component } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Redirect } from 'react-router-dom';
import './Profile.css'
import cookie from 'react-cookies';

class PatientProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSmoker: false,
            message: '',
            isLogin: cookie.load('cookie') || "",
            firstName: "",
            lastName: "",
            emailId: "",
            password: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            emergencyContact: "",
            age: "",
        };
    }
    async componentDidMount() {
        try {
            const authToken = cookie.load('cookie') || '';
            if (authToken) {
                const response = await fetch(`/api/v1/users/profile`, {
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
                        console.log("within body", body);
                        this.setState({
                            firstName: body.firstName,
                            lastName: body.lastName,
                            emailId: body.emailId,
                            password: body.password,
                            address: body.address,
                            city: body.city,
                            state: body.state,
                            zip: body.zip,
                            emergencyContact: body.emergencyContact,
                            phone: body.phone,
                            age: body.age
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
    onClickSmokerCheckbox() {
        this.setState({
            isSmoker: !this.state.isSmoker
        });
    }
    onSubmit = async e => {
    };
    render() {
        return (
            <Container className="parlex-back-signup">
                {this.state.isLogin === false ? <Redirect to="/login" /> : ""}
                <h2><FontAwesomeIcon icon={faHeartbeat} size="1x" />  Patient Profile</h2>

                <Container style={{ width: "80%", margin: "0 auto" }}>
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        <Row className="signup-row">
                            <Col md={6}>
                                <Form.Control name="firstname" type="text" placeholder={this.state.firstName} autoFocus />
                            </Col>
                            <Col md={6}>
                                <Form.Control name="lastname" type="text" placeholder={this.state.lastName} />
                            </Col>
                        </Row>
                        <Row className="signup-row">
                            <Col md={6}>
                                <Form.Control name="email" type="email" placeholder={this.state.emailId} readOnly />
                            </Col>
                            <Col md={6}>
                                <Form.Control name="password" type="password" />
                            </Col>
                        </Row>
                        <Row className="signup-row">
                            <Col md={5}>
                                <Form.Control name="address" type="text" placeholder={this.state.address} />
                            </Col>
                            <Col md={3}>
                                <Form.Control name="city" type="text" placeholder={this.state.city} />
                            </Col>
                            <Col md={2}>
                                <Form.Control name="state" value={this.state.state} as="select" >
                                    <option>AL</option>
                                    <option>AK</option>
                                    <option>AZ</option>
                                    <option>AR</option>
                                    <option>CA</option>
                                    <option>CO</option>
                                    <option>CT</option>
                                    <option>DE</option>
                                    <option>DC</option>
                                    <option>FL</option>
                                    <option>GA</option>
                                    <option>HI</option>
                                    <option>ID</option>
                                    <option>IL</option>
                                    <option>IN</option>
                                    <option>IA</option>
                                    <option>KS</option>
                                    <option>KY</option>
                                    <option>LA</option>
                                    <option>ME</option>
                                    <option>MD</option>
                                    <option>MA</option>
                                    <option>MI</option>
                                    <option>MN</option>
                                    <option>MS</option>
                                    <option>MO</option>
                                    <option>MT</option>
                                    <option>NE</option>
                                    <option>NV</option>
                                    <option>NH</option>
                                    <option>NJ</option>
                                    <option>NM</option>
                                    <option>NY</option>
                                    <option>NC</option>
                                    <option>ND</option>
                                    <option>OH</option>
                                    <option>OK</option>
                                    <option>OR</option>
                                    <option>PA</option>
                                    <option>RI</option>
                                    <option>SC</option>
                                    <option>SD</option>
                                    <option>TN</option>
                                    <option>TX</option>
                                    <option>UT</option>
                                    <option>VT</option>
                                    <option>VA</option>
                                    <option>WA</option>
                                    <option>WV</option>
                                    <option>WI</option>
                                    <option>WY</option>
                                </Form.Control>
                            </Col>
                            <Col md={2}>
                                <Form.Control name="zipcode" inputMode="numeric" pattern="^(?(^00000(|-0000))|(\d{5}(|-\d{4})))$" placeholder={this.state.zip} />
                            </Col>
                        </Row>
                        <Row className="signup-row">
                            <Col md={4}>
                                <Form.Control name="phoneNumber" type="tel" placeholder={this.state.phone} />
                            </Col>
                            <Col md={4}>
                                <Form.Control name="emergencyContact" type="tel" placeholder={this.state.emergencyContact} />
                            </Col>
                            <Col md={2}>
                                <Form.Control name="gender" value={this.state.gender} as="select">
                                    <option>Male</option>
                                    <option selected>Female</option>
                                    <option>Other</option>
                                </Form.Control>
                            </Col>
                            <Col md={2}>
                                <Form.Control name="age" type="number" min="0" max="150" placeholder={this.state.age} />
                            </Col>
                        </Row>
                        <Row style={{ width: "20%", margin: "0 auto", marginTop: "2vh", marginBottom: "2vh" }}>
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label="Do you Smoke?"
                                checked={this.state.isSmoker}
                                onClick={this.onClickSmokerCheckbox.bind(this)}
                            />
                        </Row>
                        {this.state.isSmoker ?
                            (<Row>
                                <Col md={3}></Col>
                                <Col md={3}>
                                    <Form.Control name="cigsperday" type="number" min="1" max="50" placeholder="Cigarates per day" />
                                </Col>
                                <Col md={3}>
                                    <Form.Control name="smokeyears" type="number" min="1" max="50" placeholder="Smoking years" />
                                </Col>
                                <Col md={3}></Col>
                            </Row>) : <Row></Row>
                        }
                        <Button variant="info" type="submit" style={{ marginRight: "3vw" }}>Update</Button>
                        <pre>{this.state.message}</pre>
                    </Form>
                </Container>
            </Container>
        );
    }
}
export default PatientProfile;