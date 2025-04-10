import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ onPress, title, style = {}, textStyle = {} }) => {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.button, style]}>
			<Text style={[styles.text, textStyle]}>{title}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#007BFF',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center'
	},
	text: {
		color: '#FFFFFF',
		fontSize: 15,
		fontFamily: ''
	}
});

export default Button;
