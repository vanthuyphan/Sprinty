import React, {Component} from "react";
// jQuery plugin - used for DataTables.net
import $ from "jquery";
import {observer, inject} from "mobx-react";
import {Col, Grid, Row} from "react-bootstrap";

import Sidebar from '../../components/Sidebar/Sidebar';
import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card.jsx";
import Button from '../../elements/CustomButton/CustomButton.jsx';

require('datatables.net-responsive');
$.DataTable = require('datatables.net-bs');

@inject('userStore')
@observer
class Users extends Component {
    constructor() {
        super();
        this.state = {
            fetching: true,
            dataRows: [],
            dataTable: {headerRow: ['User Name', 'First Name', 'Last Name', 'Delete'],
                footerRow: ['User Name', 'First Name', 'Last Name', 'Delete'],

            }
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.addUserClicked = this.addUserClicked.bind(this);
        this.removeUser = this.removeUser.bind(this);
    }

    addUserClicked() {
        window.location.href = "#/new_user";
    }

    componentDidMount() {
        this.props.userStore.loadUsers((error, data) => {
            let rows = [];
            data.forEach(elem => {
                rows.push([elem.userName, elem.firstName, elem.lastName, elem.id]);
            })
            this.setState({
                data: data,
                fetching: false,
                dataRows : rows
            });
            console.log("Users", rows);
            $("#datatables").DataTable({
                "pagingType": "full_numbers",
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                responsive: true,
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search records",
                }
            });
            var table = $('#datatables').DataTable();
        });

    }
    componentWillUnmount(){
        $('.data-table-wrapper')
        .find('table')
        .DataTable()
        .destroy(true);
    }

    removeUser(prop) {
        this.props.userStore.deleteUser(prop, () => {
            this.props.userStore.loadUsers((error, data) => {
                let rows = [];
                data.forEach(elem => {
                    rows.push([elem.userName, elem.firstName, elem.lastName, elem.id]);
                })
                this.setState({
                    data: data,
                    fetching: false,
                    dataRows : rows
                });
            });
        })
    }

    render() {
        if (this.fetching) {
            return (            <div id="main-panel" className="main-panel">
                    <Sidebar {...this.props} />
                    <Header {...this.props}/>
                    <div className="main-content">
                        LOADING!!!
                        <Grid fluid>
                        </Grid>
                    </div>
                </div>
            )
        }
        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
                <div className="main-content">
                    <Grid fluid>
                        <Row>
                            <Col md={12}>
                                <div className="padding-bottom-10">
                                <Button
                                    bsStyle="info"
                                    pullLeft
                                    fill
                                    onClick={this.addUserClicked}
                                    type="submit"
                                >
                                    <i className="pe-7s-add-user"></i>
                                </Button>
                                </div>
                                <Card
                                    content={
                                        <div className="fresh-datatables">
                                            <table id="datatables" ref="main"
                                                   className="table table-striped table-no-bordered table-hover"
                                                   cellSpacing="0" width="100%" style={{width: "100%"}}>
                                                <thead>
                                                <tr>
                                                    <th>{ this.state.dataTable.headerRow[0] }</th>
                                                    <th>{ this.state.dataTable.headerRow[1] }</th>
                                                    <th>{ this.state.dataTable.headerRow[2] }</th>
                                                    <th className="disabled-sorting text-right">{ this.state.dataTable.headerRow[3] }</th>
                                                </tr>
                                                </thead>
                                                <tfoot>
                                                <tr>
                                                    <th>{ this.state.dataTable.footerRow[0] }</th>
                                                    <th>{ this.state.dataTable.footerRow[1] }</th>
                                                    <th>{ this.state.dataTable.footerRow[2] }</th>
                                                    <th className="text-right">{ this.state.dataTable.footerRow[3] }</th>
                                                </tr>
                                                </tfoot>
                                                <tbody>
                                                {
                                                    this.state.dataRows.map((prop, key) => {

                                                        return (
                                                            <tr key={key}>
                                                                {
                                                                    prop.map((prop, key) => {
                                                                        if (key == 3) {
                                                                            return <td className="text-right">
                                                                                <Button
                                                                                    bsStyle="info"
                                                                                    pullLeft
                                                                                    fill
                                                                                    onClick={() => this.removeUser(prop)}
                                                                                    type="button"
                                                                                >
                                                                                    <i className="pe-7s-trash"></i>
                                                                                </Button>
                                                                            </td>
                                                                        }
                                                                        return (
                                                                            <td key={key}>{prop}</td>
                                                                        );
                                                                    })
                                                                }

                                                            </tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>
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

export default Users;
