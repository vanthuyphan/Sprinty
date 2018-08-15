import React, {Component} from "react";
import {Col, FormControl, FormGroup, Grid} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import StatsCard from "../../components/Card/StatsCard.jsx";
import UserCard from "../../components/Card/UserCard.jsx";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

import Button from "../../elements/CustomButton/CustomButton.jsx";

@inject('userStore')
@observer
class Dashboard extends Component {

    constructor() {
        super();
        this.componentDidMount = this.componentDidMount.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.state = {users: [], count: {}};
    }

    componentDidMount() {
        this.props.userStore.loadUsers((error, data) => {
            this.setState({
                fetching: false,
                users : data
            });
            this.forceUpdate();
        });

        this.props.userStore.count((error, data) => {
            this.setState({
                fetching: false,
                count : data
            });
            console.log("Count", this.state.count);
            this.forceUpdate();
        });

    }

    handleStatusChanged(e) {
        this.setState({status: e.target.value});
    }

    changeStatus() {
        this.props.userStore.changeStatus(this.state.status, (error, response) => {
            this.props.userStore.loadUsers((error, data) => {
                this.setState({
                    fetching: false,
                    users : data
                });
                this.forceUpdate();
            });
        })
    }

    render() {
        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
                <div className="main-content">
                    <form className="status">
                        <FormGroup controlId="formBasicText">
                            <FormControl
                                type="text"
                                placeholder="Enter Status"
                                onChange={this.handleStatusChanged.bind(this)}
                            />
                        </FormGroup>
                        <Button
                            onClick={this.changeStatus}
                            bsStyle="warning" fill wd>
                            Update Status
                        </Button>
                    </form>

                    <Grid fluid className="counters">
                        <Col lg={4} sm={6}>
                            <div className="card card-stats">
                                <div className="content">
                                    <div className="row">
                                        <div className="col-xs-5">
                                            <div className="icon-big text-center icon-warning">
                                                {this.state.count.open}
                                            </div>
                                        </div>
                                        <div className="col-xs-7">
                                            <div className="numbers">
                                                <p>{"OPEN"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </Col>
                        <Col lg={4} sm={6}>
                            <div className="card card-stats">
                                <div className="content">
                                    <div className="row">
                                        <div className="col-xs-5">
                                            <div className="icon-big text-center icon-warning">
                                                {this.state.count.doing}
                                            </div>
                                        </div>
                                        <div className="col-xs-7">
                                            <div className="numbers">
                                                <p>{"DOING"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </Col>
                        <Col lg={4} sm={6}>
                            <div className="card card-stats">
                                <div className="content">
                                    <div className="row">
                                        <div className="col-xs-5">
                                            <div className="icon-big text-center icon-warning">
                                                {this.state.count.done}
                                            </div>
                                        </div>
                                        <div className="col-xs-7">
                                            <div className="numbers">
                                                <p>{"DONE"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </Col>
                    </Grid>
                    <Grid fluid>
                        {
                            this.state.users.map((user) => {
                                    return <Col lg={3} sm={6}>
                                        <UserCard
                                            bgImage=""
                                            avatar={user.avatar}
                                            name={user.firstName + " " + user.lastName}
                                            userName={"@" + user.userName}
                                            description={
                                                <span>
                                                    {user.status}
                                    </span>
                                            }
                                        />
                                    </Col>
                            }

                            )
                        }
                    </Grid>

                </div>

            </div>
        );
    }
}

export default Dashboard;
