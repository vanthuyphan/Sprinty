import React, {Component} from "react";
import Button from "../../elements/CustomButton/CustomButton.jsx";
import {inject, observer} from "mobx-react";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from "../../components/Header/Header";
import $ from "jquery";
import {Col, Grid, Row} from "react-bootstrap";
import Card from "../../components/Card/Card.jsx";

import {style} from "../../variables/Variables";
import GonhadatAPI from "../../common/gonhadatAPI.js";

require('datatables.net-responsive');
$.DataTable = require('datatables.net-bs');


const headerRow = []
const FIELDS = ['groupId', 'groupName', 'numMember', 'numUploadedFeed', 'numRemainFeed'];


@inject('appStore')
@inject('userStore')
@observer
export class UploadFacebook extends Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {
            loading: true,
            error: undefined,
            groups: []
        };

        this.fetchGroups = this.fetchGroups.bind(this);
        this.uploadFacebookHistory = this.uploadFacebookHistory.bind(this);
    }

    fetchGroups(cb) {
        const self = this;
        const tok = self.props.userStore.token;

        if (!tok) {
            console.warn("No token");
            self.setState({
                error: "No User Token"
            });
            return cb && cb("No token");
        }

        self.setState({loading: true, groups: []});
        GonhadatAPI.getFacebookGroups(tok, (error, response) => {
            self.setState({
                loading: false,
                error,
                groups: response && response.data && response.data.data
            });
            return cb && cb(error);
        });
    }

    uploadFacebookHistory(gId, since, cb) {
        const self = this;
        const tok = self.props.userStore.token;

        if (!tok) {
            console.warn("No token");
            return self.setState({
                error: "No User Token"
            });
        }

        self.setState({loading: true});
        GonhadatAPI.uploadFacebookHistory(tok, gId, since, (error, response) => {
            self.setState({loading: false, error});
            if (error) {
                console.error("GonhadatAPI.uploadFacebookHistory", error);
            }

            cb && cb(error, response);
        });
    }

    componentDidMount() {
        let self = this;

        function initTable() {
            let $table = $("#UPLOAD_FACEBOOK_DATATABLE").DataTable({
                "pagingType": "full_numbers",
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                responsive: true,
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search records",
                },
                data: self.state.groups,
                columns: [
                    {data: "groupId"},
                    {data: "groupName"},
                    {data: "numMember"},
                    {data: "numUploadedFeed"},
                    {data: "numRemainFeed"},
                    {
                        "targets": -1,
                        "data": null,
                        "defaultContent": "<btn class='btn btn-danger doUpload'>Verify</btn>"
                    }
                ]
            });
            $("#UPLOAD_FACEBOOK_DATATABLE tbody").on("click", ".doUpload", function () {
                let $e = $(this);

                if ($e.attr("verifying")) return;
                var data = $table.row( $(this).parents('tr') ).data();
                self.uploadFacebookHistory(data.groupId, "123", (err) => {
                    if (err) return;

                    $e.removeClass("btn");
                    $e.removeClass("btn-danger");
                    $e.html("Verifying");
                    $e.attr("verifying", true);
                });
            });
        }
        self.fetchGroups((error) => {
            initTable();
        });
    }

    componentWillUnmount() {
        $('#UPLOAD_FACEBOOK_DATATABLE')
            .DataTable()
            .destroy(true);
    }

    render() {
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
                <Grid fluid>
                    <Row>
                        <Card
                            content={
                                <div className="fresh-datatables">
                                    <table id="UPLOAD_FACEBOOK_DATATABLE" ref="main"
                                           className="table table-striped table-no-bordered table-hover"
                                           cellSpacing="0" width="100%" style={{width: "100%"}}>
                                        <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th>Checked</th>
                                            <th>Members</th>
                                            <th>Remained</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        </tbody>
                                    </table>
                                </div>
                            }
                        />
                    </Row>
                </Grid>
            );
        }

        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
                <div className="main-content">
                    <div className="container-fluid">
                        {page_content}
                    </div>
                </div>
            </div>
        );
    }
}

export default UploadFacebook;
