import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBox = ({ text, direction }) => {
	return (
		<View style={[styles.messageBox, direction === 'left' ? styles.left : styles.right]}>
			<Text style={styles.text}>{text}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	messageBox: {
		padding: 20,
		borderRadius: 20,
		marginLeft: 20,
		marginTop: 20,
		width: '70%'
	},
	text: {
		fontSize: 16
	},
	left: {
		backgroundColor: '#e1ffc7',
		alignSelf: 'flex-start'
	},
	right: {
		backgroundColor: '#c7e1ff',
		alignSelf: 'flex-end'
	}
});

export default MessageBox;
