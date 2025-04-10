import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Circle, G, Svg, Text as SvgText } from 'react-native-svg';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

import ProgressByTopic from '../../components/ProgressByTopic';
import AsyncStorage from '@react-native-async-storage/async-storage';

const totalLessons = 150;

const ProgressTracker = ({ userName = '' }) => {
	// state variables
	const [loading, setLoading] = useState(false); // loading state
	const [error, setError] = useState(null); // error state for fetchign data
	const [isDataAvailable, setIsDataAvailable] = useState(true); // to check if data is available
	const [selectedFilter, setSelectedfilter] = useState('weekly'); // weekly, monthly, yearly filter
	const [completedLessons, setCompletedLessons] = useState([]); // array to stpre completed lessons data
	const [progressData, setProgressData] = useState({
		weekly: [],
		monthly: [],
		yearly: []
	});
	const [timeTaken, setTimeTaken] = useState(0); // time taken to complete lessons
	const [totalTimeRequired, setTotalTimeRequired] = useState(100); // total time required to complete all lessons
	const [badges, setBadges] = useState([]); // badges based on learning progress
	const [refreshing, setRefresh] = useState(false); // refreshing data
	const [topics, setTopics] = useState([]); // stores topics from firestore

	// process data according to week, month and year
	const processData = jsonData => {
		const data = JSON.parse(jsonData);

		const dayOfWeekCounts = {
			Sunday: 0,
			Monday: 0,
			Tuesday: 0,
			Wednesday: 0,
			Thursday: 0,
			Friday: 0,
			Saturday: 0
		};
		const monthCounts = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
			7: 0,
			8: 0,
			9: 0,
			10: 0,
			11: 0,
			12: 0
		};
		const yearCounts = {
			2024: 0,
			2025: 0,
			2026: 0
		};

		const topicCounts = {};

		const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

		let completedLessonsCount = 0;

		for (const dateStr in data) {
			if (data.hasOwnProperty(dateStr)) {
				const dateParts = dateStr.split('/');
				const month = parseInt(dateParts[0]);
				const day = parseInt(dateParts[1]);
				const year = parseInt(dateParts[2]);

				const date = new Date(year, month - 1, day);

				const dayOfWeek = daysOfWeek[date.getDay()];

				const monthKey = `${month}`;

				const yearKey = `${year}`;

				const entriesForDate = data[dateStr].length;
				completedLessonsCount += entriesForDate;

				dayOfWeekCounts[dayOfWeek] += entriesForDate;
				monthCounts[monthKey] = (monthCounts[monthKey] || 0) + entriesForDate;
				yearCounts[yearKey] = (yearCounts[yearKey] || 0) + entriesForDate;

				data[dateStr].forEach(entry => {
					const topic = entry.topic;
					const words = entry.noOfWordsSpoken;

					if (!topicCounts[topic]) {
						topicCounts[topic] = 0;
					}
					topicCounts[topic] += words;
				});
			}
		}

		const dayOfWeekArray = daysOfWeek.map(day => dayOfWeekCounts[day]);
		const monthlyCounts = Object.values(monthCounts);
		const yearlyCounts = Object.values(yearCounts);

		const topicsArray = Object.keys(topicCounts).map(topic => ({
			title: topic,
			wordsSpoken: topicCounts[topic]
		}));

		setTopics(topicsArray);
		setCompletedLessons(completedLessonsCount);

		return {
			weekly: dayOfWeekArray,
			monthly: monthlyCounts,
			yearly: yearlyCounts
		};
	};

	// Loading progress from AsyncStorage
	const loadprogress = async () => {
		setLoading(true);
		setError(null);
		try {
			const storedProgress = await AsyncStorage.getItem('progress');

			if (storedProgress) {
				const processedData = processData(storedProgress); // process the data
				setProgressData(processedData);
				setIsDataAvailable(true);
			} else {
				setIsDataAvailable(false);
			}
		} catch (error) {
			console.log('Error loading progress:', error);
		} finally {
			setLoading(false);
			setRefresh(false);
		}
	};

	useEffect(() => {
		loadprogress();
	}, []);

	const progressPercentage = parseInt((completedLessons / totalLessons) * 100);
	// Update badges
	useEffect(() => {
		const updatedBadges = [
			{ title: 'Bronze', earned: completedLessons >= 5 },
			{ title: 'Silver', earned: completedLessons >= 50 },
			{ title: 'Gold', earned: completedLessons >= 150 }
		];
		setBadges(updatedBadges);
	}, [completedLessons]);

	//generating Y axis
	const getYAxisLabels = () => {
		if (!progressData[selectedFilter] || progressData[selectedFilter].length === 0) return [100, 80, 60, 40, 20, 0];
		const maxLessons = Math.max(...progressData[selectedFilter]) || 100;
		const step = Math.ceil(maxLessons / 5);
		const roundedStep = step % 2 === 0 ? step : step + 1;
		const labels = [];
		for (let i = maxLessons; i >= 0; i -= roundedStep) {
			labels.push(i);
		}
		return labels;
	};

	//refreshing data
	const onRefresh = () => {
		setRefresh(true);
		loadprogress();
	};

	if (loading) {
		return <ActivityIndicator size='large' color='#3B85F6' />;
	}

	return (
		<ScrollView
			contentContainerStyle={styles.container}
			refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
			{/* header section*/}
			<LinearGradient colors={['#1D4ED8', '#3B82F6']} style={styles.header}>
				<Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
				<View>
					<Text style={styles.userName}>Hello, {userName}</Text>
					<Text style={styles.progressTexts}>Progress: {progressPercentage} %</Text>
				</View>
				<TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
					<AntDesign name='reload1' size={24} color='white' />
				</TouchableOpacity>
			</LinearGradient>
			{isDataAvailable ? <></> : <Text style={styles.title}>No data Available. Start learning!</Text>}

			{/* Progress Chart */}
			<Text style={styles.sectionTitle}>Progress</Text>
			<View style={styles.progressContainer}>
				{/* Circular Progress for Lessons */}
				<View style={styles.circularProgressContainer}>
					<Svg width={120} height={120}>
						<G rotation='-90' origin='60, 60'>
							<Circle cx='60' cy='60' r='50' stroke='#E3F2FD' strokeWidth='10' fill='transparent' />
							<Circle
								cx='60'
								cy='60'
								r='50'
								stroke='#3B82F6'
								strokeWidth='10'
								fill='transparent'
								strokeDasharray={`${(completedLessons / totalLessons) * 314}, 314`} // 314 is the circumference of the circle
							/>
						</G>
						{/* Centered Text for Lessons */}
						<SvgText x='60' y='50' textAnchor='middle' alignmentBaseline='middle' fontSize='16' fontWeight='bold' fill='#3B82F6'>
							{`${completedLessons} / ${totalLessons}`}
						</SvgText>
					</Svg>
					<Text style={styles.circularProgressLabel}>Lessons</Text>
				</View>
			</View>

			{/*Filtering options */}
			<View style={styles.filterOptionsContainer}>
				<TouchableOpacity
					style={[styles.filterButton, selectedFilter === 'weekly' && styles.selectedFilterButton]}
					onPress={() => setSelectedfilter('weekly')}>
					<Text style={styles.filterButtonText}>Weekly</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.filterButton, selectedFilter === 'monthly' && styles.selectedFilterButton]}
					onPress={() => setSelectedfilter('monthly')}>
					<Text style={styles.filterButtonText}>Monthly</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.filterButton, selectedFilter === 'yearly' && styles.selectedFilterButton]}
					onPress={() => setSelectedfilter('yearly')}>
					<Text style={styles.filterButtonText}>Yearly</Text>
				</TouchableOpacity>
			</View>

			{/* Graph */}
			<View style={styles.graphContainer}>
				{/* Y Axis Labels */}
				<View style={styles.yAxisLabels}>
					{getYAxisLabels().map(label => (
						<Text key={label} style={styles.yAxisLabel}>
							{label}
						</Text>
					))}
				</View>
				{/* X Axis and Progress Bars */}
				<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartScrollContainer}>
					<View style={styles.chartContainer}>
						{/* If no data, render default bars */}
						{progressData[selectedFilter].length === 0
							? // Default bars for weekly, monthly, or yearly
								selectedFilter === 'weekly'
								? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
										<View key={index} style={styles.barContainer}>
											<LinearGradient
												colors={['#3B82F6', '#1D4ED8']}
												style={[styles.progressBar, { height: `${(progressData.weekly.length / 7) * 100}%` }]}
											/>
											<Text style={styles.dayText}>{day}</Text>
										</View>
									))
								: selectedFilter === 'monthly'
									? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
											<View key={index} style={styles.barContainer}>
												<LinearGradient
													colors={['#3B82F6', '#1D4ED8']}
													style={[styles.progressBar, { height: `${(progressData.monthly.length / 30) * 100}%` }]}
												/>
												<Text style={styles.dayText}>{month}</Text>
											</View>
										))
									: ['2024', '2025', '2026'].map((year, index) => (
											<View key={index} style={styles.barContainer}>
												<LinearGradient
													colors={['#3B82F6', '#1D4ED8']}
													style={[styles.progressBar, { height: `${(progressData.yearly.length / 365) * 100}%` }]}
												/>
												<Text style={styles.dayText}>{year}</Text>
											</View>
										))
							: // Bars with actual data
								progressData[selectedFilter].map((value, index) => {
									return (
										<View key={index} style={styles.barContainer}>
											<LinearGradient
												colors={['#3B82F6', '#1D4ED8']}
												style={[styles.progressBar, { height: `${(value / Math.max(...progressData[selectedFilter])) * 100}%` }]}
											/>
											<Text style={styles.dayText}>
												{selectedFilter === 'weekly'
													? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]
													: selectedFilter === 'monthly'
														? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]
														: ['2024', '2025', '2026'][index]}
											</Text>
										</View>
									);
								})}
					</View>
				</ScrollView>
			</View>
			{/* Levels */}
			<View style={styles.levelsContainer}>
				{badges.map((badge, index) => (
					<View key={index} style={styles.levelItem}>
						<Text style={[styles.levelText, badge.earned && styles.earned]}> {badge.title}</Text>
						{badge.earned && <AntDesign name='checkcircle' size={20} color='#3B82F6' style={styles.checkIcon} />}
					</View>
				))}
			</View>
			<ProgressByTopic topics={topics} />
		</ScrollView>
	);
};

