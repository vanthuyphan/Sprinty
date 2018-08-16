import React, {Component} from "react";
import {Col, Grid, Row} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import {database} from "./firebase";

@inject('userStore')
@observer
class Chat extends Component {

    constructor(props) {
        super();
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {
            isLoading: false,
            messages: [],
            users: [],
            activeChannel: "None"
        }

        this.onAddMessage = this.onAddMessage.bind(this);
    }

    componentWillMount() {
        const messagesRef = database.ref('messages')
            .orderByKey()
            .limitToLast(100);

        messagesRef.on('child_added', snapshot => {
            const message = {data: snapshot.val(), id: snapshot.key};

            this.setState(prevState => ({
                messages: [message, ...prevState.messages],
            }));
            this.forceUpdate();
            this.state.users.map(user => {
                let channel = snapshot.val().channel;
                if (channel.indexOf(user.id) !== -1 && user.id != this.props.userStore.id) {
                    this.updateActiveChannel(user);
                }
            })

        });
        this.props.userStore.loadUsers((error, data) => {
            this.state.users = data;
            this.forceUpdate();
        })
    }

    onAddMessage(event) {
        event.preventDefault();
        let message = this.input.value;
        let userName = this.props.userStore.userName;
        let timeStime = new Date().toLocaleString();
        let chatMessage = {time: timeStime, user: userName, value: message, channel: "GLOBAL"}
        database.ref('messages').push(chatMessage);
        this.input.value = '';
    }

    updateActiveChannel(user) {
        let id = this.props.userStore.id;
        let parnerId = user.id;
        if (id < parnerId) {
            this.setState({
                partner: parnerId,
                activeChannel: id + "|" + parnerId
            })
        } else {
            this.setState({
                partner: parnerId,
                activeChannel: parnerId + "|" +id
            })
        }
    }

    onPrivateMessageAdded(event) {
        event.preventDefault();
        let message = this.privateMessage.value;
        let userName = this.props.userStore.userName;
        let timeStime = new Date().toLocaleString();
        let chatMessage = {time: timeStime, user: userName, value: message, channel: this.state.activeChannel}
        database.ref('messages').push(chatMessage);
        this.privateMessage.value = '';
    }

    componentDidMount() {
        this.updateActiveChannel = this.updateActiveChannel.bind(this);
        this.onPrivateMessageAdded = this.onPrivateMessageAdded.bind(this);
    }

    render() {
        if (this.state.isLoading) {
            return <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
                <div className="main-content">
                    Loading!!
                </div>
            </div>

        }
        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
                <div className="main-content">
                    <div className="company-board">
                        <h4>Company Board</h4>
                        <div className="company-messages">

                            <ul>
                                {this.state.messages.map(message =>
                                {
                                    if (message.data.channel == "GLOBAL") {
                                        return <li key={message.id}>
                                            {message.data.time}  {message.data.user} : {message.data.value}
                                        </li>
                                    } return null;
                                }
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="form-inline company-board">
                        <form onSubmit={this.onAddMessage}>
                            <div className="form-group">
                                <input className="form-control" type="text" ref={node => this.input = node}/>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-danger form-control">Board cast</button>
                            </div>
                        </form>
                    </div>
                    <Grid fluid>
                        <Row>
                            <Col md={4}>
                                <Grid fluid>
                                    <Row>
                                        <Col md={12}>
                                            <div className="padding-bottom-10">
                                                <h4>Users</h4>
                                            </div>
                                            <nav class="nav flex-column">
                                            {
                                                this.state.users.map(user => {
                                                    if (this.props.userStore.id != user.id) {
                                                        if (this.state.partner == user.id) {
                                                            return (
                                                                <div className="row">
                                                                <button
                                                                    onClick={() => this.updateActiveChannel(user)}
                                                                    className="nav-link chat-user-active">
                                                                    {user.firstName}  {user.lastName}
                                                                </button>
                                                                </div>
                                                            )
                                                        } else {
                                                            return (
                                                                <div className="row">
                                                                <button
                                                                    onClick={() => this.updateActiveChannel(user)}
                                                                    className="nav-link chat-user">
                                                                    {user.firstName}  {user.lastName}
                                                                </button>
                                                                </div>
                                                            )
                                                        }

                                                    }
                                                    return null;
                                                })
                                            }
                                            </nav>
                                        </Col>
                                    </Row>
                                </Grid>

                            </Col>

                            <Col md={8}>
                                <h4>Chat Room</h4>
                                <div className="company-messages">

                                    <ul>
                                        {this.state.messages.map(message =>
                                            {
                                                if (message.data.channel == this.state.activeChannel) {
                                                    return <li key={message.id}>
                                                        {message.data.time}  {message.data.user} : {message.data.value}
                                                    </li>
                                                } return null;
                                            }

                                        )}
                                    </ul>
                                </div>
                                <div className="form-inline company-board">
                                    <form onSubmit={this.onPrivateMessageAdded}>
                                        <div className="form-group">
                                            <input className="form-control" type="text" ref={node => this.privateMessage = node}/>
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-danger form-control">Send</button>
                                        </div>
                                    </form>
                                </div>
                            </Col>
                        </Row>
                    </Grid>

                </div>
            </div>
        );
    }
}

export default Chat;
