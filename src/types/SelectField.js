import React, { Component } from 'react';
/**
 * Component for editing a boolean.
 * @param  {string} value The value of the boolean.
 */
class SelectType extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			defaultValue: '',
			value: props.value,
		}
	}

	renderOptions(){
		var opts = this.props.settings.options,
		options = []
		;

		if( !opts || !opts.length )
		return options;

		opts.forEach( function( opt ){
			var data = opt;
			if( typeof opt != 'object' )
			data = { value: opt, label: opt };

			options.push(
				React.DOM.option({value: data.value, key: data.value}, data.label)
			);
		});

		return options;
	}

	updateValue( e ){
		this.props.onUpdated( e.target.value );
	}

	componentWillReceiveProps( nextProps ){
		if( this.props.value != nextProps.value )
		this.setState( { value: nextProps.value } );
	}

	render(){
		var className = 'jsonSelect';

		return React.DOM.select({
			className: className,
			id: this.props.id,
			value: this.props.value,
			onChange: this.updateValue
		}, this.renderOptions() );
	}
};

module.exports = SelectType;
