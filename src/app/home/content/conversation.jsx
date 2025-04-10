import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { io } from 'socket.io-client';
import * as Speech from 'expo-speech';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Voice from '@react-native-voice/voice';

import { router, useLocalSearchParams } from 'expo-router';

export const socket = io('http://speakease-qveub.ondigitalocean.app');
const API_URL = 'http://speakease-qveub.ondigitalocean.app/feedback';
const API_URL_SCORE = 'http://speakease-qveub.ondigitalocean.app/score';

const Conversation = () => {
	const queryRef = useRef(query);
	const { topic, title, mainTopic } = useLocalSearchParams();

	const [isConnected, setIsConnected] = useState(false); // whether websocket connection with the server is successful
	const [history, setHistory] = useState([]); // all messages between user and system
	const [query, setQuery] = useState(''); // current message by user
	const [lastReply, setLastReply] = useState(''); // server's last reply
	const [isReplyAvailable, setIsReplyAvailable] = useState(true); // whether server has responded
	const [showFeedback, setShowFeedback] = useState(false);
	const [feedback, setFeedback] = useState('');
	const [isPlaying, setIsPlaying] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [score, setScore] = useState({ grammar: 0, vocabulary: 0 }); // from backend

	// responsible for fetching feedback and score from the backend
	const getFeedback = async () => {
		try {
			const response = await fetch(API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(history)
			});

			const score = await fetch(API_URL_SCORE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(history)
			});

			const json = await response.json();
			const scoreJson = await score.json();

			// console.log(json, scoreJson);

			setFeedback(json.feedback);
			setScore({ grammar: scoreJson.grammar, vocabulary: scoreJson.vocabulary });
		} catch (error) {}
	};

	// send initial context
	const sendTopic = () => {
		const description = `The user wants to ${topic}`;
		socket.emit('topic', description);
	};

	// everytime a message is sent
	const sendMessage = () => {
		if (query.trim().length === 0) return; // for empty messages
		setIsReplyAvailable(false);
		socket.emit('request', [...history, { role: 'user', content: query.trim() }]);
	};

	const onConnect = () => {
		setIsConnected(true);
		sendTopic();

		socket.on('reply', reply => {
			if (reply != null) {
				setHistory(prev => [
					...prev,
					{
						role: 'user',
						content: queryRef.current
					},
					{
						role: 'system',
						content: reply
					}
				]);
				setLastReply(reply);
				speak(reply);
			}
			setQuery(''); // clear the input
			setIsReplyAvailable(true);
		});
	};

	useEffect(() => {
		queryRef.current = query;
	}, [query]);

	const speak = content => {
		// register event listener if not handled manually
		Speech.speak(content, {
			onStart: () => setIsPlaying(true),
			onDone: () => setIsPlaying(false)
		});
	};

	const onSpeechResults = e => {
		// console.log('onSpeechResults: ', e);
		if (e.value && e.value?.length > 0) {
			setQuery(q => q + e.value[0]);
		}
	};

	useEffect(() => {
		// Voice.onSpeechResults = onSpeechResults;
		// return () => {
		// 	Voice.destroy().then(Voice.removeAllListeners);
		// };
	}, []);

	const startRecording = async () => {
		setIsRecording(true);

		try {
			// await Voice.start('en-US');
		} catch (e) {
			console.log(e);
		}
	};

	const stopRecording = async () => {
		try {
			// await Voice.stop();
			setIsRecording(false);
			// console.log(query);
			// sendMessage();
		} catch (e) {
			console.error(e);
		}
	};

	const onDisconnect = () => {
		setIsConnected(false);
	};

	const toggleAudioButton = () => {
		if (isPlaying) {
			setIsPlaying(false);
			Speech.stop();
		} else {
			setIsPlaying(true);
			Speech.speak(lastReply);
		}
	};

	const getNoOfWordsSpoken = () => {
		// filter all user messages and count the number of words spoken
		return history
			.filter(item => item.role === 'user')
			.reduce((sum, item) => {
				return sum + (item.content.length || 0);
			}, 0);
	};

	const storeLessonStatus = async () => {
		try {
			const currentDate = new Date().toLocaleDateString('en-US', {
				month: '2-digit',
				day: '2-digit',
				year: 'numeric'
			});

			const timeStamp = new Date().toISOString();

			const progressData = await AsyncStorage.getItem('progress');
			let progress = progressData ? JSON.parse(progressData) : {};

			const current = {
				noOfWordsSpoken: getNoOfWordsSpoken(),
				timeStamp,
				topic: mainTopic
			};

			if (progress[currentDate]) {
				progress[currentDate].push(current);
			} else {
				progress[currentDate] = [current];
			}

			// console.log(progress);
			await AsyncStorage.setItem('progress', JSON.stringify(progress));

			// for goals
			let value = await AsyncStorage.getItem('completedLessons');
			value = parseInt(value);
			// sometimes value may be NaN
			if (isNaN(value)) {
				value = 0;
			}
			await AsyncStorage.setItem('completedLessons', (value + 1).toString());
		} catch (error) {
			console.log(error);
		}
	};

	const endLesson = () => {
		Speech.stop();
		setShowFeedback(true);
		storeLessonStatus();
		getFeedback();
	};

	// register all callbacks related to socket connection
	useEffect(() => {
		if (socket.connected) {
			onConnect();
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
		};
	}, []);

	if (showFeedback) {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => {
							router.navigate('/home/content/mainTopics');
						}}>
						<Ionicons name='chevron-back' size={24} color='#000' />
					</TouchableOpacity>
				</View>

				<View style={styles.scoreContainer}>
					<View style={styles.feedbackSection}>
						<Text style={styles.feedbackTitle}>Grammar</Text>
						<Text style={styles.feedbackText}>{`${score.grammar} / 5`}</Text>
					</View>

					<View style={styles.feedbackSection}>
						<Text style={styles.feedbackTitle}>Vocabulary</Text>
						<Text style={styles.feedbackText}>{`${score.vocabulary} / 5`}</Text>
					</View>

					<ScrollView style={styles.detailedAnalysisContainer}>
						<Text style={styles.detailedAnalysisTitle}>Detailed Analysis</Text>

						<View style={styles.detailedAnalysisContent}>
							<Text style={styles.detailedAnalysisText}>{feedback || 'Loading...'}</Text>
						</View>
					</ScrollView>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => {
						router.navigate('/home/content/mainTopics');
					}}
					style={styles.backButton}>
					<Ionicons name='chevron-back' size={24} color='#000' />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>{title?.substring(0, 15)}</Text>
				<TouchableOpacity
					style={styles.endButton}
					onPress={() => {
						endLesson();
					}}>
					<Text style={styles.endButtonText}>End</Text>
				</TouchableOpacity>
			</View>

			<View>
				<Text style={[styles.statusText, { color: isConnected ? '#49ab4d' : '#fc4f3d' }]}>
					{isConnected ? 'Connected' : 'Disconnected'}
				</Text>
			</View>

			{isConnected ? (
				<>
					{lastReply && (
						<ScrollView>
							<View style={styles.messageContainer}>
								<Text style={styles.messageText}>{lastReply}</Text>

								<TouchableOpacity style={styles.audioButton} onPress={toggleAudioButton}>
									<FontAwesome name={isPlaying ? 'pause' : 'play'} size={15} color='#fff' />
								</TouchableOpacity>
							</View>
						</ScrollView>
					)}
					{isReplyAvailable && (
						<>
							<View style={styles.recordContainer}>
								<TouchableOpacity
									style={[styles.recordButton, isRecording && styles.recording]}
									onPress={isRecording ? stopRecording : startRecording}>
									<MaterialIcons name={isRecording ? 'stop' : 'mic'} size={32} color='#fff' />
								</TouchableOpacity>
								<Text style={styles.recordText}>{isRecording ? 'Listening ...' : 'Tap to Speak!'}</Text>
							</View>

							<View style={styles.inputContainer}>
								<TextInput
									style={styles.input}
									value={query}
									onChangeText={value => {
										setQuery(value);
									}}
								/>
								<TouchableOpacity onPress={sendMessage}>
									<MaterialIcons name='send' size={25} color='#3B7D9F' />
								</TouchableOpacity>
							</View>
						</>
					)}
				</>
			) : (
				<Text></Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	statusText: {
		fontSize: 14,
		fontWeight: 'bold',
		marginLeft: 22,
		marginTop: 10
	},
	inputContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	input: {
		height: 50,
		width: '80%',
		margin: 12,
		padding: 10,
		borderRadius: 5,
		backgroundColor: '#D3F1FF',
		alignSelf: 'center',
		color: '#3B7D9F',
		fontSize: 15
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
		paddingHorizontal: 6,
		marginTop: 40
	},
	backButton: {
		padding: 9
	},
	headerTitle: {
		color: '#000000',
		fontSize: 16,
		fontWeight: 'bold'
	},
	endButton: {
		backgroundColor: '#fc4f3d',
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 20
	},
	endButtonText: {
		color: '#fff',
		fontWeight: 'bold'
	},
	messageContainer: {
		padding: 17,
		borderRadius: 18,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		maxWidth: '75%',
		backgroundColor: '#3B7D9F',
		borderBottomLeftRadius: 5,
		marginLeft: 20,
		marginTop: 20
	},
	messageText: {
		flex: 1,
		fontSize: 15,
		color: '#fff'
	},
	audioButton: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: '#2c3e50',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 8
	},
	recordContainer: {
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#fff'
	},
	recordButton: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: '#3B7D9F',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10
	},
	recordText: {
		fontSize: 15,
		color: '#808787'
	},
	scoreContainer: {
		padding: 15
	},
	feedbackSection: {
		marginBottom: 12,
		backgroundColor: '#f9f9f9',
		borderRadius: 10,
		padding: 12,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	feedbackTitle: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#2c3e50'
	},
	feedbackText: {
		fontSize: 14,
		color: '#7f8c8d',
		lineHeight: 20
	},
	detailedAnalysisContainer: {
		backgroundColor: '#D3F1FF',
		borderRadius: 10,
		borderColor: '#D3F1FF',
		height: '50%'
	},
	detailedAnalysisTitle: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#2c3e50',
		textAlign: 'center',
		marginTop: 15
	},
	detailedAnalysisContent: {
		padding: 15
	},
	detailedAnalysisText: {
		fontSize: 14,
		color: '#34495e',
		textAlign: 'justify'
	}
});

export default Conversation;