//styling
const styles = StyleSheet.create({
	container: { flexGrow: 1, padding: 20, paddingTop: 60, backgroundColor: 'white', alignItems: 'center' },
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		padding: 20,
		marginTop: 10,
		marginBottom: 20,
		borderRadius: 10,
		elevation: 5,
		position: 'relative'
	},
	avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
	userName: { fontSize: 20, fontWeight: 'bold', color: 'white' },
	progressText: { fontSize: 16, color: '#E3F2FD' },
	progressTexts: { color: 'black', paddingBottom: 5 },
	settingsButton: { marginLeft: 'auto' },
	modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#ECFDF5' },
	modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1D4ED8' },
	levelButton: { padding: 15, marginVertical: 10, backgroundColor: '#E3F2FD', borderRadius: 10, width: '80%' },
	selectedLevelButton: { backgroundColor: '#3B82F6' },
	levelButtonText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#1D4ED8' },
	sectionTitle: { fontSize: 22, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 10, color: '#1D4ED8' },
	filterContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		marginBottom: 20
	},
	lessonText: { fontSize: 16, fontWeight: 'bold' },
	filterOptionsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
	filterButton: { padding: 10, borderRadius: 5, backgroundColor: '#E3F2FD' },
	selectedFilterButton: { backgroundColor: '#3B82F6' },
	filterButtonText: { fontSize: 16, fontWeight: 'bold', color: '#1D4ED8' },
	graphContainer: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		height: 290,
		width: '100%',
		backgroundColor: '#E3F2FD',
		padding: 20,
		borderRadius: 10,
		position: 'relative',
		elevation: 5
	},
	progressAnimation: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 5 },
	yAxisLabels: {
		reminderContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 20,
			backgroundColor: '#3B82F6',
			padding: 15,
			borderRadius: 10,
			shadowColor: '#000',
			shadowOpacity: 0.1,
			shadowRadius: 3,
			elevation: 5
		},
		reminderText: { fontSize: 16, marginRight: 5, color: 'white' },
		dailyGoalsContainer: { marginTop: 20, alignItems: 'center', width: '100%' },
		goalText: { fontSize: 16, marginVertical: 5, color: '#1D4ED8' },
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		paddingRight: 5,
		height: '90%',
		position: 'absolute',
		left: 10,
		top: 30,
		bottom: 0
	},
	yAxisLabel: { fontSize: 14, fontWeight: 'bold', color: '#1D4ED8' },
	chartScrollContainer: { flexGrow: 1, paddingLeft: '15%', top: 5 },
	chartContainer: { flexDirection: 'row', alignItems: 'flex-end', height: '100%' },
	earnedLevel: { color: '#3B82F6' },
	barContainer: { alignItems: 'center', justifyContent: 'flex-end', width: 50 },
	topicsContainer: { marginTop: 30, width: '100%' },
	topicsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
	topicCard: {
		width: '48%',
		backgroundColor: '#E3F2FD',
		borderRadius: 10,
		padding: 15,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3
	},
	topicHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
	topicImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
	topicItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginVertical: 10,
		backgroundColor: '#E3F2FD',
		padding: 15,
		borderRadius: 10
	},
	topicText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
	progressText: { fontSize: 14, color: '#666', marginBottom: 5 },
	progressBarContainer: { height: 5, backgroundColor: '#E3F2FD', borderRadius: 5, overflow: 'hidden', marginBottom: 10 },
	progressBarFill: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 5 },
	speakButton: { backgroundColor: '#3B82F6', padding: 10, borderRadius: 5, alignItems: 'center' },
	speakButtonText: { color: '#FFF', fontWeight: 'bold' },
	progressBar: { width: 30, borderRadius: 5 },
	progressAnimation: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 5 },
	dayText: { marginTop: 5, fontSize: 14, fontWeight: 'bold', color: '#1D4ED8' },
	levelsContainer: { marginTop: 30, alignItems: 'center', width: '100%' },
	levelItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 5,
		backgroundColor: '#E3F2FD',
		padding: 30,
		borderRadius: 10,
		width: '100%',
		justifyContent: 'space-between'
	},
	levelText: { fontSize: 20, fontWeight: 'bold', color: '#1D4ED8' },
	earnedLevel: { color: '#3B82F6' },
	checkIcon: { marginLeft: 10 },
	topicsContainer: { marginTop: 30, width: '100%' },
	topicsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
	topicCard: {
		width: '48%',
		backgroundColor: '#E3F2FD',
		borderRadius: 10,
		padding: 15,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3
	},
	topicHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
	topicImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
	topicItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginVertical: 10,
		backgroundColor: '#E3F2FD',
		padding: 15,
		borderRadius: 10
	},
	topicText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
	progressText: { fontSize: 14, color: '#666', marginBottom: 5 },
	progressBarContainer: { height: 5, backgroundColor: '#E3F2FD', borderRadius: 5, overflow: 'hidden', marginBottom: 10 },
	progressBarFill: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 5 },
	speakButton: { backgroundColor: '#3B82F6', padding: 10, borderRadius: 5, alignItems: 'center' },
	speakButtonText: { color: '#FFF', fontWeight: 'bold' },
	progressContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%',
		marginBottom: 20
	},
	circularProgressContainer: { alignItems: 'center' },
	circularProgressLabel: { fontSize: 16, color: '#666', marginTop: 10, fontWeight: 'bold' },
	refreshButton: { position: 'absolute', right: 15 }
});

export default ProgressTracker;
