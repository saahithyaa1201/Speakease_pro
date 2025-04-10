import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Link, usePathname } from 'expo-router';

// Content items for the home screen
const contentItems = [
	{
		id: '1',
		title: 'Lesson Topics',
		image: require('../../../../assets/images/lesson-topics.png')
	},
	{
		id: '2',
		title: 'Weekly Goals',
		image: require('../../../../assets/images/weekly-goals.png')
	},
	{
		id: '3',
		title: 'Reminder',
		image: require('../../../../assets/images/reminder.png')
	},
	{
		id: '4',
		title: 'Progress tracking',
		image: require('../../../../assets/images/progress-tracking.png')
	},
	{
		id: '5',
		title: 'Feedback',
		image: require('../../../../assets/images/feedback.png')
	},
	{
		id: '6',
		title: 'Premium Subscription',
		image: require('../../../../assets/images/premium.png')
	}
];

function ExamTopics() {
	const pathname = usePathname();

	const isActive = path => pathname === path;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollContainer}>
				<View style={styles.header}>
					<Image source={require('../../../../assets/images/speakeaselogo.png')} style={styles.logo} />
					<Text style={styles.title}>SpeakEase</Text>
				</View>

				<View style={styles.content}>
					{contentItems.map(item => (
						<View key={item.id} style={styles.card}>
							<Image source={item.image} style={styles.cardImage} />
							<TouchableOpacity style={styles.button}>
								<Text style={styles.buttonText}>{item.title}</Text>
							</TouchableOpacity>
						</View>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	scrollContainer: {
		flex: 1
	},
	header: {
		padding: 16,
		backgroundColor: '#fff',
		alignItems: 'center',
		flexDirection: 'row',
		paddingTop: Platform.OS === 'android' ? 40 : 16
	},
	logo: {
		width: 40,
		height: 40,
		marginRight: 10
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold'
	},
	content: {
		padding: 16,
		paddingBottom: 80 // Extra padding for nav bar
	},
	card: {
		marginBottom: 20,
		borderRadius: 16,
		overflow: 'hidden',
		backgroundColor: '#f9f9f9',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2
	},
	cardImage: {
		width: '100%',
		height: 180,
		resizeMode: 'cover'
	},
	button: {
		backgroundColor: '#25b0bc',
		padding: 14,
		alignItems: 'center'
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16
	}
});

export default ExamTopics;
