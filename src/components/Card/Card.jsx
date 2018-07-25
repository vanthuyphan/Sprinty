import React, { Component } from 'react';


export class Card extends Component{
    render(){
        return (
            <div className={"card "+this.props.cardClass}>
                {
                    (this.props.title !== undefined) || (this.props.category !== undefined) ?
                    (
                        <div className="header">
                            <h4 className="title text-center">{this.props.title}</h4>
                            <p className="category">{this.props.category}</p>
                        </div>
                    ) : ""
                }
                <div className={"content "
                    + (this.props.ctAllIcons ? " all-icons":"")
                    + (this.props.ctFullWidth ? " content-full-width":"")
                    + (this.props.ctTextCenter ? " text-center":"")
                    + (this.props.tableFullWidth ? " table-full-width":"")
                    + (this.props.contentClass ? " " + this.props.contentClass:"")}>
                    <div id={this.props.id} className={this.props.classes}>
                        {this.props.content}
                    </div>
                    <div className={"footer"
                    + ( this.props.ftTextCenter ? " text-center":"" )}>
                        {this.props.legend !== undefined ? (
                            <div className="legend">
                                {this.props.legend}
                            </div>
                        ):null}
                        {this.props.stats !== undefined ? (<hr />):null}
                        {this.props.stats !== undefined ? (
                            <div className="stats">
                                {this.props.stats}
                            </div>
                        ):null}
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;
