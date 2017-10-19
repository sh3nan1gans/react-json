import React, { Component } from 'react'
import LeafMixin from '../../mixins/LeafFieldMixin'
/**
 * Component for editing a number.
 * @param  {string} value The value of the string.
 * @param  {Mixed} original The value of the component it the original json.
 * @param {FreezerNode} parent The parent node to let the string component update its value.
 */
class NumberField extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			mixins: [LeafMixin],
			typeClass: 'jsonNumber',
			inputType: 'number',
			defaultValue: '',
		}
	}

	updateValue( e ){
		this.setState({ value: parseFloat( e.target.value ) });
	}

	isType( value ){
		return typeof value == 'number';
	}

	render(){
		return this.renderInput();
	}
};

module.exports = NumberField;
