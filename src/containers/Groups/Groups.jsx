import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Button from "../../elements/CustomButton/CustomButton.jsx";
import Checkbox from "../../elements/CustomCheckbox/CustomCheckbox.jsx";
import $ from "jquery";
import {
    Col,
    Grid,
    Row,
    ButtonToolbar,
    ToggleButtonGroup,
    FormGroup,
    ControlLabel,
    FormControl,
    ToggleButton
} from "react-bootstrap";
import {Creatable} from 'react-select';
import Card from "../../components/Card/Card.jsx";
import {style} from "../../variables/Variables";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.

require('datatables.net-responsive');
$.DataTable = require('datatables.net-bs');


const headerRow = ['Id', 'Order', 'Name', 'Total', 'Checked', 'Remained', 'Source'];

@inject('userStore')
@inject('groupsStore')
@inject('appStore')
@observer
class Groups extends Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.updateGroups = this.updateGroups.bind(this);
        this.state = {
            isLoading: true,
            error: undefined,
            groups: [],
            transactionModes: [],
            realEstateTypes: [],
            startTime: 0,
            endTime: 0,
            sources: [],
            cityIds: [],
            districtIds: [],
            landmarks: [],
            projects: [],
            customerPhones: [],
        };
        ;
        let currentMode = this.state.transactionModes;
        let typeOptions = this.props.appStore.typeOptions || [];
        this.state.typeOptions = this.getTypeOptionsByMode(typeOptions, currentMode);
        this.state.modeOptions = this.props.appStore.modeOptions || [];
    }

    getTypeOptionsByMode(typeOptions, currentMode) {
        return typeOptions.filter(function (t) {
            return t.transactionTypeId == currentMode;
        });
    }

    updateGroups() {
        this.props.groupsStore.updateActiveGroups(this.props.userStore.token, () => {
            this.props.toast("Đã cập nhật")
        });
    }

    componentDidMount() {
        if (!this.props.userStore.token) {
            return this.setState({error: "No token"});
        }

        this.props.appStore.populateAppOptions(this.props.userStore.token);

        $("#GROUP_DATA_TABLE").DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            responsive: true,
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search records",
            }
        });
        const self = this;
        this.props.groupsStore.getGroupFilter(this.props.userStore.token, (error,data)=>{
            if (error) {
                self.setState({error, isLoading:false});
                return;
            }
            console.log(this.props.groupsStore.groupFilter);
            let parsedDistrictId = [];
            if (this.props.groupsStore.groupFilter.districtIds) {
                parsedDistrictId = this.props.groupsStore.groupFilter.districtIds.map(x => this.parseIdToMapForm(x));
                parsedDistrictId = parsedDistrictId.filter(x => x != null);
            }
            self.setState({
                transactionModes: this.props.groupsStore.groupFilter.transactionModes,
                startTime: this.props.groupsStore.groupFilter.startTime,
                endTime: this.props.groupsStore.groupFilter.endTime,
                sources: this.props.groupsStore.groupFilter.sources,
                districtIds: parsedDistrictId,
                customerPhones: this.props.groupsStore.groupFilter.customerPhones,
                isLoading: false
            });
            console.log(parsedDistrictId);
        });
    }

    componentWillUnmount() {
        $('#GROUP_DATA_TABLE')
            .DataTable()
            .destroy(true);
    }

    onModeUpdated(e) {
        let modeValue = e;
        this.setState({transactionModes: modeValue});
        // filter type options based on current mode
        // let filteredTypeOptions = this.props.appStore.typeOptions.filter(function (t) {
        //     return modeValue.includes(t.transactionTypeId);
        // });
        // this.setState({typeOptions: filteredTypeOptions});
    }

    onTypeUpdated(e) {
        let realEstateTypeId = parseInt(e.target.value);
        this.setState({realEstateTypes: realEstateTypeId});
    }

    onStartDayUpdated(e) {
        let timeToSecond = (new Date(e.target.value)).getTime();
        this.setState({startTime: timeToSecond});
    }

    onEndDayUpdated(e) {
        console.log(e.target.value);
        let timeToSecond = (new Date(e.target.value)).getTime();
        this.setState({endTime: timeToSecond});
        console.log(timeToSecond);
    }

    onProjectUpdated(value) {
        console.log(value);
        this.setState({project: value});
    }

    onProjectChange(inputValue) {
        this.props.appStore.searchProject(inputValue, this.props.userStore.token, () => {
            this.setState({projectSelection: this.props.appStore.projectSelection.slice()})
        });
    }

    onLandmarkUpdated(value) {
        this.setState({landmark: value});
    }

    onLandmarkChange(inputValue) {
        this.props.appStore.searchLandmark(inputValue, this.props.userStore.token, () => {
            this.setState({landmarkSelection: this.props.appStore.landmarkSelection.slice()})
        });
    }

    onCityUpdated(e) {
        this.props.appStore.getDistricts(e.target.value);
        this.setState({cityIds: e.target.value});
    }

    onDistrictUpdated(value) {
        this.setState({districtIds: value});
    }

    onSourceUpdated(value) {
        this.setState({sources: value});
    }

    onPhoneUpdated(customerPhones) {
        this.setState({customerPhones});
    }


    filterGroup() {
        let self = this;
        this.props.groupsStore.setGroupFilter(this.props.userStore.token,this.state, (error)=>{
            if (error) {
                self.setState({error, isLoading:false});
                return;
            }
            this.props.groupsStore.fetchGroups(this.props.userStore.token, (error) => {
                if (error) {
                    self.setState({error, isLoading: false});
                    return;
                }
                const _groups = self.props.groupsStore.groups.map(group => {
                    return [group.id, group.active, group.name, group.total, group.checked, group.remain, group.facebookId]
                });
                self.setState({groups: _groups, isLoading: false});
                $('#GROUP_DATA_TABLE').DataTable();
            });
        });
    }

    convertMilliSecondtoDateString(time) {
        if (time != 0) {
            let date = new Date(time);
            let dateString = [date.getFullYear(),
                ((date.getMonth()+1) > 9 ? '' : '0') + (date.getMonth()+1),
                (date.getDate() > 9 ? '' : '0') + date.getDate()
            ].join('-');
            return dateString;
        } else {
            return null;
        }
    }

    parseIdToMapForm(id) {
        if (this.props.appStore.districtOptions) {
            console.log(id);
            for (let i =0; i<this.props.appStore.districtOptions.length;i++) {
                console.log(this.props.appStore.districtOptions[i].value);
                if (this.props.appStore.districtOptions[i].value == id) {
                    console.log(this.props.appStore.districtOptions[i]);
                    return this.props.appStore.districtOptions[i];
                }
            }
        }
        return null;
    }

    render() {
        let content;
        if (this.state.error) {
            content = (
                <div>
                    <h1>ERROR:</h1>
                    <pre>{JSON.stringify(this.state.error)}</pre>
                </div>
            );
        } else if (this.state.isLoading == true) {
            content = (<div style={style.Loading}></div>);
        } else {
            const filter = (
                <form>
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup>
                                <ControlLabel>Loại GĐ:</ControlLabel>
                                <ButtonToolbar>
                                    <ToggleButtonGroup type="checkbox" value={this.state.transactionModes} name="mode" onChange={this.onModeUpdated.bind(this)} >
                                        {/*{*/}
                                            {/*this.props.appStore.modeOptions.map(option => {*/}
                                                {/*return (<ToggleButton key={option.id} value={option.id} bsStyle="primary">{option.name}</ToggleButton>);*/}
                                            {/*})*/}
                                         {/*}*/}
                                        <ToggleButton key={1} value={1} bsStyle="primary">Mua</ToggleButton>
                                        <ToggleButton key={2} value={2} bsStyle="primary">Thue</ToggleButton>
                                    </ToggleButtonGroup>
                                </ButtonToolbar>
                            </FormGroup>
                        </div>

                        <div className="col-md-6">
                            <div className="row">
                                {/*<div className="col-md-6">*/}
                                    {/*<FormGroup controlId="formControlsSelect">*/}
                                        {/*<ControlLabel>Loại BĐS: </ControlLabel>*/}
                                        {/*<FormControl bsClass='form-control'*/}
                                                     {/*componentClass="select"*/}
                                                     {/*placeholder="select"*/}
                                                     {/*onChange={this.onTypeUpdated.bind(this)}>*/}
                                            {/*{this.state.typeOptions.map(option => {*/}
                                                {/*return <option value={option.id}>{option.name}</option>*/}
                                            {/*})}*/}
                                        {/*</FormControl>*/}
                                    {/*</FormGroup>*/}
                                {/*</div>*/}
                                <div className="col-md-6">
                                    <FormGroup controlId="formControlsSelect">
                                        <ControlLabel>Nguồn: </ControlLabel>
                                        <ButtonToolbar>
                                            <ToggleButtonGroup type="checkbox" value={this.state.sources} name="sources" onChange={this.onSourceUpdated.bind(this)} >
                                                <ToggleButton key={1} value={1} bsStyle="primary">Viber</ToggleButton>
                                                <ToggleButton key={2} value={2} bsStyle="primary">Facebook</ToggleButton>
                                            </ToggleButtonGroup>
                                        </ButtonToolbar>
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <FormGroup controlId="formControlsSelection">
                                        <ControlLabel>Từ</ControlLabel>
                                        <FormControl bsClass='form-control'
                                                     type="date"
                                                     value={this.convertMilliSecondtoDateString(this.state.startTime)}
                                                     placeholder="Ngày"
                                                     onChange={this.onStartDayUpdated.bind(this)}/>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup controlId="formControlsSelection">
                                        <ControlLabel>Đến</ControlLabel>
                                        <FormControl bsClass='form-control'
                                                     type="date"
                                                     value={this.convertMilliSecondtoDateString(this.state.endTime)}
                                                     placeholder="Ngày"
                                                     onChange={this.onEndDayUpdated.bind(this)}/>
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                        {/*<div className="col-md-6">*/}
                            {/*<FormGroup controlId="formControlsSelect">*/}
                                {/*<ControlLabel>Landmark</ControlLabel>*/}
                                {/*<Creatable*/}
                                    {/*name="LandmarkSelection"*/}
                                    {/*placeholder="Landmark"*/}
                                    {/*multi={true}*/}
                                    {/*value={this.state.landmark}*/}
                                    {/*options={this.state.landmarkSelection}*/}
                                    {/*onInputChange={this.onLandmarkChange.bind(this)}*/}
                                    {/*onChange={this.onLandmarkUpdated.bind(this)}>*/}
                                {/*</Creatable>*/}
                            {/*</FormGroup>*/}
                        {/*</div>*/}
                    </div>
                    {/*<div className="row">*/}
                        {/*<div className="col-md-6">*/}
                            {/*<FormGroup controlId="formControlsSelect">*/}
                                {/*<ControlLabel>Project</ControlLabel>*/}
                                {/*<Creatable*/}
                                    {/*name="ProjectSelection"*/}
                                    {/*placeholder="Project"*/}
                                    {/*value={this.state.project}*/}
                                    {/*options={this.state.projectSelection}*/}
                                    {/*onInputChange={this.onProjectChange.bind(this)}*/}
                                    {/*onChange={this.onProjectUpdated.bind(this)}>*/}
                                {/*</Creatable>*/}
                            {/*</FormGroup>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Tỉnh/TP</ControlLabel>
                                <FormControl bsClass='form-control'
                                             componentClass="select"
                                             onChange={this.onCityUpdated.bind(this)}
                                >
                                    {this.props.appStore.cityOptions.map(option => {
                                        return <option defaultValue={this.state.cityIds == 24} value={option.id}>{option.name}
                                        </option>
                                    })}
                                </FormControl>
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Quận/Huyện</ControlLabel>
                                <Creatable
                                    name="DistrictSelection"
                                    placeholder="District"
                                    multi
                                    value={this.state.districtIds}
                                    options={this.props.appStore.districtOptions}
                                    onChange={this.onDistrictUpdated.bind(this)}>
                                </Creatable>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup controlId="formBasicText">
                                <ControlLabel>SDT khách hàng</ControlLabel>
                                <TagsInput value={this.state.customerPhones} onChange={this.onPhoneUpdated.bind(this)} />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <Button
                                bsStyle="info"
                                fill
                                type="button"
                                onClick={this.filterGroup.bind(this)}
                            >
                                Filter
                            </Button>

                        </div>
                    </div>
                </form>
            );
            const datatable = (
                <div className="fresh-datatables">
                    <table id="GROUP_DATA_TABLE" ref="main"
                           className="table table-striped table-no-bordered table-hover"
                           cellSpacing="0" width="100%" style={{width: "100%"}}>
                        <thead>
                        <tr>
                            <th>{headerRow[1]}</th>
                            <th>{headerRow[2]}</th>
                            <th>{headerRow[3]}</th>
                            <th>{headerRow[4]}</th>
                            <th>{headerRow[5]}</th>
                            <th>{headerRow[6]}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.groups.map((group, key) => {
                                return (

                                    <tr key={key}>

                                        {
                                            group.map((prop, key) => {
                                                if (key == 0) return;
                                                if (key == 1) {
                                                    return <td>
                                                        <Checkbox
                                                            number={group[0]}
                                                            isChecked={group[1] == true}
                                                            onClick={() => (this.props.groupsStore.toggle(group[0]))}
                                                        />
                                                    </td>
                                                }
                                                if (key == 6) {
                                                    if (!prop || prop === null) {
                                                        return <td key={key}>{"Viber"}</td>
                                                    } else {
                                                        return <td
                                                            key={key}>{"Facebook"}</td>
                                                    }
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
                    <Button
                        bsStyle="info"
                        fill
                        type="button"
                        onClick={this.updateGroups}
                    >
                        Submit
                    </Button>
                </div>
            );
            content = (
                <div>
                    <Row>
                        <div className="col-xs-12">
                            <Card
                                title="Filter"
                                content={filter}
                            />
                        </div>
                    </Row>
                    <Row>
                        <div className="col-xs-12">
                            <Card
                                content={datatable}
                            />
                        </div>
                    </Row>
                </div>
            );
        }
        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>

                <div className="main-content">
                    <Grid fluid>
                        {content}
                    </Grid>
                </div>
            </div>
        );
    }
}

export default Groups;
