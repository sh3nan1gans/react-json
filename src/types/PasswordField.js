import React, { Component } from 'react';
import LeafMixin from '../../mixins/LeafFieldMixin';

/**
 * Component for editing a password.
 * @param  {string} value The value of the password.
 * @param  {Mixed} original The value of the component it the original json.
 * @param {FreezerNode} parent The parent node to let the password component update its value.
 */
class PasswordField extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			mixins: [LeafMixin],
			typeClass: 'jsonPassword',
			inputType: 'password',
			defaultValue: '',
		}
	}

	getDisplayModeString(){
		return this.getWildcards();
	}

	getWildcards(){
		var out = '';
		for (var i = this.state.value.length - 1; i >= 0; i--) {
			out += '*';
		}
		return out;
	}

	isType(){
		return false;
	}

	updateValue( e ){
		this.setState({ value: e.target.value });
	}

	render(){
		return this.renderInput();
	}
};

export default PasswordField;
