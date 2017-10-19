import React, { Component } from 'react';
import LeafMixin from '../../mixins/LeafFieldMixin';
/**
 * Component for editing a string.
 * @param  {string} value The value of the string.
 * @param  {Mixed} original The value of the component it the original json.
 * @param {FreezerNode} parent The parent node to let the string component update its value.
 */
class StringField extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			mixins: [LeafMixin],
			typeClass: 'jsonString',
			inputType: 'text',
			defaultValue: ''
		}
	}

	updateValue( e ) {
		this.setState({ value: e.target.value });
	}

	isType( value ) {
		return typeof value != 'object';
	}

	render() {
		return this.renderInput();
	}

};

module.exports = StringField;
