'use strict';

import PropTypes from 'prop-types';
import React from 'react';
import deepSettings from './deepSettings';
import objectAssign from 'object-assign';

var components = {};
var typeCheckOrder = [];

class TypeField extends React.Component {
	constructor(props) {
		super(props)
	}

	components: {},
  hiddenTypes: [],
	typeCheckOrder: [],

	contextTypes: {
		typeDefaults: PropTypes.object
	},

	render: function() {
		var Component = this.getComponent(),
			settings = objectAssign(
				{},
				this.context.typeDefaults[ this.props.type ],
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
	},

  getComponents: function() {
    if (this.hiddenTypes.length > 0) {
      var rtn = {};
      for (var key in this.components) {
        if (this.hiddenTypes.indexOf(key) === -1) {
          rtn[key] = this.components[key];
        }
      }
      return rtn;
    } else {
      return this.components;
    }
  },

	getComponent: function(){
		var type = this.props.type;
		if( !type )
			type = this.guessType( this.props.value );

		this.fieldType = type;

		return this.components[ type ];
	},

	guessType: function( value ){
		var type = false,
			i = 0,
			types = this.typeCheckOrder,
			component
		;

		while( !type && i < types.length ){
			component = this.components[ types[i] ].prototype;
			if( component.isType && component.isType( value ) )
				type = types[i++];
			else
				i++;
		}

		return type || 'object';
	},

	getValidationErrors: function( jsonValue ){
		return this.refs.field.getValidationErrors( jsonValue );
	},

	addDeepSettings: function( settings ){
		var parentSettings = this.props.parentSettings || {},
			deep
		;

		for( var key in deepSettings ){
			deep = deepSettings[ key ]( parentSettings[key], settings[key] );
			if( typeof deep != 'undefined' )
				settings[ key ] = deep;
		}
 	}
});

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
