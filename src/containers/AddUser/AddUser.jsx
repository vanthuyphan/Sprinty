import React, {Component} from 'react';
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap';

import {Card} from '../../components/Card/Card.jsx';
import {FormInputs} from '../../components/FormInputs/FormInputs.jsx';
import {UserCard} from '../../components/UserCard/UserCard.jsx';
import Button from '../../elements/CustomButton/CustomButton.jsx';

import {observer, inject} from "mobx-react";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from "../../components/Header/Header";

@inject('userStore')
@observer
class AddUser extends Component {

    constructor() {
        super();
        this.state = {};

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

    handleFormSubmit = e => {
        this.props.userStore.createUser(this.state.userName, this.state.firstName,
            this.state.lastName, this.state.avatar, this.state.password, (err) => {
        });
        e.preventDefault();
    };

    render() {
        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                <Card
                                    content={
                                        <form>
                                            <FormGroup controlId="formBasicText">
                                                <FormControl
                                                    type="text"
                                                    placeholder="Enter Username"
                                                    onChange={this.handleUserNameChanged.bind(this)}
                                                />
                                            </FormGroup>
                                            <FormGroup controlId="formBasicText">
                                                <FormControl
                                                    type="text"
                                                    placeholder="Enter First Name"
                                                    onChange={this.handleFirstNameChanged.bind(this)}
                                                />
                                            </FormGroup>
                                            <FormGroup controlId="formBasicText">
                                                <FormControl
                                                    type="text"
                                                    placeholder="Enter Last Name"
                                                    onChange={this.handleLastNameChanged.bind(this)}
                                                />
                                            </FormGroup>
                                            <FormGroup controlId="formBasicText">
                                                <FormControl
                                                    type="text"
                                                    placeholder="Enter Avatar"
                                                    onChange={this.handleAvatarChanged.bind(this)}
                                                />
                                                <FormControl.Feedback />
                                            </FormGroup>
                                            <FormGroup controlId="formBasicText">
                                                <FormControl
                                                    type="password"
                                                    placeholder="Enter Password"
                                                    onChange={this.handlePasswordChange.bind(this)}
                                                />
                                                <FormControl.Feedback />
                                            </FormGroup>
                                            <Button
                                                onClick={this.handleFormSubmit}
                                                bsStyle="warning" fill wd>
                                                Create
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

export default AddUser;
