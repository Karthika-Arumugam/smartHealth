import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import cookie from 'react-cookies';
import LandingPage from './LandingPage/LandingPage';
import SiteHeader from './LandingPage/SiteHeader';
import SiteFooter from './LandingPage/SiteFooter';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import PatientDashboard from './Dashboard/PatientDashboard';
import HealthCareDashboard from './Dashboard/HealthCareDashboard';
import ITAdminDashboard from './Dashboard/ITAdminDashboard'
import PatientProfile from './Profile/PatientProfile';
import AdminProfile from './Profile/AdminProfile';
import HealthCareProfile from './Profile/HealthCareProfile';
import Resource from './Resource/Resource';
import ActivePatient from './Patient/ActivePatient';
import ActivePatientDetails from './Patient/ActivePatientDetails';

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
            //props to get isLoggedIn state across common component like header
            <BrowserRouter>
                <Route render={props => <SiteHeader {...props} getLogin={this.state.isLoggedIn} />} />
                <Route exact path="/" render={props => <LandingPage {...props} getLogin={this.state.isLoggedIn} />} />
                <Route exact path="/login" render={props => <Login {...props} loginHandler={this.loginHandler.bind(this)} />} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/patientdash" component={PatientDashboard} />
                <Route exact path="/healthdash" component={HealthCareDashboard} />
                <Route exact path="/admindash" component={ITAdminDashboard} />
                <Route exact path="/activepatient/:riskStatus" component={ActivePatient} />
                <Route exact path="/activepatientdetails/:patientid" component={ActivePatientDetails} />
                <Route exact path="/patientprof" component={PatientProfile} />
                <Route exact path="/adminprof" component={AdminProfile} />
                <Route exact path="/healthcareprof" component={HealthCareProfile} />
                <Route exact path="/resource/:providerName" component={Resource} />
                {/* <Route
                            path="/item/:itemID"
                            render={props => <Item {...props} toggleSpinner={this.toggleSpinner.bind(this)} />}
                        /> */}
                <SiteFooter />
            </BrowserRouter>
        )
    }
}
export default Main;