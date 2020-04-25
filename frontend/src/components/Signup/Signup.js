import React, { Component } from 'react';
import { Form, Button, Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import './Signup.css'


class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isHealthCareProvider: false,
            message: ''
        };
        this.firstnameRef = React.createRef();
        this.lastnameRef = React.createRef();
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.phoneRef = React.createRef();
        this.ageRef = React.createRef();
        this.addRef = React.createRef();
        this.cityRef = React.createRef();
        this.stateRef = React.createRef();
        this.zipRef = React.createRef();
        this.emerRef = React.createRef();
        this.genderRef = React.createRef();
    }

    onClickHealthCareProviderCheckbox() {
        this.setState({
            isHealthCareProvider: !this.state.isHealthCareProvider
        });
    }

    onSubmit = async e => {
        e.preventDefault();
        const person = {
            firstName: this.firstnameRef.current.value,
            lastName: this.lastnameRef.current.value,
            emailId: this.emailRef.current.value,
            password: this.passwordRef.current.value,
            userGroup: this.state.isHealthCareProvider === true ? 'Healthcare' : 'Patient',
            phone: this.phoneRef.current.value,
            age: this.ageRef.current.value,
            emergencyContact: this.emerRef.current.value,
            address: this.addRef.current.value,
            city: this.cityRef.current.value,
            state: this.stateRef.current.value,
            zip: this.zipRef.current.value,
            genderRef: this.genderRef.current.value

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
            // this.props.toggleSpinner();
            if (response.status === 201) {
                console.log('calling redux signup');
                // this.props.signup(person.email);
            }
            this.setState({ message: response.status === 201 ? 'account created successfully! please login to continue...' : body.message });
        } catch (e) {
            await sleep(2000);
            this.setState({ message: e.message || e });
        }
    };

    render() {
        return (
            <Container className="parlex-back-signup">
                <h2><FontAwesomeIcon icon={faHeartbeat} size="1x" />  Create Account</h2>
                <Row style={{ width: "20%", margin: "0 auto", marginTop: "2vh", marginBottom: "2vh" }}>
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        label="Health Care Provider?"
                        checked={this.state.isHealthCareProvider}
                        onClick={this.onClickHealthCareProviderCheckbox.bind(this)}
                    />
                </Row>
                <Form onSubmit={this.onSubmit.bind(this)}>
                    <Row>
                        <Col><Form.Group>
                            <Form.Control ref={this.firstnameRef} type="text" placeholder="Enter First Name" autofocus required />
                        </Form.Group></Col>
                        <Col><Form.Group>
                            <Form.Control ref={this.lastnameRef} type="text" placeholder="Enter Last Name" required />
                        </Form.Group></Col>
                    </Row>
                    <Row>
                        <Col md={5}><Form.Group>
                            <Form.Control ref={this.emailRef} type="email" placeholder="Enter email" />
                        </Form.Group></Col>
                        <Col md={5}><Form.Group>
                            <Form.Control ref={this.passwordRef} type="password" placeholder="Password" />
                        </Form.Group></Col>
                        <Col md={2}><Form.Group>
                            <Form.Control ref={this.ageRef} type="number" min="1" max="150" placeholder="Select Age" required />
                        </Form.Group></Col>
                    </Row>
                    <Row>
                        <Col><Form.Group>
                            <Form.Control ref={this.phoneRef} type="tel" placeholder="PhoneNumber" />
                        </Form.Group></Col>
                        <Col><Form.Group>
                            <Form.Control ref={this.emerRef} type="tel" placeholder="Emergency Contact" required />
                        </Form.Group>
                        </Col>
                        <Col><Form.Group >
                            <DropdownButton  title="Select Gender"  variant='info'>
                                <Form.Control ref={this.genderRef} />
                                <Dropdown.Item eventKey="1">Male</Dropdown.Item>
                                <Dropdown.Item eventKey="2">Female</Dropdown.Item>
                                <Dropdown.Item eventKey="3">Other</Dropdown.Item>
                            </DropdownButton>
                        </Form.Group></Col>
                    </Row>
                    <Row>
                        <Col md={5}><Form.Group>
                            <Form.Control ref={this.addRef} type="text" placeholder="Enter Address" required />
                        </Form.Group></Col>
                        <Col md={3}><Form.Group>
                            <Form.Control ref={this.cityRef} type="text" placeholder="Enter City" required />
                        </Form.Group></Col>
                        <Col md={2}><Form.Group>
                            <Form.Control ref={this.stateRef} type="text" placeholder="Enter State" required />
                        </Form.Group></Col>
                        <Col md={2}><Form.Group>
                            <Form.Control ref={this.zipRef} type="text" inputmode="numeric" pattern="^(?(^00000(|-0000))|(\d{5}(|-\d{4})))$" placeholder="Enter Zip" required />
                        </Form.Group></Col>
                    </Row>
                    
                    <Button variant="info" type="submit" style={{ marginRight: "3vw" }}>Register</Button>
                    <Link to="/login">Already a member Login here</Link>
                    <pre>{this.state.message}</pre>
                </Form>
            </Container>
        );
    }
}
export default Signup;