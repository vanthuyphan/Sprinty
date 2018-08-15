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
class Report extends Component {
    constructor() {
        super();
        this.state = {
            fetching: true,
            dataRows: [],
            dataTable: {headerRow: ['Created Date', 'Task', 'Content', 'User'],
                footerRow: ['Created Date', 'Task', 'Content', 'User'],

            }
        }
        this.componentDidMount = this.componentDidMount.bind(this);
    }


    componentDidMount() {
        this.props.userStore.loadReport((error, data) => {
            let rows = [];
            data.forEach(activity => {
                rows.push([activity.createdDate, activity.taskId, activity.content, activity.userId]);
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
                                                    <th>{ this.state.dataTable.headerRow[3] }</th>
                                                </tr>
                                                </thead>
                                                <tfoot>
                                                <tr>
                                                    <th>{ this.state.dataTable.footerRow[0] }</th>
                                                    <th>{ this.state.dataTable.footerRow[1] }</th>
                                                    <th>{ this.state.dataTable.footerRow[2] }</th>
                                                    <th>{ this.state.dataTable.footerRow[3] }</th>
                                                </tr>
                                                </tfoot>
                                                <tbody>
                                                {
                                                    this.state.dataRows.map((prop, key) => {

                                                        return (
                                                            <tr key={key}>
                                                                {
                                                                    prop.map((prop, key) => {
                                                                        return <td key={key}>{prop}</td>;
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

export default Report;
