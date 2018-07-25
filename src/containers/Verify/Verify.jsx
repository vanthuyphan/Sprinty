import React, {Component} from "react";
import {Card} from "../../components/Card/Card.jsx";
import {ControlLabel, FormControl, FormGroup, Alert} from "react-bootstrap";
import Button from "../../elements/CustomButton/CustomButton.jsx";
import {inject, observer} from "mobx-react";
import TextArea from "react-textarea-highlight";
import Listing from "./Listing.jsx";
import Diff from "react-diff";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import {style} from "../../variables/Variables";

@inject('userStore')
@inject('listingsStore')
@inject('appStore')
@observer
class Verify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            error: undefined
        };


        var self = this;
        this.componentDidMount = this.componentDidMount.bind(this);
        this.createMessageOnly = this.createMessageOnly.bind(this);
        this.createMessage = this.createMessage.bind(this);
        this.deleteViberMessage = this.deleteViberMessage.bind(this);
        this.addListing = this.addListing.bind(this);
        this.refreshListing = this.refreshListing.bind(this);
        this.skipMessage = this.skipMessage.bind(this);
        this.tok = this.props.userStore.token;


        props.appStore.populateAppOptions(this.tok);

        this.props.listingsStore.fetchMessage(this.tok, (err, response) => {
            self.setState({isLoading: false, error: err});
        });
    }

    createMessageOnly() {
        this.setState({isLoading: true});
        this.props.listingsStore.createMessageOnly(this.tok, (response) => {
            this.setState({isLoading: false});
        });
    }

    skipMessage() {
        this.setState({isLoading: true});
        this.props.listingsStore.skipMessage(this.tok, (err, response) => {
            this.setState({isLoading: false});
        });
    }

    createMessage() {

        this.setState({isLoading: true});
        this.props.listingsStore.createMessage(this.tok, (response) => {
            console.log('create');
            this.setState({isLoading: false});
            
        });
    }

    deleteViberMessage() {
        this.setState({isLoading: true});
        this.props.listingsStore.deleteViberMessage(this.tok, (err, response) => {
            this.setState({isLoading: false});
        });
    }

    addListing() {
        this.setState({isLoading: true});
        this.props.listingsStore.addListing();
        this.setState({isLoading: false});

    }

    refreshListing() {
        this.setState({isLoading: true});
        this.props.listingsStore.refreshLisingTime(this.tok, (response) => {
            this.setState({isLoading: false});
        });
    }

    componentDidMount() {
        if (this.state.isLoading == false) {
            let textarea = document.querySelector('textarea');
            textarea.addEventListener('keydown', this.autosize);
        }
    }

    autosize() {
        let el = this;
        setTimeout(function () {
            el.style.cssText = 'height:auto; padding:5px';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
        }, 0);
    }

    isFooBar() {
        return /((((gia|gia|giia|gía|giá|GIÁ :))\s*((\d+(\.|\,)\d*)|\d+)\s*(ty|ti|tỉ|tỷ|tỷ|TỶ|TỈ|\$|\(\$\)|usd|USD|triệu|triệu\/ tháng|tr|tr\/th)*|((\d+(\.|\,)\d*)|\d+)\s*(ty|ti|tỉ|tỷ|tỷ|TỶ|TỈ|\$|\(\$\)|usd|USD|triệu|triệu\/ tháng|tr|tr\/th))(\s*\d*|\ |\;|\.|\,))|(((09|01\d)(\ |-)*\d(\ |-)*\d(\ |-)*\d(\ |-)*\d(\ |-)*\d(\ |-)*\d(\ |-)*\d(\ |-)*\d))|((dt\sđất|dt\ssàn|dt|DT\s*|Dt:\s*)\s((\d+(\.|\,)\d*)|\d+)\s*(M2|m2|m)|((\d+(\.|\,)\d*)|\d+)(x|\*|\-)((\d+(\.|\,)\d*)|\d+)\s*(M2|m2|m|\ )|((\d+(\.|\,)\d*)|\d+)\s*(M2|m2|m)(\ |\,))|((b|B)(á|Á|a)(n|N))|(((c|C)(h|H)(o|O))(\s((T|t)(H|h)(U|u)(E|e|Ê|ê))))|(((C|c)(Ầ|ầ|A|a)(N|n))*\s((m|M)ua))|(((C|c)(Ầ|ầ|A|a)(N|n))\s((T|t)(H|h)(U|u)(E|e|Ê|ê))|((T|t)(H|h)(U|u)(E|e|Ê|ê)))/ig
    }

    render() {
        let content;
        let tok = this.props.userStore.token;
        if (this.state.isLoading == true) {
            content = (
                <div style={style.Loading}></div>
            );
        } else if (this.state.error) {
            content = (
                <div>
                    <h1>ERROR:</h1>
                    <pre>{JSON.stringify(this.state.error)}</pre>
                </div>
            );
        } else if (!this.props.listingsStore.listings || this.props.listingsStore.listings.length === 0) {
            content = (
                <div>
                    <Alert bsStyle="warning">
                        <h4><strong>God job!</strong> there is no listing to verify.</h4>
                        <p>
                            But you should go to <b>Groups</b> to get more.
                        </p>
                    </Alert>
                </div>
            );
        } else {
            content = (
                    <div className="row">
                        <div className="col-md-4 sticky">
                            <Card
                                title=""
                                content={
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <FormGroup>
                                                    <ControlLabel>Môi Giới</ControlLabel>
                                                    <FormControl
                                                        type="text"
                                                        disabled={true}
                                                        value={this.props.listingsStore.phone}

                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-6">
                                                <FormGroup>
                                                    <ControlLabel>Nhóm Chat</ControlLabel>
                                                    <FormControl
                                                        type="text"
                                                        value={this.props.listingsStore.gName}
                                                        disabled={true}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <FormGroup controlId="">
                                            <ControlLabel>Tin Nhắn: </ControlLabel>
                                            <div className="sticky">
                                            <TextArea
                                                value={this.props.listingsStore.message}
                                                className="censor"
                                                highlight={this.isFooBar}
                                            />
                                            </div>
                                        </FormGroup>
                                    </form>
                                }
                            />
                            <Card
                                title=""
                                content={
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <Button
                                                    bsStyle="success"
                                                    fill
                                                    type="button"
                                                    onClick={this.createMessageOnly}
                                                >
                                                    ĐĂNG MESSSAGE
                                                </Button>
                                            </div>
                                            <div className="col-md-6">
                                                <Button
                                                    bsStyle="success"
                                                    fill
                                                    type="button"
                                                    onClick={this.skipMessage}
                                                >
                                                    SKIP
                                                </Button>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <Button simple
                                                    type="button"
                                                    bsSize="large"
                                                    onClick={() => (this.props.listingsStore.deleteViberMessage(tok))}
                                            ><i className="pe-7s-junk text-danger"></i>
                                            </Button>
                                            <Button simple
                                                    type="button"
                                                    bsSize="large"
                                                    onClick={() => (this.props.listingsStore.addListing())}
                                            ><i className="pe-7s-plus text-success"></i>
                                            </Button>
                                        </div>
                                    </form>
                                }
                            />
                            <Card
                                title=""
                                content={
                                    <form>
                                        <FormGroup controlId="">
                                            <ControlLabel>Tin Nhắn Tương Tự: </ControlLabel>
                                            <div className="sticky">
                                                <Diff
                                                    inputA={this.props.listingsStore.similarMessage}
                                                    inputB={this.props.listingsStore.similarMessage == "" ? "" : this.props.listingsStore.message}
                                                    type="chars"
                                                />
                                            </div>
                                            <Button
                                                className="similarBtn"
                                                bsStyle="success"
                                                fill
                                                type="button"
                                                disabled={this.props.listingsStore.similarMessage == ""}
                                                onClick={this.refreshListing}>
                                                REFRESH LISTING
                                            </Button>
                                        </FormGroup>
                                    </form>
                                }
                            />
                        </div>
                        <div className="col-md-8">
                            <div className="row">
                                {this.props.listingsStore.listings.map(listing => (
                                    <Listing key={listing.id}
                                             rawId={this.props.listingsStore.rawId}
                                             tit={this.props.listingsStore.tit}
                                             pri={this.props.listingsStore.pri}
                                             unit={this.props.listingsStore.unit}
                                             typ={this.props.listingsStore.typ}
                                             typeOptions={this.props.appStore.typeOptions}
                                             img={this.props.listingsStore.img}
                                             are={this.props.listingsStore.are}
                                             areaUnitId={this.props.listingsStore.areaUnit}
                                             widthArea={this.props.listingsStore.widthArea}
                                             lengthArea={this.props.listingsStore.lengthArea}
                                             mode={this.props.listingsStore.mode}
                                             modeOptions={this.props.appStore.modeOptions}
                                             des={this.props.listingsStore.des}
                                             dir={this.props.listingsStore.dir}
                                             nob={this.props.listingsStore.nob}
                                             address={this.props.listingsStore.address}
                                             now={this.props.listingsStore.now}
                                             acc={this.props.listingsStore.acc}
                                             streetWidth={this.props.listingsStore.streetWidth}
                                             store={this.props.listingsStore}
                                             appStore={this.props.appStore}
                                             tok={this.props.userStore.token}
                                             listing={listing}/>
                                ))}
                            </div>
                            <div>
                                <Button
                                    className="requestButton"
                                    bsStyle="warning"
                                    fill
                                    type="button"
                                    onClick={(e) => {
                                        //e.preventDefault();
                                        this.props.listingsStore.createMessage(tok)
                                    }}
                                >
                                    ĐĂNG TIN + REQUEST
                                </Button>
                            </div>
                        </div>
                    </div>
            );
        }
        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>

                <div className="main-content">
                    <div className="container-fluid">
                        {content}
                    </div>
                </div>
            </div>
        );
    }
}

export default Verify;
