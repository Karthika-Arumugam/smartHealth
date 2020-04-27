import React, { Component } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import './LandingPage.css';

class Main extends Component {
    render() {
        const slide1 = '/images/1.jpg';
        const slide2 = './images/2.jpg';
        const slide3 = './images/3.jpg';
        const a1 = './images/a1.jpg'
        const a2 = './images/a2.jpg'
        const a3 = './images/a3.jpg'
        const a4 = './images/a4.jpg'
        const feature = './images/feature-img-1.png'

        return (
            <div>
                <Carousel>
                    <Carousel.Item>
                        <img className="slider" src={slide1} alt="Connected IoT Health" />
                        <Carousel.Caption>
                            <h3>Connected IoT Health</h3>
                            <p>Get the benefit of niche technology in healthcare</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img className="slider" src={slide2} alt="Third slide" />
                        <Carousel.Caption>
                            <h3>Intelligent connected Smart Health</h3>
                            <p>Reliable and Intelligent analytics in healthcare</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img className="slider" src={slide3} alt="Third slide" />
                        <Carousel.Caption>
                            <h3>Save Heart</h3>
                            <p>An efficient way to care for heart health</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel><br></br><br></br>
                <section className="page-section colord">
                    <Container >
                        <Row>
                            <Col md={3} ><div className="b1"><i className="circle"><img src={a1} alt="" /></i>
                                <h3>Consultation</h3>
                                <p>Leverage an efficient IoT connected technology of Edge computing that help diagonise heart health and save in crises.</p>
                            </div>
                            </Col>
                            <Col md={3}><div className="b1"><i className="circle"><img src={a2} alt="" /></i>
                                <h3>Critical Care</h3>
                                <p>The personalized healthcare system is for patients with heart ailments and monitored for preventive measures.</p>
                            </div>
                            </Col>
                            <Col md={3} ><div className="b1"><i className="circle"><img src={a3} alt="" /></i>
                                <h3>Smart Health</h3>
                                <p>The SmartHealth considers user privacy of utmost important and hence follows the measure of being HIPAA compliant.</p>
                            </div>
                            </Col>
                            <Col md={3} ><div className="b1"><i className="circle"><img src={a4} alt="" /></i>
                                <h3>Edge Computing</h3>
                                <p>With SmartHealth intellingent analytics the choosn health care metrics are from certified CQM standards.</p>
                            </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section>
                    <div className="heading text-center">
                        <h2>About Us</h2>
                        <p>At SmartHealth, we leverage an efficient and proven technology of Edge Analytics for our Heart Patients</p>
                    </div>
                    <div className="row feature design" style={{ width: "95%", margin: "0 auto" }}>
                        <div className="area1 columns right">
                            <h3>Smart IoT Analytics</h3>
                            <p className="justify">Leverage an efficient IoT connected technology of Edge computing that help diagonise heart health and save in crises.The personalized healthcare system is targeted for patients with known heart ailments people advised to be monitored for preventive measures, healthcare providers including doctors, health care institutions and system admin.
                            The SmartHealth considers user privacy of utmost important and hence follows the measure of being HIPAA compliant.With SmartHealth intellingent analytics the choosn health care metrics are from certified CQM</p>
                        </div>
                        <div className="area2 columns feature-media left"><img src={feature} alt="" width="100%" /></div>
                    </div>
                </section>
            </div>
        )
    }
}
export default Main;