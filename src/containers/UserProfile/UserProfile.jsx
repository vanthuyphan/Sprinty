import React, {Component} from 'react';
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap';

import {Card} from '../../components/Card/Card.jsx';
import {FormInputs} from '../../components/FormInputs/FormInputs.jsx';
import {UserCard} from '../../components/UserCard/UserCard.jsx';
import Button from '../../elements/CustomButton/CustomButton.jsx';

import {observer, inject} from "mobx-react";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from "../../components/Header/Header";
var NotificationSystem = require('react-notification-system');

@inject('userStore')
@observer
class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: props.userStore.user.userName,
            firstName: props.userStore.user.firstName,
            lastName: props.userStore.user.lastName,
            password: props.userStore.user.password,
            avatar: props.userStore.user.avatar,
        }
        this._notificationSystem = null;
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        this._notificationSystem = this.refs.notificationSystem;
        this.handleUserNameChanged = this.handleUserNameChanged.bind(this)
        this.handleFirstNameChanged = this.handleFirstNameChanged.bind(this)
        this.handleLastNameChanged = this.handleLastNameChanged.bind(this)
        this.handleAvatarChanged = this.handleAvatarChanged.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleUserNameChanged(e) {
        this.setState({userName: e.target.value});
    }
    handleFirstNameChanged(e) {
        this.setState({firstName: e.target.value});
    }
    handleLastNameChanged(e) {
        this.setState({lastName: e.target.value});
    }
    handleAvatarChanged(e) {
        this.setState({avatar: e.target.value});
    }
    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handleFormSubmit() {
        this.props.userStore.update(this.state.userName, this.state.firstName,
            this.state.lastName, this.state.avatar, this.state.password, (err) => {
                window.location.href = "#/dashboard";
        });
        e.preventDefault();
    }

    render() {
        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
                <NotificationSystem ref="notificationSystem" />
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-8">
                                <Card
                                    content={
                                        <form>
                                            <FormGroup controlId="formBasicText">
                                                <FormControl
                                                    type="text"
                                                    value={this.state.userName}
                                                    placeholder="Username"
                                                    onChange={this.handleUserNameChanged.bind(this)}
                                                />
                                            </FormGroup>
                                            <FormGroup controlId="formBasicText">
                                                <FormControl
                                                    type="text"
                                                    value={this.state.firstName}
                                                    placeholder="First Name"
                                                    onChange={this.handleFirstNameChanged.bind(this)}
                                                />
                                            </FormGroup>
                                            <FormGroup controlId="formBasicText">
                                                <FormControl
                                                    type="text"
                                                    value={this.state.lastName}
                                                    placeholder="Last Name"
                                                    onChange={this.handleLastNameChanged.bind(this)}
                                                />
                                            </FormGroup>
                                            <FormGroup controlId="formBasicText">
                                                <FormControl
                                                    type="text"
                                                    value={this.state.avatar}
                                                    placeholder="Avatar"
                                                    onChange={this.handleAvatarChanged.bind(this)}
                                                />
                                            </FormGroup>
                                            <FormGroup controlId="formBasicText">
                                                <FormControl
                                                    type="password"
                                                    value={this.state.password}
                                                    placeholder="Password"
                                                    onChange={this.handlePasswordChange.bind(this)}
                                                />
                                                <FormControl.Feedback />
                                                {this.state.errorMsg &&
                                                <HelpBlock>{this.state.errorMsg}</HelpBlock>}
                                            </FormGroup>
                                            <Button
                                                onClick={this.handleFormSubmit}
                                                bsStyle="warning" fill wd>
                                                Update
                                            </Button>
                                        </form>

                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserProfile;
