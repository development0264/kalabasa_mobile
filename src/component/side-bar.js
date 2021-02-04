import React, { Component } from 'react';
import { Container, Icon, List, ListItem, Body, Text, Item } from 'native-base';
import { Platform, View, StyleSheet, Image, ImageStyle, TouchableOpacity, AsyncStorage, StatusBar, Dimensions, PermissionsAndroid } from 'react-native';
import { navigation, auth } from '../redux/services';
import { version as app_version } from './../../package.json';
import Flag from 'react-native-flags';
import RNImagePicker from 'react-native-image-picker';
import Config from 'react-native-config';

export default class SideBar extends Component {
	constructor(props) {
		super(props);
		//var cover = this.props.login && this.props.login.login_details && this.props.login.login_details != null && this.props.login.login_details.hasValue() ? this.props.login.login_details.getValue() : null;
		this.state = {
			issearch: true,
			uri: null,//cover ? Config.PROFILE_IMAGE_BASE_URL + cover.cover : null,
			cover: null,
			saveImage: false,
			grouponcart: []
		};

		this.getgroupon();
		var isLoggedIn = this.props.login && this.props.login.login_details && this.props.login.login_details != null ? this.props.login.login_details.hasValue() : false;
		if (isLoggedIn) {
			this.props.accountGet();
			this.props.unreadNotification();
		}
	}

	componentDidMount = async () => {
		await this.getgroupon();
		this.reRenderSomething = this.props.navigation.addListener('didFocus', async () => {
			var isLoggedIn = this.props.login && this.props.login.login_details && this.props.login.login_details != null ? this.props.login.login_details.hasValue() : false;
			if (isLoggedIn) {
				await this.props.accountGet();
				await this.props.unreadNotification();
			}
		});
	}

	getElements() {
		return [
			{
				id: 1,
				title: 'History',
				navigate: 'History',
				icon: 'history',
			}, {
				id: 2,
				title: 'Address',
				navigate: 'Address',
				icon: 'share-alt',
				Page: 'Menu'
				//enabled: !!member && hasTeams
			},
			{
				id: 3,
				title: 'Notification',
				navigate: 'Notification',
				icon: 'bell-o',
				//enabled: !!member && hasTeams
			}
			,
			{
				id: 4,
				title: 'Favourite',
				navigate: 'Favourite',
				icon: 'heart-o',
				//enabled: !!member && hasTeams
			}
			,
			{
				id: 5,
				title: 'Groupon',
				navigate: 'Groupon',
				icon: 'star-o',
				//enabled: !!member && hasTeams
			}
		];
	}

	close() {
		this.props.navigation.closeDrawer();
	}

	gotoaccount = async () => {
		await this.props.accountGet()
		await this.props.navigation.navigate('Account')
	}

	getflag(countryid) {
		var country = this.props.home.country;
		var country = country ? country.hasValue() ? country.getValue() : [] : [];
		if (country != undefined && country.length > 0) {
			var obj = country.filter(i => i.id == countryid);

			var list = []
			if (obj.length > 0) {
				list.push(<Flag
					code={obj[0].iso}
					size={32}
				//style={{ backgroundColor: 'red', zIndex: 10, left: 60, justifyContent: 'center', alignItems: 'center', height: 50, width: 50, borderRadius: 100, position: 'absolute' }}
				/>)
			}
		}
		return list;
	}


