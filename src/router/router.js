import React, {Component} from 'react';
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import App from '../App.js';

import PrivateRoute from "./provite.js";



import Login from '../components/login/login.js'
import Home from '../components/home/home.js'
class MyRouter extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pathList: []
        }
    }
    render() {
        return(
            <Router>
                <Switch>
                    <Redirect exact from="/" to="/login"></Redirect>
                    <Route path='/login' component={Login} />
                    <PrivateRoute path="/app"></PrivateRoute>
                    <Route path='/home' component={Home} />
                </Switch>
            </Router>
        )
    }
}
export default MyRouter;
