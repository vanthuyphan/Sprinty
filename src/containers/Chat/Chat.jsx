import React, {Component} from "react";
import {Col, Grid, Panel, Row} from "react-bootstrap";
import {scaleLinear} from "d3-scale";
import {inject, observer} from "mobx-react";

import Card from "../../components/Card/Card.jsx";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import RoomRow from "./RoomRow";

@inject('userStore')
@inject('chatStore')
@observer
class Chat extends Component {

    constructor(props) {
        super();
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {
            isLoading: true
        }
    }

    componentWillMount() {


    }

    componentDidMount() {
        const {uid, fto} = this.props.userStore;
        this.props.chatStore.signIn(uid, fto, () => {
            this.setState({isLoading: false});
        })
    }

    render() {
        if (this.state.isLoading) {
            return             <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
                <div className="main-content">
                    Loading!!
                </div>
            </div>

        }
        const rooms = this.props.chatStore.rooms;
        console.log("Room", rooms);
        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
                <div className="main-content">
                    <Grid fluid>
                        <Row>
                            <Col md={4}>
                                <Card
                                    title="Groups"
                                    content={
                                        <Panel className="chat-group">
                                            {rooms.map(room => {
                                                return <RoomRow room={room}></RoomRow>
                                            })}
                                        </Panel>
                                    }
                                />
                            </Col>

                            <Col md={8}>
                                <Card
                                    title="Room"
                                    content={
                                        <Panel className="chat-room">
                                        </Panel>
                                    }
                                />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default Chat;
