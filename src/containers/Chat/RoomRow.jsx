import React, {Component} from "react";
import {inject, observer} from "mobx-react";


@inject('userStore')
@inject('chatStore')
@observer
class RoomRow extends Component {
    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {
            isLoading: true
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        const {uid} = this.props.userStore;
        const {room, key} = this.props;

        this.props.chatStore.loadRoomData(key, uid, (data) => {
            this.setState({isLoading: false, room : {...data, ...room}});
        })
    }



    render() {
        if (this.state.isLoading) {
            return <div>Loading!!</div>
        }
        return (
            <div>{this.state.room.room_name}</div>
        );
    }
}

export default RoomRow;
