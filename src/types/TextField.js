import React, { Component } from 'react';
import LeafMixin from '../../mixins/LeafFieldMixin';

/**
 * Component for editing a long string.
 * @param  {string} value The value of the string.
 * @param  {Mixed} original The value of the component it the original json.
 * @param {FreezerNode} parent The parent node to let the string component update its value.
 */
class TextField extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			mixins: [LeafMixin],
			defaultValue: ''
		}
	}

	updateValue( e ){
		this.setState({ value: e.target.value });
	}

	isType( value ){
		return typeof value == 'string' && value.length > 100;
	}

	render(){
		var className = 'jsonText';

		if( !this.state.editing )
			return React.DOM.span( {onClick: this.setEditMode, className: className}, this.props.value );

		return React.DOM.textarea({
			value: this.state.value,
			id: this.props.id,
			onChange: this.updateValue,
			placeholder: this.props.settings.placeholder || '',
			onBlur: this.setValue,
			ref: 'input'
		});
	}
};

module.exports = TextField;
