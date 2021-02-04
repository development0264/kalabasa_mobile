import React from 'react';
import { TextInput, Text, View } from 'react-native';
// import { Input } from 'native-base';

const InputField = ({
    secureTextEntry,
    name,           // field name - required
    customStyle,
    onChangeText,   // event
    value,          // field value
    disabled,
    placeholder,
    errors,
    labelname,      // this array prop is automatically passed down to this component from <Form />
    numberOfLines,
    multiline,
    placeholderTextColor,
    keyboardType,
    maxLength
}) => {
    return (
        <View>
            {/* <Item> */}
            <TextInput
                keyboardType={keyboardType}
                label={labelname}
                secureTextEntry={secureTextEntry}
                value={value && value}
                onChangeText={onChangeText ? (val) => onChangeText(val) : null}
                placeholder={placeholder ? placeholder : ""}
                disabled={disabled}
                placeholderTextColor={placeholderTextColor ? placeholderTextColor : 'grey'}
                style={customStyle ? customStyle : {}}
                numberOfLines={numberOfLines}
                multiline={multiline}
                maxLength={maxLength}
            />
            {/* </Item> */}
            {errors && errors.length > 0 && errors.map((item, index) =>
                item.field === name && item.error ?
                    <Text key={`${index}`} style={{ color: 'red' }}>
                        {item.error}
                    </Text>
                    : null
            )
            }
        </View>

    );
}

export default InputField;