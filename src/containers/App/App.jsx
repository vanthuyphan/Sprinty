import React, { Component } from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import NotificationSystem from 'react-notification-system';

import Dashboard from '../../containers/Dashboard/Dashboard';
import UserProfile from '../../containers/UserProfile/UserProfile';
import Chat from '../../containers/Chat/Chat';
import Verify from '../../containers/Verify/Verify';
import Upload from '../../containers/Upload/Upload';
import Groups from '../../containers/Groups/Groups';
import Login from '../../containers/Login/Login';
import UploadFacebook from '../../containers/UploadFacebook/UploadFacebook';
import DiffListings from '../../containers/DiffListings/DiffListings';
import { Provider } from 'mobx-react';
import {style} from "../../variables/Variables.jsx";
import userStore from "../../models/User/UserModel.js";
import appStore from "../../models/App/AppModel.js";
import chatStore from "../../models/Chat/ChatModel.js";
import groupsStore from "../../models/Groups/GroupsModel.js";
import listingsStore from "../../models/Listing/ListingsModel.js";
import facebookGroupsStore from "../../models/FacebookGroups/FacebookGroupsModel.js";
import diffListingsStore from "../../models/Listing/DiffListingsModel.js";
import {observer, inject} from "mobx-react";

const stores = {appStore, facebookGroupsStore, groupsStore, userStore, listingsStore, diffListingsStore, chatStore};


@observer
class App extends Component {
    constructor(props){
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        // this.isAuthenticated = this.isAuthenticated.bind(this);
        this.toast = this.toast.bind(this);
        this.state = {
            _notificationSystem: null
        };

        const loadCurrentUser = appStore.addBlockingTask("Loading current user info");
        userStore.initializing((err) => {
            loadCurrentUser.done();
            if (err) {
                console.error("userStore.initializing", err);
                appStore.setError(err);
                return;
            }
        });
    }

    toast(message){
        this.setState({_notificationSystem: this.refs.notificationSystem});
        var _notificationSystem = this.refs.notificationSystem;
        var color = Math.floor((Math.random() * 4) + 1);
        var level;
        switch (color) {
            case 1:
                level = 'success';
                break;
            case 2:
                level = 'warning';
                break;
            case 3:
                level = 'error';
                break;
            case 4:
                level = 'info';
                break;
            default:
                break;
        }
        _notificationSystem.addNotification({
            title: (<span data-notify="icon" className="pe-7s-gift"></span>),
            message: (
                <div>
                    {message}
                </div>
            ),
            level: level,
            position: "tr",
            autoDismiss: 5,
        });
    }

    componentDidMount(){
        //this.toast("Welcome to Tera Dashboard. You look swell today!.")
    }

    componentDidUpdate(e){
        if(window.innerWidth < 993 && e.history.location.pathname !== e.location.pathname && document.documentElement.className.indexOf('nav-open') !== -1){
            document.documentElement.classList.toggle('nav-open');
        }
    }

    render() {
        if (appStore.error) {
            return (
                <div className="container-fluid">
                    <h1>ERROR:</h1>
                    <pre>{JSON.stringify(appStore.error)}</pre>
                </div>
            );
        }
        if (appStore.isLoading) {
            return (
                <div style={style.FullScreenLoading}></div>
            )
        }
        return (
            <Provider {...stores}>
                <div className="wrapper">
                    <NotificationSystem ref="notificationSystem" style={style}/>
                    <Switch {...this.props}>
                        <PrivateRoute toast={this.toast} authed={userStore.isAuthenticated} path="/dashboard" component={Dashboard} />
                        <PrivateRoute toast={this.toast} authed={userStore.isAuthenticated} path="/user" component={UserProfile} />
                        <PrivateRoute toast={this.toast} authed={userStore.isAuthenticated}  path="/chat" component={Chat} />
                        <PrivateRoute toast={this.toast} authed={userStore.isAuthenticated}  path="/verify" component={Verify} />
                        <PrivateRoute toast={this.toast} authed={userStore.isAuthenticated}  path="/groups" component={Groups} />
                        <PrivateRoute toast={this.toast} authed={userStore.isAuthenticated}  path="/upload" component={Upload} />
                        <PrivateRoute toast={this.toast} authed={userStore.isAuthenticated}  path="/ul-facebook" component={UploadFacebook} />
                        <PrivateRoute toast={this.toast} authed={userStore.isAuthenticated}  path="/diff-listings" component={DiffListings} />
                        <LoginRoute toast={this.toast} authed={userStore.isAuthenticated} path="/login" component={Login} />
                        <Redirect from="/" to="/login"/>
                    </Switch>
                </div>
            </Provider>
        );
    }
}


function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props} {...rest} />
                : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
        />
    )
}

function LoginRoute ({component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === false
                ? <Component {...props} {...rest} />
                : <Redirect to={{pathname: '/dashboard', state: {from: props.location}}} />}
        />
    )
}
export default App;