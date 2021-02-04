import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Content, Text, View, Button, Body, Left, Right, Card, CardItem, Icon, Spinner, Toast } from 'native-base';
import { Platform, ActivityIndicator, StatusBar } from 'react-native';

export default class LoadStatus extends React.PureComponent {
	render() {
		const styles = {
			spinner: {
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				justifyContent: 'center',
				zIndex: 99999,
				backgroundColor: 'rgba(52, 52, 52, 0.8)',
			},
		}
		var showSpinner = this.props.showSpinner !== undefined ? this.props.showSpinner : true;
		var spinnerDebug = this.props.spinnerDebug !== undefined ? this.props.spinnerDebug : false;
		var spinnerStyle = this.props.spinnerStyle !== undefined ? this.props.spinnerStyle : null;
		var spinnerColorIos = this.props.spinnerColorIos !== undefined ? this.props.spinnerColorIos : '#8CC63F';
		var spinnerColorAndroid = this.props.spinnerColorAndroid !== undefined ? this.props.spinnerColorAndroid : '#8CC63F';
		var spinnerColor = this.props.spinnerColor !== undefined ? this.props.spinnerColor : (
			Platform.OS === 'ios' ? spinnerColorIos : spinnerColorAndroid
		);
		var errorStyle = this.props.errorStyle !== undefined ? this.props.errorStyle : 'none';
		var showToast = this.props.showToast !== undefined ? this.props.showToast : false;
		var content = this.props.children ? this.props.children : (this.props.content !== undefined ? this.props.content : null);

		var spinner = <View style={styles.spinner} pointerEvents={'none'} >
			<Spinner color={spinnerColor} size={'large'} />
		</View>

		//  <View style={spinnerStyle}><Spinner color={spinnerColor} /></View>;

		if (spinnerDebug) content = spinner;

		if (this.props.loadStatus) {

			if (this.props.loadStatus.isRunning() && showSpinner) {
				content = spinner;
			} else if (this.props.loadStatus.hasError()) {
				var errorMsg = this.getMessage(this.props.loadStatus.getError());

				switch (errorStyle) {
					case 'card':
						content =
							<Card style={{ marginTop: 10, marginRight: 10, marginBottom: 5, marginLeft: 10 }}>
								<CardItem style={{ backgroundColor: 'red' }}>
									<Icon name="alert" style={{ color: '#dd0000', marginRight: 10 }} />
									<Text style={{ color: '#dd0000', fontWeight: 'bold', textAlign: 'center' }}>{errorMsg}</Text>
								</CardItem>
							</Card>;
						break;
					case 'text':
						content = <Text style={{ color: '#dd0000', fontWeight: 'bold', textAlign: 'center' }}>{errorMsg}</Text>;
						break;
					case 'icon':
						content = <Icon active name="alert" style={{ color: '#dd0000' }} />;
						break;
				}

				if (showToast) {
					setTimeout(() => Toast.show({
						text: errorMsg,
						type: 'danger',
						position: 'bottom',
						buttonText: 'OK',
						duration: 3000
					}), 500);
				}
			}
		}

		return content;
	}

	getMessage(error) {
		var errorMsg = typeof error == 'string' ? error : error.message;
		errorMsg = errorMsg === undefined ? 'Load status error Error' : errorMsg;

		return errorMsg;
	}
}
