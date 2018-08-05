import React, {Component} from "react";
import {Col, Grid, Row} from "react-bootstrap";
import {scaleLinear} from "d3-scale";
import {ComposableMap, Geographies, Geography, ZoomableGroup} from "react-simple-maps";
import StatsCard from "../../components/Card/StatsCard.jsx";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

import {table_data} from "../../variables/Variables.jsx";

const colorScale = scaleLinear()
    .domain([0, 1, 6820])
    .range(["#E5E5E5", "#B2B2B2", "#000000"]);

class Dashboard extends Component {
    createTableData() {
        var tableRows = [];
        for (var i = 0; i < table_data.length; i++) {
            tableRows.push(
                <tr key={i}>
                    <td>
                        <div className="flag">
                            <img src={table_data[i].flag} alt="us_flag"/>
                        </div>
                    </td>
                    <td>{table_data[i].country}</td>
                    <td className="text-right">{table_data[i].count}</td>
                    <td className="text-right">{table_data[i].percentage}</td>
                </tr>
            );
        }
        return tableRows;
    }

    render() {
        return (
            <div id="main-panel" className="main-panel">
                <Sidebar {...this.props} />
                <Header {...this.props}/>
                <div className="main-content">
                    <Grid fluid>
                        <Row>
                            <Col lg={3} sm={6}>
                                <StatsCard
                                    statsText="Van Phan"
                                    statsIcon={<i className="fa fa-refresh"></i>}
                                    statsIconText="Doing #123"
                                />
                            </Col>
                            <Col lg={3} sm={6}>
                                <StatsCard
                                    statsText="Logan"
                                    statsIcon={<i className="fa fa-calendar-o"></i>}
                                    statsIconText="Doing #234"
                                />
                            </Col>
                            <Col lg={3} sm={6}>
                                <StatsCard
                                    statsText="Bulgan"
                                    statsIcon={<i className="fa fa-clock-o"></i>}
                                    statsIconText="Writing document"
                                />
                            </Col>
                            <Col lg={3} sm={6}>
                                <StatsCard
                                    statsText="Filip"
                                    statsIcon={<i className="fa fa-refresh"></i>}
                                    statsIconText="Writing document"
                                />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default Dashboard;
