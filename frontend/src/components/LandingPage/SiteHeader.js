import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cookie from 'react-cookies';

class SiteHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authToken: cookie.load('cookie') || '',
            isLoggedIn: props.getLogin,
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.getLogin !== undefined &&
            nextProps.getLogin !== null &&
            nextProps.getLogin !== this.state.isLoggedIn) {
            this.setState({
                isLoggedIn: nextProps.getLogin
            });
        }
    }

    render() {
        return (
            <Navbar expand="xl" bg="light" variant="light" >
                &nbsp;&nbsp;<FontAwesomeIcon icon={faHeartbeat} size="lg" />&nbsp;&nbsp;
                <Navbar.Brand href="/" className="animated bounceInLeft"><b>SMART<i>HEALTH</i></b></Navbar.Brand>
                <Nav className="mr-auto">
                    {this.state.isLoggedIn === false ? <Nav.Link href="#home"><b>Services</b></Nav.Link> : <Nav.Link href="/patientdash"><b>Dashboard</b></Nav.Link>}
                    {this.state.isLoggedIn === false ? <Nav.Link href="#features"><b>About Us</b></Nav.Link> : <Nav.Link ><b>Profile</b></Nav.Link>}
                    {this.state.isLoggedIn === false ? <Nav.Link href="#pricing"><b>Doctors</b></Nav.Link> : <Nav.Link ><b>Account</b></Nav.Link>}
                    {this.state.isLoggedIn === false ? <Nav.Link href="/login"><b>Login</b></Nav.Link> : <Nav.Link onClick={() => cookie.remove('cookie', { path: '/' })} href="/"><b>Logout</b></Nav.Link>}
                </Nav>
            </Navbar >
        )
    }
}
export default SiteHeader;