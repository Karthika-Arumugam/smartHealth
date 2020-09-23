import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Dashboard.css';

class ITAdminDashboard extends Component {

    render() {
        return (
            <Container>
                <div aria-live="polite" aria-atomic="true" style={{ position: 'relative', minHeight: '100px', }}>
                    <h2><FontAwesomeIcon icon={faHeartbeat} size="1x" style={{ marginRight: "1vw" }} />ITAdmin Dashboard</h2>
                </div>
            </Container>
        );
    }
}
export default ITAdminDashboard;