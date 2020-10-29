import React, { Component } from 'react';
import { Form, Button, Container, Row, Col, ButtonGroup } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Redirect } from 'react-router-dom';
import './Signup.css'
import cookie from 'react-cookies';

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isHealthCareProvider: false,
            userGroup: '',
            message: '',
            isLogin: cookie.load('cookie') || "",
        };
    }

    onClickHealthCareProviderCheckbox() {
        this.setState({
            // isHealthCareProvider: !this.state.isHealthCareProvider,
            userGroup: "Healthcare"
        });
    }
    onClickPatientCheckbox() {
        this.setState({
            userGroup: "Patient"
        });
    }
    onClickAdminCheckbox() {
        this.setState({
            userGroup: "Admin"
        });
    }

    onSubmit = async e => {
        e.preventDefault();
        const { firstname, lastname, email, password, age, phoneNumber, emergencyContact, gender, address, city, state, zipcode, providerName } = e.target.elements;
        const person = {
            firstName: firstname.value,
            lastName: lastname.value,
            emailId: email.value,
            password: password.value,
            address: address.value,
            city: city.value,
            state: state.value,
            zip: zipcode.value,

            userGroup: this.state.userGroup,
            ...(
                this.state.userGroup === "Healthcare" ?
                    {
                        healthCareProvider: providerName.value
                    } : this.state.userGroup === "Patient" ?
                        {
                            gender: gender.value,
                            phone: phoneNumber.value,
                            age: age.value,
                            emergencyContact: emergencyContact.value,
                        } : this.state.userGroup === "Admin" ?
                            {
                                phone: phoneNumber.value
                            } : {}
            )
        };
        const sleep = msec => new Promise(r => setTimeout(r, msec));
        try {
            const response = await fetch('/api/v1/users/signup', {
                method: 'post',
                mode: "cors",
                redirect: 'follow',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(person)
            });
            const body = await response.json();
            console.log(body);
            await sleep(2000);
            if (response.status === 201) {
                this.setState({ message: response.status === 201 ? 'account created successfully! please login to continue...' : body.message });
            } else this.setState({ message: body.errmsg })
        } catch (e) {
            await sleep(2000);
            this.setState({ message: e.message || e });
        }
    };

    render() {
        return (
            <Container className="parlex-back-signup">
                {this.state.isLogin ? <Redirect to="/patientdash" /> : ""}
                <h2><FontAwesomeIcon icon={faHeartbeat} size="1x" />  Create Account</h2>
                <Row style={{ width: "20%", margin: "0 auto", marginTop: "2vh", marginBottom: "2vh" }}>
                    <ButtonGroup aria-label="Basic example" >
                        <Button variant="info" data-toggle="button" onClick={this.onClickPatientCheckbox.bind(this)}>Patient</Button>
                        <Button variant="info" data-toggle="button" onClick={this.onClickHealthCareProviderCheckbox.bind(this)}>Healthcare</Button>
                        <Button variant="info" data-toggle="button" onClick={this.onClickAdminCheckbox.bind(this)}>Admin</Button>
                    </ButtonGroup>
                </Row>
                <Container style={{ width: "80%", margin: "0 auto" }}>
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        <Row className="signup-row">
                            <Col md={6}>
                                <Form.Control name="firstname" type="text" placeholder="First Name" autofocus required />
                            </Col>
                            <Col md={6}>
                                <Form.Control name="lastname" type="text" placeholder="Last Name" required />
                            </Col>
                        </Row>
                        <Row className="signup-row">
                            <Col md={6}>
                                <Form.Control name="email" type="email" placeholder="Email ID" required />
                            </Col>
                            <Col md={6}>
                                <Form.Control name="password" type="password" placeholder="Password" required />
                            </Col>
                        </Row>
                        <Row className="signup-row">
                            <Col md={5}>
                                <Form.Control name="address" type="text" placeholder="Address" required />
                            </Col>
                            <Col md={3}>
                                <Form.Control name="city" type="text" placeholder="City" required />
                            </Col>
                            <Col md={2}>
                                <Form.Control name="state" as="select" required>
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
                                <Form.Control name="zipcode" type="text" inputmode="numeric" pattern="^(?(^00000(|-0000))|(\d{5}(|-\d{4})))$" placeholder="Zip" required />
                            </Col>
                        </Row>
                        {this.state.userGroup === "Healthcare" ?
                            (
                                <Row>
                                    <Col md={3}></Col>
                                    <Col md={6}>
                                        <Form.Control name="providerName" type="text" placeholder="Provider Name" required />
                                    </Col>
                                    <Col md={3}></Col>
                                </Row>
                            ) : (
                                this.state.userGroup === "Patient" ?
                                    (
                                        <Row className="signup-row">
                                            <Col md={4}>
                                                <Form.Control name="phoneNumber" type="tel" placeholder="Phone Number" />
                                            </Col>
                                            <Col md={4}>
                                                <Form.Control name="emergencyContact" type="tel" placeholder="Emergency Contact" required />
                                            </Col>
                                            <Col md={2}>
                                                <Form.Control name="gender" as="select" required>
                                                    <option>Male</option>
                                                    <option selected>Female</option>
                                                    <option>Other</option>
                                                </Form.Control>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Control name="age" type="number" min="0" max="150" placeholder="Age" required />
                                            </Col>
                                        </Row>
                                    ) :
                                    (
                                        <Row className="signup-row">
                                            <Col md={4}></Col>
                                            <Col md={4}>
                                                <Form.Control name="phoneNumber" type="tel" placeholder="Phone Number" />
                                            </Col>
                                            <Col md={4}></Col>
                                        </Row>
                                    )
                            )
                        }
                        <Button variant="info" type="submit" style={{ marginRight: "3vw" }}>Register</Button>
                        <Link to="/login">Already a member Login here</Link>
                        <pre>{this.state.message}</pre>
                    </Form>
                </Container>
            </Container>
        );
    }
}
export default Signup;