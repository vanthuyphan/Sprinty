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
class UserProfile extends Component {

    render() {
        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-8">
                                <Card
                                    content={
                                        <form>
                                            <FormInputs
                                                ncols={["col-md-5", "col-md-3", "col-md-4"]}
                                                proprieties={[
                                                    {
                                                        label: "Name (disabled)",
                                                        type: "text",
                                                        bsClass: "form-control",
                                                        placeholder: "Company",
                                                        defaultValue: "Creative Code Inc.",
                                                        disabled: true
                                                    },
                                                    {
                                                        label: "Name",
                                                        type: "text",
                                                        bsClass: "form-control",
                                                        placeholder: "Username",
                                                        defaultValue: this.props.userStore.fin
                                                    },
                                                    {
                                                        label: "Email address",
                                                        type: "email",
                                                        bsClass: "form-control",
                                                        placeholder: "Email"
                                                    }
                                                ]}
                                            />
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <FormGroup controlId="formControlsTextarea">
                                                        <ControlLabel>About Me</ControlLabel>
                                                        <FormControl rows="5" componentClass="textarea"
                                                                     bsClass="form-control"
                                                                     placeholder="Here can be your description"
                                                                     defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."/>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <Button
                                                bsStyle="info"
                                                pullRight
                                                fill
                                                type="submit"
                                            >
                                                Update Profile
                                            </Button>
                                            <div className="clearfix"></div>
                                        </form>
                                    }
                                />
                            </div>
                            <div className="col-md-4">
                                <UserCard
                                    bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                                    avatar={this.props.userStore.ava}
                                    name={this.props.userStore.fin}
                                    userName={this.props.userStore.mob}
                                    description={
                                        <span>
                                        This is something about you
                                    </span>
                                    }
                                    socials={
                                        <div>
                                            <Button simple><i className="fa fa-facebook-square"></i></Button>
                                            <Button simple><i className="fa fa-twitter"></i></Button>
                                            <Button simple><i className="fa fa-google-plus-square"></i></Button>
                                        </div>
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
