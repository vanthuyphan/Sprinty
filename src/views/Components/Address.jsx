import React, { Component } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

class Address extends Component {

    constructor(props) {
        super(props);
        this.state = { address: this.props.value}
        this.onChange = this.onChange.bind(this);
    }

    onChange = (address) => {
        this.setState({address})
        geocodeByAddress(this.state.address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                this.props.onChange({address: this.state.address, latLng: latLng})
            })
            .catch(error => console.error('Error', error))
    }

    render() {
        const inputProps = {
            value: this.state.address,
            onChange: this.onChange,
        }

        return (
            <PlacesAutocomplete
                inputProps={inputProps}
                styles={defaultStyles}
            />
        )
    }
}

const defaultStyles = {
    input: {
        display: 'inline-block',
        width: '100%',
        border: '1px solid #ccc',
        borderRadius: '4px',
        height: '40px',
        padding: '6px 12px',
        fontSize: '14px',
        lineHeight: '1.42857143',
        color: '#555'
    }
}
export default Address;
