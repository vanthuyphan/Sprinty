import React, {Component} from 'react';
import {observable, action} from "mobx";
import {observer, inject} from "mobx-react";
import {
    Grid, Row, Col,
    FormGroup, FormControl,
    HelpBlock
} from 'react-bootstrap';

import Card from '../../components/Card/Card.jsx';

import Button from '../../elements/CustomButton/CustomButton.jsx';
import bgImage from '../../assets/img/full-screen-image-4.jpg';
import Footer from '../../components/Footer/Footer.jsx';

@inject('userStore', "appStore")
@observer
class Login extends Component {
    componentDidMount() {
        setTimeout(function () {
            this.setState({cardHidden: false});
        }.bind(this), 700);
    }

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMsg: '',
            cardHidden: true
        }
    }

    handlePhoneChange(e) {
        this.setState({phone: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handlePasswordKeypress(event) {
        console.log(event.key);
        if(event.key == 'Enter'){
            this.handleFormSubmit(event);
        }
    }

    render() {
        return (
            <div>
                <div className="wrapper wrapper-full-page">
                    <div className={"full-page login-page"} data-color="orange" data-image={bgImage}>
                        <div className="content">
                            <Grid>
                                <Row>
                                    <Col md={4} sm={6} mdOffset={4} smOffset={3}>
                                        <Card
                                            hidden={this.state.cardHidden}
                                            textCenter
                                            title="Login"
                                            content={
                                                <form>
                                                    <FormGroup controlId="formBasicText">
                                                        <FormControl
                                                            type="text"
                                                            value={this.state.value}
                                                            placeholder="Enter Phone"
                                                            onChange={this.handlePhoneChange.bind(this)}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup controlId="formBasicText">
                                                        <FormControl
                                                            type="password"
                                                            value={this.state.value}
                                                            placeholder="Enter Password"
                                                            onChange={this.handlePasswordChange.bind(this)}
                                                            onKeyPress={this.handlePasswordKeypress.bind(this)}
                                                        />
                                                        <FormControl.Feedback />
                                                        {this.state.errorMsg && <HelpBlock>{this.state.errorMsg}</HelpBlock>}
                                                    </FormGroup>
                                                </form>
                                            }
                                            legend={
                                                <Button
                                                    onClick={this.handleFormSubmit}
                                                    bsStyle="warning" fill wd>
                                                    Login
                                                </Button>
                                            }
                                            ftTextCenter
                                        />

                                    </Col>
                                </Row>
                            </Grid>
                        </div>
                        <Footer transparent/>
                        <div className="full-page-background" style={{backgroundImage: "url(" + bgImage + ")"}}></div>
                    </div>
                </div>
            </div>
        );
    }

    handleFormSubmit = e => {
        console.log("Formsubmiting");
        var self = this;
        self.setState({errorMsg: undefined});

        // let login = self.props.appStore.addBlockingTask("Logginng");
        /*this.props.userStore.login(this.state.phone, this.state.password, (err) => {
            // self.props.appStore.removeBlockingTask(login);
            if (err) {
                console.log(err);
                if (err.msg) {
                    self.setState({errorMsg: err.msg});
                } else {
                    self.setState({errorMsg: "Unknown error"});
                }
            }
        });*/
         this.props.userStore.login("01229989919", "123456");
        e.preventDefault();
    };
}

export default Login;
