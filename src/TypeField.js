'use strict';

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import deepSettings from './deepSettings';
import objectAssign from 'object-assign';

var components = {};
var typeCheckOrder = [];

class TypeField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			components: {},
			hiddenTypes: [],
			typeCheckOrder: [],

			contextTypes: {
				typeDefaults: PropTypes.object
			}
		}
	}

	getComponents() {
		if (this.state.hiddenTypes.length > 0) {
			var rtn = {};
			for (var key in this.state.components) {
				if (this.state.hiddenTypes.indexOf(key) === -1) {
					rtn[key] = this.state.components[key];
				}
			}
			return rtn;
		} else {
			return this.state.components;
		}
	}

	getComponent() {
		var type = this.props.type;
		if( !type )
		type = this.guessType( this.props.value );

		this.fieldType = type;

		return this.state.components[ type ];
	}

	guessType( value ) {
		var type = false,
		i = 0,
		types = this.state.typeCheckOrder,
		component
		;

		while( !type && i < types.length ){
			component = this.state.components[ types[i] ].prototype;
			if( component.isType && component.isType( value ) )
			type = types[i++];
			else
			i++;
		}

		return type || 'object';
	}

	getValidationErrors( jsonValue ) {
		return this.refs.field.getValidationErrors( jsonValue );
	}

	addDeepSettings ( settings ) {
		var parentSettings = this.props.parentSettings || {},
		deep
		;

		for( var key in deepSettings ){
			deep = deepSettings[ key ]( parentSettings[key], settings[key] );
			if( typeof deep != 'undefined' )
			settings[ key ] = deep;
		}
	}

	render() {
		var Component = this.getComponent(),
			settings = objectAssign(
				{},
				this.state.contextTypes.typeDefaults[ this.props.type ],
				this.props.settings
			)
		;

		this.addDeepSettings( settings );

		return React.createElement( Component, {
			value: this.props.value,
			settings: settings,
			onUpdated: this.props.onUpdated,
			id: this.props.id,
			ref: 'field'
		});
	}
}

TypeField.registerHiddenTypes = function(types) {
  TypeField.prototype.hiddenTypes = types;
}

TypeField.registerType = function( name, Component, selectable ){
	var proto = TypeField.prototype;
	proto.components[ name ] = Component;
	if( selectable )
		proto.typeCheckOrder.unshift( name );
};

module.exports = TypeField;
