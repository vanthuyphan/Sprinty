import React, {Component} from 'react';
import {observable, action} from "mobx";
import {observer, inject} from "mobx-react";
import GonhadatAPI from "../../common/gonhadatAPI.js";

import Dropzone from 'react-dropzone';
import {post} from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from "../../components/Header/Header";
import {style} from "../../variables/Variables";

@inject('userStore')
@observer
class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: undefined
        };
    }
    onDrop (acceptedFiles) {
        let tok = this.props.userStore.token;

        if (!tok) {
            this.setState({error: "No Token!"});
            return;
        }

        const self = this;
        let counter = acceptedFiles.length;
        if (counter) {
            self.setState({loading: true});
            acceptedFiles.forEach(file => {
                GonhadatAPI.uploadFile(tok, file, (error, response) => {
                    if (error) {
                        return self.setState({error});
                    }
                    counter--;
                    if (counter === 0) {
                        self.setState({loading: false});
                    }
                })
            });
        }
    }

    render() {
        const overlayStyle = {
            top: 60,
            right: 0,
            bottom: 0,
            left: 0,
            padding: '2.5em 0',
            background: 'rgba(0,0,0,0.5)',
            textAlign: 'center',
            color: '#fff'
        };


        let page_content;

        if (this.state.error) {
            page_content = (
                <div>
                    <h1>ERROR:</h1>
                    <pre>{JSON.stringify(this.state.error)}</pre>
                </div>
            );
        } else if (this.state.loading == true) {
            page_content = (
                <div style={style.Loading}></div>
            );
        } else {
            page_content = (
                <div className="row">
                    <section>
                        <Dropzone
                            style={{}}
                            onDrop={this.onDrop.bind(this)}
                        >
                            <div style={overlayStyle}><h3>DROP FILES HERE...</h3></div>
                        </Dropzone>
                    </section>
                </div>
            );
        }

        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
                <div className="content">
                    <div className="container-fluid">
                        {page_content}
                    </div>
                </div>
            </div>
        );
    }
}

export default Upload;