	renderMenuItems() {
		//alert(JSON.stringify(this.props.cart.total_products))
		var unreadcount = this.props.account.unreadcount;
		var notifictioncount = unreadcount ? unreadcount.hasValue() ? unreadcount.getValue() : 0 : 0;
		var { height, width } = Dimensions.get('window');

		var menuItems = this.getElements();
		let items = [];
		menuItems.map((item, i) => {
			items.push(
				<ListItem
					//last={menuItems.length === i + 1}
					noBorder
					key={item.id}
					button={true}
					//onPress={NavigationActions[item.navigate]}
					style={{ width: '95%', flexDirection: 'row' }}
				>
					<View style={{ backgroundColor: '#ff9500', borderRadius: 100, padding: 6 }}>
						<Icon type="FontAwesome" name={item.icon} style={{ color: 'black', fontWeight: '100' }} />
					</View>
					<View style={{ alignSelf: 'center', marginLeft: 20, }}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate(item.navigate, { Page: item.Page })}>
							<Text style={{ color: 'white', textAlign: 'left' }} >{item.title}</Text>
							{notifictioncount > 0 && item.title == "Notification" ?
								<View style={{ left: width * 0.35, bottom: -2, justifyContent: 'center', alignItems: 'flex-end', height: 35, width: 35, backgroundColor: '#ff9500', borderRadius: 200 / 2, position: 'absolute' }}>
									<Text style={{ color: 'white' }}>{notifictioncount}</Text>
								</View>
								: null}
						</TouchableOpacity>
					</View>
				</ListItem>
			);
		});
		return items;
	}

	opencamera = async () => {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
				{
					title: 'We need your permission'
				},
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				const options = {
					noData: true,
					storageOptions: {
						skipBackup: true,
						path: 'images',
						cameraRoll: true,
						waitUntilSaved: true,
					},
				}
				RNImagePicker.showImagePicker(options, (response) => {
					if (response.didCancel) {
						alert('User cancelled image picker');
					} else if (response.error) {
						alert('ImagePicker Error: ' + response.error);
					} else if (response.customButton) {
						console.log('User tapped custom button: ', response.customButton);
						alert(response.customButton);
					} else {
						this.setState({
							uri: (Platform.OS === 'android') ? response.uri : response.uri.replace('file://', ''),
							cover: response,
							saveImage: true
						});
					}
				});
			}
		}
		catch (ex) {
			alert(JSON.stringify(ex))
		}
	}

	saveImage = async () => {
		await this.props.SaveImage(this.state.cover)
		this.setState({
			uri: null,
			cover: null,
			saveImage: false
		});
	}

	getgroupon = async () => {
		await AsyncStorage.getItem("groupon_cart", (err, res) => {
			// console.log(res)
			if (!res) {
				this.setState({ grouponcart: [] });
			} else {
				this.setState({ grouponcart: JSON.parse(res) });
			}
		})
	}

	render() {
		var cart = this.props.cart.cart
		var total_products = cart != undefined ? (cart.hasValue() ? cart.getValue().length : 0) : 0;
		total_products = total_products + this.state.grouponcart.length

		var Name = this.props.login && this.props.login.login_details != null && this.props.login.login_details.hasValue() ? this.props.login.login_details.getValue().name : "";

		var accountLoading = this.props.account.account;
		var account = accountLoading ? accountLoading.hasValue() ? accountLoading.getValue() : {} : {};

		var cover = this.props.login && this.props.login.login_details && this.props.login.login_details != null && this.props.login.login_details.hasValue() ? this.props.login.login_details.getValue() : null;
		var coverimage = this.state.uri == null ? (cover ? Config.PROFILE_IMAGE_BASE_URL + cover.cover : null) : this.state.uri;

		var { height, width } = Dimensions.get('window');

		var unreadcount = this.props.account.unreadcount;
		var notifictioncount = unreadcount ? unreadcount.hasValue() ? unreadcount.getValue() : 0 : 0;

		return (
			<View style={{ backgroundColor: '#2f2d2d', opacity: 0.9, height: '100%', offset: 0.4 }}>
				<View style={{ flex: 0.3, top: width * 0.1, alignSelf: 'center', width: '85%' }} >
					<View style={{ flex: 1, zIndex: 10, left: 60, justifyContent: 'center', alignItems: 'center', height: 30, width: 30, borderRadius: 200 / 2, position: 'absolute' }}>
						{/* <Text style={{ color: 'white' }}>{total_products}</Text> */}
						{this.getflag(account.country_id)}
					</View>
					{this.state.saveImage == false ?
						<TouchableOpacity onPress={() => this.opencamera()} style={{ left: 0, top: 50, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', position: 'absolute' }}>
							<Icon type="FontAwesome" name="pencil-square-o" style={{ fontSize: 35, color: '#d3d2d2' }} />
						</TouchableOpacity>
						: <TouchableOpacity onPress={() => this.saveImage()} style={{ left: 0, top: 50, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', position: 'absolute' }}>
							<Icon type="FontAwesome" name="floppy-o" style={{ fontSize: 35, color: '#d3d2d2' }} />
						</TouchableOpacity>}
					{total_products > 0 ?
						<View style={{ zIndex: 10, right: 60, justifyContent: 'center', alignItems: 'center', height: 35, width: 35, backgroundColor: '#ff9500', borderRadius: 200 / 2, position: 'absolute' }}>
							<Text style={{ color: 'white' }}>{total_products}</Text>
						</View>
						: null}
					<TouchableOpacity onPress={() => this.gotoaccount()} style={{ width: 110, height: 110, borderWidth: 0.5, borderColor: 'white', alignSelf: 'center', borderRadius: 100, }}>
						{coverimage == "" || coverimage == null
							? <Image onPress={() => this.gotoaccount()} style={{ width: 110, height: 110, borderWidth: 0.5, borderColor: 'white', alignSelf: 'center', borderRadius: 100 }} source={require("../images/kalabasa_logo.png")}  >
							</Image>
							:
							<Image onPress={() => this.gotoaccount()} style={{ width: 110, height: 110, borderWidth: 0.5, borderColor: 'white', alignSelf: 'center', borderRadius: 100 }} source={{ uri: coverimage }}  >
							</Image>
						}
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.props.navigation.closeDrawer()} style={{ right: 0, top: 0, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', position: 'absolute' }}>
						<Icon type="AntDesign" name="bars" style={{ fontSize: 35, color: '#d3d2d2' }} />
					</TouchableOpacity>
					<View style={{ width: '100%', borderBottomWidth: 0.5, borderBottomColor: 'white', marginTop: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }}>
						<Text style={{ textAlign: 'center', bottom: 5, color: '#FFFFFF' }}>{Name}</Text>
					</View>
				</View>
				<View style={{ flex: 0.7, top: 0 }}>
					<List>
						{this.renderMenuItems()}
					</List>
				</View>
				<List>
					<ListItem
						noBorder
						button={true}
						style={{ width: '95%', flexDirection: 'row' }}
					>
						<View style={{ backgroundColor: '#ff9500', borderRadius: 100, padding: 6 }}>
							<Icon type="FontAwesome" name={'sign-out'} style={{ color: 'black', fontWeight: '100' }} />
						</View>
						<View style={{ alignSelf: 'center', marginLeft: 20, }}>
							<TouchableOpacity onPress={() => this.props.Logout()}>
								<Text style={{ color: 'white', textAlign: 'left' }} >Logout</Text>
							</TouchableOpacity>
						</View>
					</ListItem>
				</List>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	MainContainer: {
		flex: 0.27,

	},
	safeArea: {
		flex: 1,
	},
	header: {
		height: 128,
		paddingHorizontal: 16,
		justifyContent: 'center',
	},
	profileContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	profileName: {
		marginHorizontal: 16,
	},
	cover: {
		alignSelf: 'stretch',
		height: 200,
		width: null,
		position: 'relative',
		marginBottom: 10,
	},
	icon: {
		backgroundColor: 'transparent',
		color: '#8F9BB3',
		width: 20,
		height: 22,
		marginHorizontal: 8,
		flex: 0,
		opacity: 1

	},
	text: {
		color: '#222845',
		fontSize: 13,
		marginHorizontal: 8,
		fontWeight: '400',
		fontFamily: 'inherit',


	},
	headerText: {
		color: 'black',
		fontSize: 20
	},
	itemText: {
		color: '#898d9b',
		fontSize: 20,
		fontWeight: '800'
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});
