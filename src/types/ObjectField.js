'use strict';
import React, { Component } from 'react'
import Field from '../Field'
import assign from 'object-assign'
import CompoundFieldMixin from '../../mixins/CompoundFieldMixin'

/**
 * Component for editing a hash.
 * @param  {FreezerNode} value The value of the object.
 * @param  {Mixed} original The value of the component it the original json.
 */
class ObjectField extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			mixins: [CompoundFieldMixin],
			editing: props.setting.editing || false,
			fields: assign({}, props.settings && props.settings.fields || {}),
			defaultValue: {}
		}
	}

	renderField( key, fixedFields ) {
		var value = this.props.value[ key ],
		definition = this.state.fields[ key ] || {},
		fixed = fixedFields === true || typeof fixedFields == 'object' && fixedFields[ key ]
		;

		if( !definition.settings )
		definition.settings = {};

		return React.createElement( Field, {
			value: value,
			key: key,
			name: key,
			ref: key,
			fixed: fixed,
			id: this.props.id,
			definition: definition,
			onUpdated: this.updateField,
			onDeleted: this.deleteField,
			parentSettings: this.props.settings
		});
	}

	renderGroup( fieldNames, fixedFields, groupNumber ) {
		var me = this,
		fields = []
		;

		fieldNames.forEach( function( field ){
			fields.push( me.renderField( field, fixedFields ) );
		});

		return React.DOM.div({ className: 'jsonGroup jsonGroup_' + groupNumber }, fields );
	}

	getDefaultHeader() {
		return 'Map [' + Object.keys( this.props.value ).length + ']';
	}

	getDefaultAdder() {
		return '+ Add field';
	}

	updateField( key, value ) {
		this.checkEditingSetting( key );
		this.props.value.set( key, value );
	}

	deleteField( key ) {
		this.props.value.remove( key );
	}

	getValidationErrors( jsonValue ) {
		var me = this,
		errors = [],
		attrs = Object.keys( this.refs )
		;

		attrs.forEach( function( attr ){
			var error = me.refs[attr].getValidationErrors();
			if( error )
			errors = errors.concat( error );
		});

		return errors;
	}

	getFieldOrder() {
		var me = this,
		settingsOrder = this.props.settings.order,
		orderType = typeof settingsOrder,
		fields = this.props.settings.fields || {},
		group
		;

		if( !settingsOrder || (orderType != 'function' && settingsOrder.constructor !== Array) )
		return Object.keys( this.props.value );

		var value = assign( {}, this.props.value ),
		order = []
		;

		if( orderType == 'function' )
		return settingsOrder( value );

		// Add fields in the array
		if( settingsOrder.constructor === Array ){
			settingsOrder.forEach( function( field ){

				// An array, handle group
				if( field.constructor == Array ){
					group = [];
					field.forEach( function( groupField ){
						if( me.addFieldToOrder( groupField, value, fields ) ){
							group.push( groupField );

							// Delete them from current values
							delete value[ groupField ];
						}
					});
					if( group.length )
					order.push( group );
				}
				else if( me.addFieldToOrder( field, value, fields ) ){
					order.push( field );

					// Delete them from current values
					delete value[ field ];
				}
			});
		}

		// Add the keys left in the value
		for( var key in value ){
			if( order.indexOf( key ) == -1 )
			order.push( key );
		}

		return order;
	}

	/**
	* Checks when a field that appears in the sort settings needs to be added to
	* the fieldOrder array
	*
	* @param {String} field The field name
	*/
	addFieldToOrder( field, value, fields ) {
		return typeof value[ field ] != 'undefined' || fields[ field ] && fields[ field ].type == 'react';
	}

	getHiddenFields() {
		var hidden = this.props.settings.hiddenFields,
		fields = {}
		;
		if( !hidden )
		return fields;

		hidden.forEach( function( f ){
			fields[ f ] = 1;
		});

		return fields;
	}

	render() {
		var me = this,
			settings = this.props.settings,
			className = this.state.editing || settings.header === false ? 'open jsonObject jsonCompound' : 'jsonObject jsonCompound',
			openHash = '',
			definitions = this.state.fields,
			attrs = [],
			value = assign({}, this.props.value ),
			fixedFields = this.getFixedFields(),
			hidden = this.getHiddenFields(),
			groupCount = 0,
			definition
		;

		this.getFieldOrder().forEach( function( field ){
			// If the field is an array handle grouping
			if( field.constructor === Array ) {
				attrs.push( me.renderGroup( field, fixedFields, ++groupCount ) );
			}
			else if( !hidden[ field ] ) {
				attrs.push( me.renderField( field, fixedFields ) );
			}
		});

		var openHashChildren = [ attrs ];
		if( settings.adder !== false ){
			openHashChildren.push( this.renderAdder() );
		}

		openHash = React.DOM.div({ key: 'o', className: 'jsonChildren'}, openHashChildren);
		return React.DOM.span({className: className}, [
			this.renderHeader(),
			openHash
		]);
	}
};

export default ObjectField;
