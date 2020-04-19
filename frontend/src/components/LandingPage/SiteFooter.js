import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';

class SiteFooter extends Component {

    render() {
        return (
            <Container>
                <Row>
                    <Col sm={12}><Navbar.Brand href="/" className="animated"><b>SMART<i>HEALTH 2020</i></b></Navbar.Brand><b>Care an Intelligent Edge Computing Platform</b></Col>
                </Row>
            </Container>
        )
    }
}
export default SiteFooter;