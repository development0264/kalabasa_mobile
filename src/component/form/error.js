import React, { Component } from 'react';
import { View, Text, Icon } from 'native-base';

export default class FormControlError extends Component {
	render() {
		var error = null;
		if (this.props.children) {
			error = Array.isArray(this.props.children) ? this.props.children[0] : this.props.children;
		}

		var content = error ? (
			<View style={{ flex: 1, flexDirection: 'row' }}>
				<Icon name="alert" style={{ fontSize: 16, marginRight: 5, color: '#FFFFFF' }} />
				<Text style={{ fontSize: 14, color: '#FFFFFF', flexWrap: 'wrap' }}>{error}</Text>
			</View>
		) : null;

		var style = this.props.style ? this.props.style : {};
		return (
			<View style={{ margin: 0, padding: 5, paddingLeft: 0, minHeight: 28, ...style }}>
				{content}
			</View>
		);
	}
}
