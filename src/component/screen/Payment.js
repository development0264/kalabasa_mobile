
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList, KeyboardAvoidingView, AsyncStorage, Alert } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Footer, Content, Col, CheckBox } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faCreditCard } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';

import { Form, Field } from 'react-native-validate-form';

import InputField from '../InputField';

import { ScrollView } from 'react-native-gesture-handler';

import Navbar from '../Navbar';
import RadioGroup from 'react-native-radio-button-group';

const required = value => (value ? undefined : 'This is a required field.');

export default class Payment extends Component {

    constructor(props) {
        super(props);
        var cart = this.props.cart.cart;
        var cartdetails = cart.hasValue() ? cart.getValue() : [];

        var couriers = this.props.cart.couriers;
        var couriersdetails = couriers.hasValue() ? couriers.getValue() : [];
        this.state = {
            total: 0,
            cartdetails: cartdetails,
            couriersdetails: couriersdetails,
            viewaddress: this.props.address.viewaddress != null ? this.props.address.viewaddress : {},
            cardNumber: '',
            cardholder: "",
            expireYear: "",
            expireMonth: "",
            cvv: "",
            errors: [],
            description: couriersdetails.length > 0 ? couriersdetails[0].description : null,
            extracharge: couriersdetails.length > 0 ? couriersdetails[0].cost : 0,
            activeButtonId: couriersdetails.length > 0 ? 0 : null,
            activePaymentId: 0,
            isSelected: false,
            grouponcart: [],
            isPayDisable: false
        };
        //alert(JSON.stringify(this.state.viewaddress.id))
        // this.select = this.select.bind(this)

        //console.log(this.convertdatetime())
    }
    componentWillReceiveProps() {
        this.grouponcart();
        this.reRenderSomething = this.props.navigation.addListener('willfocus', () => {
            this.props.cartGetList()
        });
    }

    componentDidMount() {
        this.reRenderSomething = this.props.navigation.addListener('didFocus', () => {
            this.props.cartGetList()
            this.grouponcart();
        });
    }

    grouponcart = async () => {
        var groupon_cart = await AsyncStorage.getItem("groupon_cart")
        if (groupon_cart) {
            this.setState({ grouponcart: JSON.parse(groupon_cart) })
        } else {
            this.setState({ grouponcart: [] })
        }
    }

    convertdatetime() {
        var date = new Date();
        var firstdayDay = date.getDate();
        var firstdayMonth = date.getMonth() + 1;
        var firstdayYear = date.getFullYear();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var sec = date.getSeconds();
        return ("0000" + firstdayYear.toString()).slice(-4) + "-" + ("00" + firstdayMonth.toString()).slice(-2) + "-" + ("00" + firstdayDay.toString()).slice(-2) + " " + ("00" + hour.toString()).slice(-2) + ":" + ("00" + minute.toString()).slice(-2) + ":" + ("00" + sec.toString()).slice(-2);
    }

    componentWillReceiveProps(nextProps) {
        var cart = this.props.cart.cart;
        var cartdetails = cart.hasValue() ? cart.getValue() : [];
        if (cartdetails.length > 0) {
            this.setState({ cartdetails: cartdetails, viewaddress: nextProps.address.viewaddress != null ? nextProps.address.viewaddress : {} })
        }
        var couriers = this.props.cart.couriers;
        var couriersdetails = couriers.hasValue() ? couriers.getValue() : [];
        if (couriersdetails.length > 0) {
            this.setState({ activeButtonId: couriersdetails.length > 0 ? 0 : null, couriersdetails: couriersdetails, description: couriersdetails.length > 0 ? couriersdetails[0].description : null })
        }

    }
    gettotalamount() {
        let total = 0;
        this.state.cartdetails.map((item, i) => {
            total = total + (item.qty * item.price)
        })
        if (!this.state.isSelected && this.state.grouponcart.length > 0) {
            this.state.grouponcart.map((item, i) => {
                total = total + (item.qty * item.price)
            })
        }
        total = parseFloat(total) + parseFloat(this.state.extracharge)
        //console.log("total", total)
        return parseFloat(total).toFixed(2)
    }

