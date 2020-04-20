import React, { Component } from 'react';
import { Form, Button, Container, Row } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import './Signup.css'


class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isHealthCareProvider: false
        };
    }

    onClickHealthCareProviderCheckbox() {
        this.setState({
            isHealthCareProvider: !this.state.isHealthCareProvider
        });
    }

    render() {
        return (
            <Container className="parlex-back-signup"  >
                <h2 ><FontAwesomeIcon icon={faHeartbeat} size="1x" />  Create Account</h2>
                <Row style={{ width: "20%", margin: "0 auto", marginTop: "2vh", marginBottom: "2vh" }}>
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        label="Health Care Provider?"
                        checked={this.state.isHealthCareProvider}
                        onClick={this.onClickHealthCareProviderCheckbox.bind(this)}
                    />
                </Row>
                <Form >
                    <Row>
                        <Form.Group style={{ width: "25%" }} controlId="formGroupFname" >
                            <Form.Control type="text" placeholder="Enter First Name" autofocus required />
                        </Form.Group>
                        <Form.Group style={{ width: "25%" }} controlId="formGroupLname" >
                            <Form.Control type="text" placeholder="Enter Last Name" required />
                        </Form.Group>
                        <Form.Group style={{ width: "25%" }} controlId="formGroupGender" >
                            <Form.Control type="text" placeholder="Select Gender" required />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group style={{ width: "25%" }} controlId="formGroupAge" >
                            <Form.Control type="number" min="1" max="150" placeholder="Select Age" required />
                        </Form.Group>
                        <Form.Group style={{ width: "25%" }} controlId="formGroupCity" >
                            <Form.Control type="text" placeholder="Enter City" required />
                        </Form.Group>
                        <Form.Group style={{ width: "25%" }} controlId="formGroupZip" >
                            <Form.Control type="text" inputmode="numeric" pattern="^(?(^00000(|-0000))|(\d{5}(|-\d{4})))$" placeholder="Enter Zip" required />
                        </Form.Group>

                    </Row>
                    <Row>
                        <Form.Group style={{ width: "42%" }} controlId="formGroupEmail" >
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group style={{ width: "42%" }} controlId="formGroupPassword">
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                    </Row>
                    <Button variant="info" type="submit" style={{ marginRight: "3vw" }}>Register</Button>
                    <Link to="/login">Already a member Login here</Link>
                </Form>
            </Container>
        );
    }
}
export default Signup;