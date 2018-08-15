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

    handleContentChanged(e) {
        this.setState({content: e.target.value});
    }

    handleIncluded(e) {
        this.setState({included: e.target.value});
    }

    handleFormSubmit = e => {
        this.props.userStore.createTask(this.state.content, this.state.included, (err) => {
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
                                                    placeholder="Enter Content"
                                                    onChange={this.handleContentChanged.bind(this)}
                                                />
                                            </FormGroup>
                                            <FormGroup controlId="formBasicText">
                                                <FormControl
                                                    type="text"
                                                    placeholder="Is Included"
                                                    onChange={this.handleIncluded.bind(this)}
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
