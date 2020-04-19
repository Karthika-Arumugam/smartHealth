import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class SiteHeader extends Component {
    render() {
        return (
            <Navbar expand="xl" bg="light" variant="light" >
                &nbsp;&nbsp;<FontAwesomeIcon icon={faHeartbeat} size="lg" />&nbsp;&nbsp;
                <Navbar.Brand href="/" className="animated bounceInLeft"><b>SMART<i>HEALTH</i></b></Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="#home"><b>Services</b></Nav.Link>
                    <Nav.Link href="#features"><b>About Us</b></Nav.Link>
                    <Nav.Link href="#pricing"><b>Doctors</b></Nav.Link>
                    <Nav.Link href="/login"><b>Account</b></Nav.Link>
                </Nav>
            </Navbar >
        )
    }
}
export default SiteHeader;