import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

const FutureRemainder = () => {
	//time pickeer for set reminder
	const [selectedTime, setSelectedTime] = useState(new Date());

	//handling the set reminder function
	const handleSetReminder = () => {
		Notifications.getPermissionsAsync().then(({ status }) => {
			if (status !== 'granted') {
				alert('You need to enable notifications to set reminder!');
				return;
			}
			const time = new Date(selectedTime);
			scheduleNotification(time.getHours(), time.getMinutes());
		});
	};

	const handleTimeChange = (event, time) => {
		setSelectedTime(time);
	};

	//scheduling notifications after reminder is set
	const scheduleNotification = async (hour, minute) => {
		try {
			await Notifications.scheduleNotificationAsync({
				content: { title: 'Lesson Reminder', body: `Complete your lesson!` },
				trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute, repeats: false }
			});

			alert('Reminder set successfully!');
		} catch (error) {
			console.log(error);
			alert('Failed to set reminder. Please try again.');
		}
	};

	//request notification permissions
	useEffect(() => {
		const requestNotificationPermission = async () => {
			const { status } = await Notifications.requestPermissionsAsync();
			if (status !== 'granted') {
				alert('You need to enable notifications to set reminders!');
			}
		};
		requestNotificationPermission();
	}, []);

	return (
		<View>
			{/*set reminder buttons*/}
			<TouchableOpacity style={styles.reminderContainer} onPress={handleSetReminder}>
				<Text style={styles.reminderText}>Set Reminder For Daily Goal</Text>
				<AntDesign name='clockcircleo' size={18} color='white' />
			</TouchableOpacity>

			{/*Time Picker */}
			<DateTimePicker value={selectedTime} mode={'time'} onChange={handleTimeChange} />
		</View>
	);
};

const styles = StyleSheet.create({
	reminderContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 20,
		backgroundColor: '#10B981',
		padding: 15,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 5
	},
	reminderText: { fontSize: 16, marginRight: 5, color: 'white' },
	dailyGoalsContainer: { marginTop: 20, alignItems: 'center', width: '100%' },
	goalText: { fontSize: 16, marginVertical: 5, color: '#065F46' },
	sectionTitle: { fontSize: 22, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 10, color: '#065F46' }
});

export default FutureRemainder;
