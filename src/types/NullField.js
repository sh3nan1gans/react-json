import React, { Component } from 'react';
import FieldCreator from '../FieldCreator';
/**
 * Component for editing a string.
 * @param  {string} value The value of the string.
 * @param  {Mixed} original The value of the component it the original json.
 * @param {FreezerNode} parent The parent node to let the string component update its value.
 */
class NullField extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			editing: !props.value,
			value: props.value,
			defaultValue: null,
		}
	}

	setEditMode(){
		this.setState({editing: true});
	}

	onTypeSelected( key, value, options ){
		this.props.onUpdate( value, options );
	}

	onCancel(){
		this.setState({editing: false});
	}

	isType( value ){
		return value === null;
	}

	render(){
		var className = 'nullAttr';

		if( !this.state.editing )
			return <span onClick={ this.setEditMode } className={ className }>null</span>;

		return <FieldCreator type="null" onCreate={ this.onTypeSelected } onCancel={ this.onCancel } />;
	}
});

module.exports = NullField;
