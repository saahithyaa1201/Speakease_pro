import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as Speech from 'expo-speech';

const Message = () => {
	const speak = async () => {
		const thingToSay = 'hello im expo can you speak like me?? you are a bad person but i am a good person';
		Speech.speak(thingToSay);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Hello, this is a message!</Text>
			<Button title='Press to hear some words' onPress={speak} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontSize: 18
	}
});

export default Message;
