import React, { Component } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Redirect } from 'react-router-dom';
import './Profile.css'
import cookie from 'react-cookies';

class AdminProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            authToken: cookie.load('cookie') || false,
            firstName: "",
            lastName: "",
            emailId: "",
            password: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            phone: ""
        };
    }
    async componentDidMount() {
        try {
            this.setState({
                authToken: cookie.load('cookie') || false
            })

            if (this.state.authToken) {
                const { emailId } = JSON.parse(window.atob(this.state.authToken.split('.')[1]));
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
                            phone: body.phone,
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
    onSubmit = async e => {
        e.preventDefault();
        const { firstname, lastname, password, phoneNumber, address, city, state, zipcode } = e.target.elements;
        //send only changed values to backend
        const person = {
            firstName: firstname.value !== this.state.firstName ? firstname.value : undefined,
            lastName: lastname.value && lastname.value !== this.state.lastName ? lastname.value : undefined,
            emailId: this.state.emailId,
            password: password.value && password.value !== this.state.password ? password.value : undefined,
            address: address.value && address.value !== this.state.address ? address.value : undefined,
            city: city.value && city.value !== this.state.city ? city.value : undefined,
            state: state.value && state.value !== this.state.state ? state.value : undefined,
            zip: zipcode.value && zipcode.value !== this.state.zip ? zipcode.value : undefined,
            phone: phoneNumber.value && phoneNumber.value !== this.state.phone ? phoneNumber.value : undefined,
        };

        const sleep = msec => new Promise(r => setTimeout(r, msec));
        try {
            const response = await fetch('/api/v1/users/profile', {
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
            if (response.status === 200) {
                this.setState({ message: response.status === 201 ? 'profile updated successfully! please login to continue...' : body.message });
            }
        } catch (e) {
            await sleep(2000);
            this.setState({ message: e.message || e });
        }
    };
    render() {
        return (
            <Container className="parlex-back-signup">
                {this.state.authToken === false ? <Redirect to="/login" /> : ""}
                <h2><FontAwesomeIcon icon={faHeartbeat} size="1x" />  Admin Profile</h2>
                <Container style={{ width: "85%", margin: "0 auto" }}>
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        <Form.Group as={Row} className="signup-row" controlId="nameid">
                            <Form.Label column md="2">First Name</Form.Label>
                            <Col md={4}><Form.Control name="firstname" type="text" defaultValue={this.state.firstName} autoFocus /></Col>
                            <Form.Label column md="2">Last Name</Form.Label>
                            <Col md={4}><Form.Control name="lastname" type="text" defaultValue={this.state.lastName} /></Col>
                        </Form.Group>
                        <Form.Group as={Row} className="signup-row" controlId="emailid">
                            <Form.Label column md="2">Email ID</Form.Label>
                            <Col md={4}><Form.Control name="email" type="email" defaultValue={this.state.emailId} readOnly /></Col>
                            <Form.Label column md="2">Password</Form.Label>
                            <Col md={4}><Form.Control name="password" placeholder="<unchanged>" type="password" /></Col>
                        </Form.Group>
                        <Form.Group as={Row} className="signup-row" controlId="addressid">
                            <Form.Label column md="2">Address</Form.Label>
                            <Col md={4}><Form.Control name="address" type="text" defaultValue={this.state.address} /></Col>
                            <Form.Label column md="2">City</Form.Label>
                            <Col md={4}> <Form.Control name="city" type="text" defaultValue={this.state.city} /></Col>
                        </Form.Group>
                        <Form.Group as={Row} className="signup-row" controlId="stateid">
                            <Form.Label column md="2">State</Form.Label>
                            <Col md={4}> <Form.Control name="state" value={this.state.state} as="select" >
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
                            </Form.Control></Col>
                            <Form.Label column md="2">Zip Code</Form.Label>
                            <Col md={4}> <Form.Control name="zipcode" inputMode="numeric" defaultValue={this.state.zip} /></Col>
                        </Form.Group>
                        <Form.Group as={Row} className="signup-row" controlId="contactid">
                            <Form.Label column md="2">Phone Number</Form.Label>
                            <Col md={4}> <Form.Control name="phoneNumber" type="tel" defaultValue={this.state.phone} /></Col>
                        </Form.Group>
                        <Button variant="info" type="submit" style={{ marginRight: "3vw" }}>Update</Button>
                        <pre>{this.state.message}</pre>
                    </Form>
                </Container>
            </Container>
        );
    }
}
export default AdminProfile;