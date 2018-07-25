import React, {Component} from "react";
import {Card} from "../../components/Card/Card.jsx";
import {inject, observer} from "mobx-react";
import {ToastContainer} from "react-toastr";
import { Table, OverlayTrigger, Tooltip, Grid, Col,
    Row, DropdownButton, MenuItem, FormGroup,
    ControlLabel, FormControl, Alert } from 'react-bootstrap';
import Checkbox from "../../elements/CustomCheckbox/CustomCheckbox.jsx";
import Button from "../../elements/CustomButton/CustomButton.jsx";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from "../../components/Header/Header";
import Select from 'react-select';
import Loader from 'react-loader';
import 'react-select/dist/react-select.css';

const header = [
    {value: "index", label: "#", className: "text-center"},
    {value: "message", label: "Message", className: "th-description"},
    {value: "transaction_type", label: "Mode", className: ""},
    {value: "real_estate_type", label: "Type", className: ""},
    {value: "price", label: "Price", className: "text-right"},
    {value: "price_unit", label: "Price Unit", className: "text-center"},
    {value: "area", label: "Area", className: "text-right"},
    {value: "area_unit", label: "Area Unit", className: "text-center"},
    {value: "width", label: "Width", className: "text-right"},
    {value: "length", label: "Length", className: "text-right"},
    {value: "num_of_bedrooms", label: "Bed", className: "text-right"},
    {value: "num_of_wcs", label: "Bath", className: "text-right"},
    {value: "directions", label: "Direction", className: "text-center"}
];

@inject('userStore')
@inject('diffListingsStore')
@observer
export class DiffListings extends Component {
    constructor(props) {
        super(props);
        this.fields = this.buildFilterFields();
        this.tok = this.props.userStore.token;
        this.fetchDiffListings = this.fetchDiffListings.bind(this);
        this.state = {
            totalMessages: 0,
            multipleSelectFields: this.buildFilterFields(),
            data: [],
            numIncorrect: 0,
            loading: false,
        }
    }

    fetchDiffListings() {
        let fields = [];
        for(let f of Object.values(this.state.multipleSelectFields)) {
            fields.push(f.value);
        }

        this.setState({loading: true});

        this.props.diffListingsStore.fetchDiffListings(this.tok, this.state.totalMessages, fields, (response) => {
            this.setState({
                data: this.props.diffListingsStore.diffListings,
                numIncorrect: this.props.diffListingsStore.diffListings.length,
                loading: false});
        });
    }

    onSelectedFieldChange(e) {
        this.setState({multipleSelectFields: e}, () => {
            this.filterDataRow();
        });
    }

    filterDataRow() {
        let data = this.state.data;
        let numIncorrect = 0;
        for(let dataRow of Object.values(data)) {
            dataRow.isDifferent = false;

            for(let fieldObject of Object.values(this.state.multipleSelectFields)) {
                let field = fieldObject.value;
                if (dataRow.parsedValues[field] != dataRow.actualValues[field]) {
                    dataRow.isDifferent = true;
                    numIncorrect += 1;
                    break;
                }
            }
        }

        this.setState({data: data});
        this.setState({numIncorrect: numIncorrect});
    }

    onTotalMessagesUpdated(e) {
        this.setState({totalMessages: e.target.value});
    }

    buildFilterFields() {
        let fields = [];
        for(let h of Object.values(header)) {
            if (h.value != "index" && h.value != "message") {
                fields.push({value: h.value, label: h.label});
            }
        }
        return fields;
    }

    createTableData() {
        let diffListingTable = [];

        // build header row
        let tableHeaders = header.map((h) =>
            <th key={h.value} className={h.className}>{h.label}</th>
        );

        diffListingTable.push(
            <thead key={-2}>
                <tr key={-1}>
                    {tableHeaders}
                </tr>
            </thead>
        );

        // build content rows
        let tableRows = [];
        for(let i = 0; i < this.state.data.length; i++) {
            tableRows.push(this.createTableRow(header, i, this.state.data[i], true));
            tableRows.push(this.createTableRow(header, i, this.state.data[i], false));
        }

        diffListingTable.push(
            <tbody key={0}>
                {tableRows}
            </tbody>
        );

        return diffListingTable;
    }

    createTableRow(header, rowIndex, dataRow, isParsedRow) {
        // build content cells
        let tableCells = [];
        for (let h of Object.values(header)){
            let colName = h.value;
            let className = h.className;
            let value = "";

            // only show index & message for parsed row
            if (colName == "index") {
                value = isParsedRow ? rowIndex + 1 : "";
            } else if (colName == "message") {
                value = isParsedRow ? dataRow.message : "";
            } else {
                value = isParsedRow ? dataRow.parsedValues[colName] : dataRow.actualValues[colName];
                if (dataRow.parsedValues[colName] != dataRow.actualValues[colName]){
                    // className += rowIndex % 2 == 0 ? " warning" : " info";
                    className += " info";
                }

            }
            tableCells.push(<td key={dataRow.rawId + colName} className={className}> {value} </td>);
        }

        let className = dataRow.isDifferent ? "" : "hidden";

        return (
            <tr key={dataRow.rawId + isParsedRow} name={dataRow.rawId} className={className}>
                {tableCells}
            </tr>
        );
    }

    render() {
        const options = {
            lines: 13,
            length: 20,
            width: 10,
            radius: 10,
            scale: 1.00,
            corners: 1,
            color: '#000',
            opacity: 0.25,
            rotate: 0,
            direction: 1,
            speed: 1,
            trail: 60,
            fps: 20,
            zIndex: 2e9,
            top: '50%',
            left: '50%',
            shadow: false,
            hwaccel: false,
            position: 'absolute'
        };

        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
               <div className="main-content">
                    <Grid fluid>
                        <Card
                            title="List Incorrect Parsed Messages"
                            cardClass=""
                            tableFullWidth="true"
                            legend=""
                            content={
                                <div>
                                <Row>
                                    <Col md={12}>
                                        <div className="content">
                                            <Alert bsStyle="info">
                                                <span><b> INFO - </b>
                                                There are {this.state.numIncorrect} errors per {this.state.totalMessages} parsed messages recently
                                                </span>
                                            </Alert>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={9}>
                                        <div className="content">
                                            <Select
                                                placeholder="Select extracted fields"
                                                closeOnSelect={false}
                                                multi={true}
                                                name="multipleSelect"
                                                value={this.state.multipleSelectFields}
                                                options={this.fields}
                                                onChange={this.onSelectedFieldChange.bind(this)}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div className="content">
                                            <FormControl
                                                type="number"
                                                default={0}
                                                value={this.state.totalMessages}
                                                onChange={this.onTotalMessagesUpdated.bind(this)}
                                                placeholder="Tổng số tin duyệt"
                                            />
                                        </div>
                                    </Col>
                                    <Col md={1}>
                                        <div className="content">
                                            <Button round pullRight type="button" onClick={this.fetchDiffListings}>
                                                <i className="glyphicon fa fa-refresh"></i>
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                    <Table hover striped className="table-bigboy">
                                        {this.createTableData()}
                                    </Table>
                                    </Col>
                                    <Col md={12}>
                                        <Loader loaded={!this.state.loading} options={options} className="spinner" />
                                    </Col>
                                </Row>
                                </div>
                            }
                        />
                    </Grid>
                </div>
            </div>
        );
    }
}

export default DiffListings;