    grouponcartamount() {
        let total = 0;
        if (this.state.grouponcart.length > 0) {
            this.state.grouponcart.map((item, i) => {
                total = total + (item.qty * item.price)
            })
        }
        return parseFloat(total).toFixed(2)
    }
    render() {
        var { height, width } = Dimensions.get('window');
        var left = (
            <Left style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('CartDetails')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: width * 0.095, color: 'white' }} />
                </Button>
            </Left>
        );


        return (
            <Container style={{ backgroundColor: '#ebeff0', position: 'relative' }}>

                <Navbar left={left} title="Payment" fontSize={30} marginLeft={28} />
                <Content style={{ backgroundColor: '#ebeff0' }}>
                    {this.renderDesign()}
                </Content>
                <Footer style={{ backgroundColor: '#8CC63F', height: 70 }} backgroundColor={'#8CC63F'} >
                    <View style={styles.body}>
                        <Text style={{ color: 'white', textAlign: 'center', width: '50%', fontSize: 25 }}>Total:{' '}
                            <Text>€ {this.gettotalamount()}</Text>
                        </Text>

                        {(this.state.cartdetails.length > 0 && this.state.isPayDisable == false) || (this.state.grouponcart.length > 0 && this.state.isSelected == false) ?
                            <TouchableOpacity
                                onPress={() => this.submitForm()}
                                style={{ backgroundColor: '#F4B83A', borderRadius: 30, marginTop: 0 }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: width * 0.06,
                                        textAlign: 'center',
                                        padding: 3,
                                        paddingRight: 20,
                                        paddingLeft: 20,
                                    }}>
                                    PAY
            </Text>
                            </TouchableOpacity>
                            : null}
                    </View>
                </Footer>
            </Container>

            // </SideMenuDrawer>
        )
    }
    gotocart(grouponproduct) {
        Alert.alert(
            'Product is out dated',
            'Your Group on product ' + grouponproduct.name + ' is not available now!<br>' +
            'Dou you want to remove it?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Ok',
                    onPress: async () => {
                        await this.props.navigation.navigate('CartDetails')
                    },
                },
            ],
            { cancelable: false },
        )
    }


    grouponquantity(grouponproduct, min_qty) {
        Alert.alert(
            'Quantity is out of stock',
            'Your Group on product ' + grouponproduct.name + ' is out of stock or Order less than ' + min_qty + ' quantity!',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Ok',
                    onPress: async () => {
                        await this.props.navigation.navigate('CartDetails')
                    },
                },
            ],
            { cancelable: false },
        )
    }
    submitSuccess = async () => {
        this.setState({ isPayDisable: true })
        var cart = this.props.cart.cart;
        var cartdetails = cart != undefined ? cart.hasValue() ? cart.getValue() : [] : [];

        var data = {
            date: this.currentdate(),
        }
        await this.props.grouponGetList(data)

        var grouponproduct = this.props.product.grouponproduct;
        var groupproduct = grouponproduct ? grouponproduct.hasValue() ? grouponproduct.getValue() : [] : [];

        // console.log("groupproduct", groupproduct)
        // console.log("state.groupproduct", this.state.grouponcart)
        var grouponcart = []
        if (this.state.grouponcart.length > 0) {
            for (var i = 0; i < this.state.grouponcart.length; i++) {
                var checkgroupon = groupproduct.filter(j => j.id == this.state.grouponcart[i].id)
                //console.log("checkgroupon", checkgroupon[0])
                if (checkgroupon.length > 0) {
                    if (this.state.grouponcart[i].qty <= checkgroupon[0].remaining_quantity) {
                        var obj = {
                            quantity: this.state.grouponcart[i].qty,
                            product_name: this.state.grouponcart[i].name,
                            product_sku: this.state.grouponcart[i].sku,
                            product_description: this.state.grouponcart[i].description,
                            product_price: this.state.grouponcart[i].price,
                            group_id: this.state.grouponcart[i].id
                        }
                        grouponcart.push(obj)
                    } else {
                        this.grouponquantity(checkgroupon[0], checkgroupon[0].remaining_quantity)
                        return;
                    }
                } else {
                    this.gotocart(this.state.grouponcart[i])
                    return;
                }
            }
        }


        var data = {
            "reference": "",
            "courier_id": this.state.couriersdetails[this.state.activeButtonId].id,
            "courier": null,
            "customer_id": this.props.login.login_details != null && this.props.login.login_details.hasValue() ? this.props.login.login_details.getValue().id : null,
            "address_id": this.state.viewaddress.id,
            "order_status_id": 2,
            "payment_method": this.state.activePaymentId == 0 ? "card payment" : "cash on delivery",
            "discounts": "0.00",
            "total_products": parseInt(cartdetails.length + grouponcart.length),
            "total_shipping": "0.00",
            "tax": "0.00",
            "total": this.gettotalamount(),
            "total_paid": "0.00",
            "invoice": null,
            "label_url": null,
            "tracking_number": null,
            "created_at": this.convertdatetime(),
            "updated_at": this.convertdatetime(),
            "groups": grouponcart
        }

        //console.log(JSON.stringify(data))

        //return
        if (this.state.activePaymentId == 0) {
            var payment = {
                "card_number": this.state.cardNumber,
                "expiry_month": this.state.expireMonth,
                "expiry_year": this.state.expireYear,
                "cvn": this.state.cvv,
                "card_holder_name": this.state.cardholder,
                "amount": this.gettotalamount(),
                "order_reference": null,
                "order_id": null
            }

            await this.props.saveorders(data, payment);
            this.setState({ isPayDisable: false })
            await this.props.navigation.navigate('OrderSuccess');
        }
        else {
            await this.props.saveorders(data, null);
            this.setState({ isPayDisable: false })
            await this.props.navigation.navigate('OrderSuccess');
        }

    }

    currentdate() {
        var date = new Date();
        var firstdayDay = date.getDate();
        var firstdayMonth = date.getMonth() + 1;
        var firstdayYear = date.getFullYear();
        return ("0000" + firstdayYear.toString()).slice(-4) + "-" + ("00" + firstdayMonth.toString()).slice(-2) + "-" + ("00" + firstdayDay.toString()).slice(-2);
    }

    submitForm() {
        if (this.state.activePaymentId == 0) {
            let submitResults = this.myForm.validate();

            let errors = [];

            submitResults.forEach(item => {
                errors.push({ field: item.fieldName, error: item.error });
            });
            this.setState({ errors: errors });
        }
        else {
            this.submitSuccess()
        }
    }


    submitFailed() {
        //console.log("Submit Faield!");
    }

    checkvalue(obj) {
        var item = this.state.couriersdetails[obj.id]
        this.setState({ extracharge: item.cost, description: item.description, activeButtonId: item.id })
    }

    checkvaluepayment(obj) {
        if (obj.id == 1) {
            this.setState({ activePaymentId: obj.id })
            return
        }
        this.setState({ activePaymentId: obj.id })
    }

    radiooptions() {
        var { height, width } = Dimensions.get('window');
        let radio = []
        this.state.couriersdetails.map((item, i) => {
            radio.push({
                id: i,
                labelView: (
                    <Text style={{ fontSize: width * 0.05, marginTop: -20 }}>
                        € {item.cost} {item.name}
                    </Text>
                ),
            })
        })
        //this.setState({ description: this.state.couriersdetails[0].description })
        return radio
    }

    optionspayment() {
        var { height, width } = Dimensions.get('window');
        let radio = []
        radio.push({
            id: 0,
            labelView: (
                <Text style={{ fontSize: width * 0.05, marginTop: -20 }}>
                    Credit/Debit Card
                </Text>
            ),
        }, {
            id: 1,
            labelView: (
                <Text style={{ fontSize: width * 0.05, marginTop: -20 }}>
                    Cash On Delivery
                </Text>
            ),
        })
        //this.setState({ description: this.state.couriersdetails[0].description })
        return radio
    }

    // setSelection(isSelected) {
    //     alert(isSelected)
    //     this.setState({ isSelected: !isSelected })
    // }

    renderDesign() {
        var { height, width } = Dimensions.get('window');
        return (
            <KeyboardAvoidingView >
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 50, }}>
                    <View style={{ flex: 1, backgroundColor: '#efeff4' }}>
                        <View style={{ height: '16%', width: '100%', marginBottom: width * 0.0, marginTop: width * 0.0, borderBottomWidth: 1, borderColor: '#ccccde', backgroundColor: '#efeff4', alignItems: 'center', justifyContent: 'center' }}>
                            <Row>
                                <Col style={{ width: '40%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={{ right: 0 }} // must be passed from the parent, the number may vary depending upon your screen size
                                        source={require('../../images/card.png')}
                                    >
                                    </Image>
                                </Col>
                                <Col style={{ justifyContent: 'center', alignItems: 'center', left: -40 }}>
                                    <Text style={{ color: 'black', textAlign: 'center', width: '100%', fontSize: 55 }} >€ <Text style={{ color: 'black', textAlign: 'center', width: '100%', fontSize: 40, justifyContent: 'center', alignItems: 'center', }}>{this.gettotalamount()}</Text></Text>
                                </Col>
                            </Row>
                        </View>

                        <View style={{ height: width * 0.4, width: width * 0.9999, marginTop: 10, borderBottomWidth: 1, borderColor: '#ccccde', backgroundColor: '#efeff4', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: width * 0.050, marginTop: width * 0.01, marginLeft: width * 0.05 }}>Delivery Address:</Text>
                            <Text style={{ fontSize: width * 0.045, marginTop: width * 0.02, marginLeft: width * 0.05 }}>{this.state.viewaddress.alias}</Text>
                            <Text style={{ fontSize: width * 0.045, marginTop: width * 0.02, marginLeft: width * 0.05 }}>{this.state.viewaddress.address_1},{this.state.viewaddress.address_2}, {this.state.viewaddress.zip}</Text>
                            <Text style={{ fontSize: width * 0.045, marginTop: width * 0.02, marginLeft: width * 0.05 }}>Phone : {this.state.viewaddress.phone != null ? this.state.viewaddress.phone : 'N/A'}</Text>
                        </View>

                        <View style={{ width: width * 0.9999, marginTop: width * 0.05, borderBottomWidth: 1, borderColor: '#ccccde', backgroundColor: '#efeff4', alignItems: 'flex-start' }}>
                            <RadioGroup
                                circleStyle={{ fillColor: 'orange', borderColor: 'black', marginLeft: width * 0.05, marginBottom: 18 }}
                                options={this.radiooptions()}
                                activeButtonId={this.state.activeButtonId}
                                onChange={item => this.checkvalue(item)}
                            />
                        </View>

                        <View style={{ height: width * 0.3, width: width * 0.9999, marginTop: width * 0.0, borderBottomWidth: 1, borderColor: '#ccccde', backgroundColor: '#efeff4', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: width * 0.055, marginTop: width * 0.01, marginLeft: width * 0.05 }}>Note:</Text>
                            <Text style={{ fontSize: width * 0.045, marginTop: width * 0.04, marginLeft: width * 0.05 }}>{this.state.description}</Text>
                        </View>

                        {this.state.grouponcart.length > 0 ?
                            <View style={{ height: width * 0.1, width: width * 0.9999, marginTop: width * 0.0, borderBottomWidth: 1, borderColor: '#ccccde', backgroundColor: '#efeff4', alignItems: 'flex-start' }}>
                                <View style={styles.checkboxContainer}>
                                    <CheckBox
                                        checked={this.state.isSelected}
                                        onPress={() => this.setState({
                                            isSelected: !this.state.isSelected
                                        })}
                                        color="#8CC63F"
                                        style={styles.checkbox}
                                    />
                                    <Text style={{ textAlign: 'center', fontSize: width * 0.045, marginTop: width * 0.02, marginLeft: width * 0.05 }}>Do you want remove groupon? (€ {this.grouponcartamount()})</Text>
                                </View>
                            </View>
                            : null}
                        <View style={{ width: width * 0.9999, marginTop: width * 0.05, borderBottomWidth: 1, borderColor: '#ccccde', backgroundColor: '#efeff4', alignItems: 'flex-start' }}>
                            <RadioGroup
                                circleStyle={{ fillColor: 'orange', borderColor: 'black', marginLeft: width * 0.05, marginBottom: 18 }}
                                options={this.optionspayment()}
                                activeButtonId={this.state.activePaymentId}
                                onChange={item => this.checkvaluepayment(item)}
                            />
                        </View>

                        {this.state.activePaymentId == 0 ?
                            <Form ref={(ref) => this.myForm = ref}
                                validate={true}
                                style={{ backgroundColor: 'white' }}
                                submit={this.submitSuccess.bind(this)}
                                failed={this.submitFailed.bind(this)}
                                errors={this.state.errors}>
                                <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>

                                    <Item style={{ top: 20, width: '90%', justifyContent: 'space-between' }}>
                                        <Field
                                            required
                                            validations={[required]}
                                            component={InputField}
                                            name="CardNumber"
                                            value={this.state.cardNumber}
                                            onChangeText={(text) => this.setState({ cardNumber: text })}
                                            placeholderTextColor="black"
                                            placeholder="Card Number"
                                            customStyle={{ width: 300 }}
                                            keyboardType={'numeric'}
                                        />

                                        <FontAwesomeIcon icon={faCreditCard} size={35} style={{ color: 'black', alignContent: 'center' }} />
                                    </Item>

                                    {this.state.errors && this.state.errors.length > 0 && this.state.errors.map((item, index) =>
                                        item.field === "CardNumber" && item.error ?
                                            <Text key={`${index}`} style={{ color: 'red', marginLeft: 25, }}>
                                                {item.error}
                                            </Text>
                                            : null
                                    )
                                    }

                                    <Item style={{ width: '90%', top: 20, justifyContent: 'space-between' }}>
                                        <Field
                                            required
                                            validations={[required]}
                                            component={InputField}
                                            name="CardHolder"
                                            value={this.state.cardholder}
                                            onChangeText={(text) => this.setState({ cardholder: text })}
                                            placeholderTextColor="black"
                                            placeholder="Card Holder"
                                            customStyle={{ width: 300 }}
                                        />
                                    </Item>

                                    {this.state.errors && this.state.errors.length > 0 && this.state.errors.map((item, index) =>
                                        item.field === "CardHolder" && item.error ?
                                            <Text key={`${index}`} style={{ color: 'red', marginLeft: 25, }}>
                                                {item.error}
                                            </Text>
                                            : null
                                    )
                                    }


                                    {/* <View style={{ width: '90%', height: 100 }}> */}
                                    {/*  <Col style={{ justifyContent: 'center', width: '33.33%', }}> */}

                                    <View style={{ flexDirection: 'row', height: 100, width: '90%' }}>
                                        <Item style={{ width: '33.33%', height: 50, top: 20, justifyContent: 'space-between', }}>
                                            <Field
                                                required
                                                name="ExpireMonth"
                                                validations={[required]}
                                                component={InputField}
                                                value={this.state.expireMonth}
                                                onChangeText={(text) => this.setState({ expireMonth: text })}
                                                placeholderTextColor="black"
                                                placeholder="MM"
                                                keyboardType={'numeric'}
                                                customStyle={{ width: '100%' }}
                                            />

                                            {this.state.errors && this.state.errors.length > 0 && this.state.errors.map((item, index) =>
                                                item.field === "ExpireMonth" && item.error ?
                                                    <Text key={`${index}`} style={{ color: 'red', height: 50, fontSize: 11, top: 35 }}>
                                                        {item.error}
                                                    </Text>
                                                    : null
                                            )
                                            }

                                        </Item>


                                        {/* </Col> */}

                                        {/* <Col style={{ alignItems: 'center', justifyContent: 'center', width: '33.33%' }}> */}
                                        <Item style={{ width: '33.33%', height: 50, top: 20, justifyContent: 'space-between', }}>

                                            <Field
                                                required
                                                name="ExpireYear"
                                                validations={[required]}
                                                component={InputField}
                                                value={this.state.expireYear}
                                                onChangeText={(text) => this.setState({ expireYear: text })}
                                                placeholderTextColor="black"
                                                placeholder="YYYY"
                                                keyboardType={'numeric'}
                                                customStyle={{ width: '100%' }}
                                            />

                                            {this.state.errors && this.state.errors.length > 0 && this.state.errors.map((item, index) =>
                                                item.field === "ExpireYear" && item.error ?
                                                    <Text key={`${index}`} style={{ color: 'red', height: 50, fontSize: 11, top: 35 }}>
                                                        {item.error}
                                                    </Text>
                                                    : null
                                            )
                                            }
                                        </Item>


                                        {/* </Col> */}

                                        {/* <Col style={{ alignItems: 'flex-end', justifyContent: 'center' }}> */}
                                        <Item style={{ width: '33.33%', height: 50, top: 20, justifyContent: 'space-between', }}>

                                            <Field
                                                required
                                                name="CVV"
                                                validations={[required]}
                                                component={InputField}
                                                value={this.state.cvv}
                                                onChangeText={(text) => this.setState({ cvv: text })}
                                                placeholderTextColor="black"
                                                placeholder="CVV"
                                                customStyle={{ width: '100%' }}
                                                keyboardType={'numeric'}
                                            //errors={this.state.errors}
                                            />

                                            {this.state.errors && this.state.errors.length > 0 && this.state.errors.map((item, index) =>
                                                item.field === "CVV" && item.error ?
                                                    <Text key={`${index}`} style={{ color: 'red', height: 50, fontSize: 11, top: 35 }}>
                                                        {item.error}
                                                    </Text>
                                                    : null
                                            )
                                            }

                                        </Item>
                                    </View>
                                    {/* </Col> */}
                                </View>
                                {/* </View> */}
                            </Form>
                            : null}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>



        )
    }


}




var { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    body: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: width * 0.01,
        height: '100%'
    },
    checkboxContainer: {
        flexDirection: "row",
        alignSelf: "flex-start",
    },
    checkbox: {
        alignSelf: "center",
        alignItems: 'center',
        top: 5,
        left: 15
    },
})