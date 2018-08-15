import React, { Component } from 'react';
import { Collapse, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
// this is used to create scrollbars on windows devices like the ones from apple devices
import * as Ps from 'perfect-scrollbar';
import { inject } from "mobx-react";
import 'perfect-scrollbar/dist/css/perfect-scrollbar.min.css';

import HeaderLinks from '../../components/Header/HeaderLinks.jsx';

// backgroundImage for Sidebar
import image from '../../assets/img/full-screen-image-3.jpg';
// image for avatar in Sidebar
import avatar from '../../assets/img/sidebar-3.jpg';
// logo for sidebar
import logo from "../../logo.svg";

const bgImage = {backgroundImage: "url("+image+")"};

@inject('userStore')
class Sidebar extends Component{
    constructor(props){
        super(props);
        this.state = {
            width: window.innerWidth
        }
    }
    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
    }
    updateDimensions(){
        this.setState({width:window.innerWidth});
    }

    componentDidMount() {
        this.updateDimensions();

        // add event listener for windows resize
        window.addEventListener("resize", this.updateDimensions.bind(this));
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            Ps.initialize(this.refs.sidebarWrapper, { wheelSpeed: 2, suppressScrollX: true });
        }
    }

    componentDidUpdate(){
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            setTimeout(() => { Ps.update(this.refs.sidebarWrapper) }, 350);
        }
    }

    // function that creates perfect scroll bar for windows users
    // (it creates a scrollbar that looks like the one from apple devices)
    isMac(){
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0
            || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    render() {
          return (
            <div id="sidebar" className="sidebar" data-color="orange">
                <div className="logo">
                    <a href="http://www.tera.vn" className="simple-text logo-mini" target="_blank">
                        <div className="logo-img">
                            <img src={logo} alt="react-logo"/>
                        </div>
                    </a>
                    <a href="http://www.tera.vn" className="simple-text logo-normal" target="_blank">
                        Sprinty
                    </a>
                </div>
                <div className="sidebar-wrapper" ref="sidebarWrapper">
                    <div className="user">
                        <div className="photo">
                            <img src={this.props.userStore.avatar}/>
                        </div>
                        <div className="info">
                            <a>
                                <span>
                                    {this.props.userStore.firstName}
                                </span>
                            </a>
                        </div>
                    </div>
                    <ul className="nav">
                        { this.state.width <= 991 ? (<HeaderLinks />) : null }
                        <li className={this.activeRoute("/dashboard")}>
                            <NavLink to={'/dashboard'} className="nav-link" activeClassName="active">
                                <i className="pe-7s-home"></i>
                                <p>Dashboard</p>
                            </NavLink>
                        </li>
                        <li className={this.activeRoute("/chat")}>
                            <NavLink to={'/chat'} className="nav-link" activeClassName="active">
                                <i className="pe-7s-chat"></i>
                                <p>Chat</p>
                            </NavLink>
                        </li>
                        <li className={this.activeRoute("/tasks")}>
                            <NavLink to={'/tasks'} className="nav-link" activeClassName="active">
                                <i className="pe-7s-tools"></i>
                                <p>Tasks</p>
                            </NavLink>
                        </li>
                        <li className={this.activeRoute("/users")}>
                            <NavLink to={'/users'} className="nav-link" activeClassName="active">
                                <i className="pe-7s-users"></i>
                                <p>Users</p>
                            </NavLink>
                        </li>
                        <li className={this.activeRoute("/report")}>
                            <NavLink to={'/report'} className="nav-link" activeClassName="active">
                                <i className="pe-7s-user"></i>
                                <p>Report</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Sidebar;
