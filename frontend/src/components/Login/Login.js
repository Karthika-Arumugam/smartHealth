import React, { Component } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Redirect } from 'react-router-dom';
import './Login.css'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            msg: '',
            authFlag: "",
            token: ''
        }
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    usernameChangeHandler = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
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
                localStorage.setItem('token', response.body.token);
                localStorage.setItem('email', this.state.username);
                this.setState({
                    authFlag: true,
                    token: response.body.token
                });
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
            <Container className="parlex-back-login"  >
                {this.state.authFlag ? <Redirect to="/patientdash" /> : ""}
                <h2 ><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />Login</h2>
                <Form onSubmit={this.submitLogin}>
                    <Form.Group style={{ width: "50%" }} controlId="formGroupEmail" >
                        <Form.Control type="email" placeholder="Enter email" onChange={this.usernameChangeHandler} required autofocus />
                    </Form.Group>
                    <Form.Group style={{ width: "50%" }} controlId="formGroupPassword">
                        <Form.Control type="password" placeholder="Password" onChange={this.passwordChangeHandler} required />
                    </Form.Group>
                    <Button variant="info" type="submit" style={{ marginRight: "2vw" }}>Login</Button>
                    <Link to="/signup">Create Account?</Link>
                </Form>
                <p>{this.state.msg}</p>
            </Container>
        );
    }
}
export default Login;