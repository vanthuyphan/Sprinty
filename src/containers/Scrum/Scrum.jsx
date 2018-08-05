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
class Scrum extends Component {

    render() {
        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
                <div className="main-content">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10">
                                <Card
                                    content={
                                        <form>
                                            <FormInputs
                                                ncols={["col-md-5", "col-md-3", "col-md-4"]}
                                                proprieties={[
                                                    {
                                                        label: "Start Date",
                                                        type: "text",
                                                        bsClass: "form-control",
                                                        placeholder: "Start Date",
                                                    },
                                                    {
                                                        label: "End Date",
                                                        type: "text",
                                                        bsClass: "form-control",
                                                        placeholder: "Start Date",
                                                    },
                                                    {
                                                        label: "Use Daily Meeting",
                                                        type: "text",
                                                        bsClass: "form-control",
                                                        placeholder: "Start Date",
                                                    },
                                                    {
                                                        label: "Use Retrospective Meeting",
                                                        type: "text",
                                                        bsClass: "form-control",
                                                        placeholder: "Start Date",
                                                    },
                                                ]}
                                            />
                                            <Button
                                                bsStyle="info"
                                                pullRight
                                                fill
                                                type="submit"
                                            >
                                                Update
                                            </Button>
                                            <div className="clearfix"></div>
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

export default Scrum;
