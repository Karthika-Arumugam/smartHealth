import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import SiteHeader from './LandingPage/SiteHeader';
import SiteFooter from './LandingPage/SiteFooter';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import PatientDashboard from './Dashboard/PatientDashboard';

class Main extends Component {
    render() {
        return (
            <BrowserRouter>
                <SiteHeader />
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/patientdash" component={PatientDashboard} />
                <SiteFooter />
            </BrowserRouter>
        )
    }
}
export default Main;