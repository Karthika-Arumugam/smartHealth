import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import SiteHeader from './LandingPage/SiteHeader';
import SiteFooter from './LandingPage/SiteFooter';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import PatientDashboard from './Dashboard/PatientDashboard';
import cookie from 'react-cookies';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: cookie.load('cookie') ? true : false
        }
    }
    //set isLoggedIn
    loginHandler = () => {
        this.setState({ isLoggedIn: true })
    }
    //get isLoggedIn
    getLogin = () => this.state.isLoggedIn
    render() {
        return (
            <BrowserRouter>
                <Route render={props => <SiteHeader {...props} getLogin={this.state.isLoggedIn} />} />
                <Route exact path="/" render={props => <LandingPage {...props} getLogin={this.state.isLoggedIn} />} />
                <Route exact path="/login" render={props => <Login {...props} loginHandler={this.loginHandler.bind(this)} />} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/patientdash" component={PatientDashboard} />
                <SiteFooter />
            </BrowserRouter>
        )
    }
}
export default Main;