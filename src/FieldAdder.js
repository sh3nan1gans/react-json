import React, { Component } from 'react';
import TypeField from './TypeField';

/**
 * Component to add fields to an Object or Array.
 * @param  {FreezerNode} root The parent to add the attribute.
 * @param  {string} name Optional. If provided, the attribute added will have that key (arrays).
 *                           Otherwise an input will be shown to let the user define the key.
 */
class FieldAdder extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			creating: this.props.creating || false,
			name: this.props.name,
			type: 'string'
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		if( !prevState.creating && this.state.creating ){
			if( this.refs.keyInput )
			this.refs.keyInput.focus();
			else
			this.refs.typeSelector.focus();
		}
	}

	componentWillReceiveProps( newProps ) {
		this.setState({name: newProps.name});
	}

	handleCreate(e) {
		e.preventDefault();
		this.setState({creating: true});
	}

	handleCancel(e) {
		e.preventDefault();
		this.setState({creating: false});
	}

	changeType(e) {
		this.setState({type: e.target.value});
	}

	changeKey(e) {
		this.setState({name: e.target.value});
	}

	createField() {
		this.setState({creating: false});

		var value = TypeField.prototype.getComponents()[ this.state.type ].prototype.defaultValue;

		this.props.onCreate( this.state.name, value, {type: this.state.type });
	}

	getTypes() {
		return Object.keys( TypeField.prototype.getComponents() );
	}

	render() {
		if( !this.state.creating )
			return React.DOM.a({ className: 'jsonAdd', onClick: this.handleCreate }, this.props.text );

		var options = this.getTypes().map( function( type ){
				return React.DOM.option({value: type, key: type}, type[0].toUpperCase() + type.slice(1));
			}),
			fieldName
		;

		if( typeof this.props.name != 'undefined' )
			fieldName =  [
				React.DOM.span({className: 'jsonName'}, this.props.name),
				React.DOM.span(null, ':')
			];
		else {
			fieldName = [
				React.DOM.input({ref: 'keyInput', type: 'text', value: this.state.value, onChange: this.changeKey}),
				React.DOM.span(null, ':')
			];
		}

		return React.DOM.div( {className: 'jsonField jsonFieldAdder'}, [
			fieldName,
			React.DOM.select({ key: 's', value: this.state.type, onChange: this.changeType, ref: 'typeSelector'}, options),
			React.DOM.button({ key: 'b', onClick: this.createField }, 'OK' ),
			React.DOM.a({ key: 'a', className: 'cancelField', onClick: this.handleCancel}, 'Cancel')
		]);
	}
};

module.exports = FieldAdder;
