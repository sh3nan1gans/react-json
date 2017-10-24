import React, { Component } from 'react';
/**
 * Component for editing a boolean.
 * @param  {string} value The value of the boolean.
 */
class BooleanField extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			defaultValue: false,
		}
	}

	updateValue( e ){
		this.props.onUpdated( e.target.checked );
	}

	isType( value ){
		return typeof value == 'boolean';
	}

	componentWillReceiveProps( nextProps ){
		if( this.props.value != nextProps.value )
		this.setState( { value: nextProps.value } );
	}

	render(){
		var className = 'jsonBoolean';

		return React.DOM.input({
			type: "checkbox",
			className: className,
			id: this.props.id,
			checked: this.props.value,
			onChange: this.updateValue
		});
	}
};

module.exports = BooleanField;
