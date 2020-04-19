import React, { Component } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import './Login.css'


class Login extends Component {
    render() {
        
        return (
            <Container className="parlex-back"  >
            <h2 ><FontAwesomeIcon icon={faHeartbeat} size="1x" />  Login</h2>
            <Form >
                    <Form.Group style={{ width: "50%" }}controlId="formGroupEmail" >
                       <Form.Control type="email" placeholder="Enter email" required autofocus/>
                    </Form.Group>
                    <Form.Group style={{ width: "50%" }}controlId="formGroupPassword">
                      <Form.Control type="password" placeholder="Password" required/>
                    </Form.Group>
                   <Button variant="info" type="submit">Login</Button> 
                   <Link to="/signup">Create Account?</Link>
                </Form>
            </Container>
         );
    }
}
export default Login;