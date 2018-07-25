import React, { Component } from 'react';
import { inject } from "mobx-react";
import {
    Navbar, Nav, NavItem, NavDropdown, MenuItem,
    FormGroup, FormControl, InputGroup
} from 'react-bootstrap';

@inject('userStore', "appStore")
class HeaderLinks extends Component{
    handleLogout() {
        const logout = this.props.appStore.addBlockingTask("Logout");
        this.props.userStore.logout(this.props.userStore.token, () => {
            logout.done();
        });
    }
    render(){
        return(
            <div>
                <Nav pullRight>
                    <NavDropdown
                        eventKey={3}
                        title={(
                            <div>
                                <i className="fa fa-bell-o"></i>
                                <span className="notification">3</span>
                                <p className="hidden-md hidden-lg">
                                    Notifications
                                    <b className="caret"></b>
                                </p>
                            </div>
                        )} noCaret id="basic-nav-dropdown-2">
                        <MenuItem eventKey={3.1}>Message 1</MenuItem>
                        <MenuItem eventKey={3.2}>Message 2</MenuItem>
                        <MenuItem eventKey={3.3}>Message 3</MenuItem>
                    </NavDropdown>
                    <NavDropdown
                        eventKey={4}
                        title={(
                            <div>
                                <i className="fa fa-list"></i>
                                <p className="hidden-md hidden-lg">
                                    More
                                    <b className="caret"></b>
                                </p>
                            </div>
                        )} noCaret id="basic-nav-dropdown-3" bsClass="dropdown-with-icons dropdown">
                        <MenuItem eventKey={4.1}><i className="pe-7s-mail"></i> Create Listing</MenuItem>
                        <MenuItem eventKey={4.2}><i className="pe-7s-help1"></i> Create Request</MenuItem>
                        <MenuItem eventKey={4.3}><i className="pe-7s-tools"></i> Settings</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey={4.5}><div className="text-danger" onClick={this.handleLogout.bind(this)}><i className="pe-7s-close-circle"></i> Log out</div></MenuItem>
                    </NavDropdown>
                </Nav>
            </div>
        );
    }
}
export default HeaderLinks;
