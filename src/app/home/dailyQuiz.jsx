import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/Button.jsx';

const mockData = {
	weekdays: {
		Monday: [
			{
				question: "What is the correct form of the verb in this sentence: 'She _____ to the store yesterday.'",
				options: ['go', 'goes', 'went', 'going'],
				correctAnswer: 'went'
			},
			{
				question: "Which word means 'a strong desire or impulse'?",
				options: ['Urge', 'Surge', 'Dirge', 'Purge'],
				correctAnswer: 'Urge'
			},
			{
				question: "What is the plural form of 'crisis'?",
				options: ['Crisises', 'Crises', 'Crisie', 'Crisis'],
				correctAnswer: 'Crises'
			},
			{
				question: "Which is the correct comparative form of 'good'?",
				options: ['Gooder', 'More good', 'Better', 'Best'],
				correctAnswer: 'Better'
			},
			{
				question: "What does the word 'ephemeral' mean?",
				options: ['Lasting forever', 'Short-lived', 'Extremely heavy', 'Transparent'],
				correctAnswer: 'Short-lived'
			}
		],
		Tuesday: [
			{
				question: 'Which sentence is grammatically correct?',
				options: [
					'Neither of the options were chosen.',
					'Neither of the options was chosen.',
					'Neither of the option was chosen.',
					'Neither of the option were chosen.'
				],
				correctAnswer: 'Neither of the options was chosen.'
			},
			{
				question: "What does the word 'ubiquitous' mean?",
				options: ['Rare', 'Present everywhere', 'Uncertain', 'Ancient'],
				correctAnswer: 'Present everywhere'
			},
			{
				question: "Which word is a synonym for 'benevolent'?",
				options: ['Kind', 'Strict', 'Lazy', 'Angry'],
				correctAnswer: 'Kind'
			},
			{
				question: 'Choose the correct sentence:',
				options: ['I should of gone.', 'I should have went.', 'I should have gone.', 'I should of went.'],
				correctAnswer: 'I should have gone.'
			},
			{
				question: "What does 'paradox' mean?",
				options: ['A statement that contradicts itself', 'A perfect solution', 'A type of bird', 'A medical condition'],
				correctAnswer: 'A statement that contradicts itself'
			}
		],
		Wednesday: [
			{
				question: "Which verb tense is used in: 'I have been studying for hours.'?",
				options: ['Present simple', 'Present perfect', 'Present continuous', 'Present perfect continuous'],
				correctAnswer: 'Present perfect continuous'
			},
			{
				question: "What does the word 'pragmatic' mean?",
				options: ['Theoretical', 'Practical', 'Emotional', 'Spiritual'],
				correctAnswer: 'Practical'
			},
			{
				question: 'Choose the correct spelling:',
				options: ['Accomodate', 'Acomodate', 'Accommodate', 'Acommodate'],
				correctAnswer: 'Accommodate'
			},
			{
				question: "What part of speech is 'quickly' in the sentence: 'She quickly solved the problem.'?",
				options: ['Adjective', 'Adverb', 'Verb', 'Noun'],
				correctAnswer: 'Adverb'
			},
			{
				question: "What does 'quintessential' mean?",
				options: ['The fifth element', 'Representing the perfect example', 'Very small', 'Extremely loud'],
				correctAnswer: 'Representing the perfect example'
			}
		],
		Thursday: [
			{
				question: 'Which is the correct possessive form?',
				options: ["The childrens' toys", "The children's toys", 'The childrens toys', "The childs' toys"],
				correctAnswer: "The children's toys"
			},
			{
				question: "What does 'serendipity' mean?",
				options: ['Planned event', 'Happy accident', 'Serious mistake', 'Formal ceremony'],
				correctAnswer: 'Happy accident'
			},
			{
				question: 'Which sentence uses the correct article?',
				options: [
					'She is an university student.',
					'She is a university student.',
					'She is the university student.',
					'She is university student.'
				],
				correctAnswer: 'She is a university student.'
			},
			{
				question: "What is the meaning of 'eloquent'?",
				options: ['Fluent and persuasive in speech', 'Silent and reserved', 'Extremely tall', 'Financially wealthy'],
				correctAnswer: 'Fluent and persuasive in speech'
			},
			{
				question: "Which word is an antonym for 'frugal'?",
				options: ['Economical', 'Thrifty', 'Extravagant', 'Careful'],
				correctAnswer: 'Extravagant'
			}
		],
		Friday: [
			{
				question: "What is the correct passive form of: 'They build houses'?",
				options: ['Houses build by them.', 'Houses are build by them.', 'Houses are built by them.', 'Houses built by them.'],
				correctAnswer: 'Houses are built by them.'
			},
			{
				question: "What does 'ambivalent' mean?",
				options: ['Having mixed feelings', 'Being very talented', 'Extremely intelligent', 'Completely certain'],
				correctAnswer: 'Having mixed feelings'
			},
			{
				question: 'Which sentence has the correct subject-verb agreement?',
				options: [
					'The team are playing well.',
					'The team is playing well.',
					'The team be playing well.',
					'The team plays well today.'
				],
				correctAnswer: 'The team is playing well.'
			},
			{
				question: "What is the meaning of 'esoteric'?",
				options: ['Common knowledge', 'Intended for a small group', 'Very old', 'Extremely difficult'],
				correctAnswer: 'Intended for a small group'
			},
			{
				question: "Which word is a synonym for 'pernicious'?",
				options: ['Helpful', 'Harmful', 'Beautiful', 'Strong'],
				correctAnswer: 'Harmful'
			}
		]
	},
	weekend: {
		Saturday: [
			{
				question: 'Which sentence uses the subjunctive mood correctly?',
				options: ['I wish I was taller.', 'I wish I were taller.', 'I wish I am taller.', 'I wish I be taller.'],
				correctAnswer: 'I wish I were taller.'
			},
			{
				question: "What does 'juxtapose' mean?",
				options: ['To place side by side', 'To jump over', 'To speak loudly', 'To write clearly'],
				correctAnswer: 'To place side by side'
			},
			{
				question: "Which word is a homonym for 'bear'?",
				options: ['Beer', 'Bare', 'Bird', 'Bore'],
				correctAnswer: 'Bare'
			},
			{
				question: "What is a 'portmanteau'?",
				options: ['A type of briefcase', 'A blended word', 'A French dessert', 'A musical instrument'],
				correctAnswer: 'A blended word'
			},
			{
				question: 'Which sentence contains a split infinitive?',
				options: [
					'She decided to quickly run to the store.',
					'She quickly decided to run to the store.',
					'She decided quickly to run to the store.',
					'She decided to run quickly to the store.'
				],
				correctAnswer: 'She decided to quickly run to the store.'
			},
			{
				question: "What does 'cacophony' mean?",
				options: ['A harsh mixture of sounds', 'Perfect harmony', 'A type of musical instrument', 'A silent gesture'],
				correctAnswer: 'A harsh mixture of sounds'
			},
			{
				question: 'Which is the correct form of the conditional?',
				options: [
					'If I would have known, I would have come.',
					'If I had known, I would had come.',
					'If I had known, I would have come.',
					'If I have known, I would come.'
				],
				correctAnswer: 'If I had known, I would have come.'
			}
		],
		Sunday: [
			{
				question: 'Which sentence uses parallelism correctly?',
				options: [
					'She likes swimming, hiking, and to ride bikes.',
					'She likes swimming, hiking, and riding bikes.',
					'She likes to swim, hiking, and to ride bikes.',
					'She likes swimming, to hike, and riding bikes.'
				],
				correctAnswer: 'She likes swimming, hiking, and riding bikes.'
			},
			{
				question: "What does 'sycophant' mean?",
				options: ['A powerful ruler', 'An insincere flatterer', 'A wise teacher', 'A mysterious creature'],
				correctAnswer: 'An insincere flatterer'
			},
			{
				question: 'Which is an example of onomatopoeia?',
				options: ['Beautiful', 'Expensive', 'Buzz', 'Delicious'],
				correctAnswer: 'Buzz'
			},
			{
				question: "What is the meaning of 'loquacious'?",
				options: ['Silent', 'Talkative', 'Sleepy', 'Confused'],
				correctAnswer: 'Talkative'
			},
			{
				question: 'Which of these words is an oxymoron?',
				options: ['Happy days', 'Deafening silence', 'Blue sky', 'Running water'],
				correctAnswer: 'Deafening silence'
			},
			{
				question: "What does 'iconoclast' mean?",
				options: ['A religious icon', 'Someone who attacks cherished beliefs', 'A famous actor', 'An ancient artifact'],
				correctAnswer: 'Someone who attacks cherished beliefs'
			},
			{
				question: 'Which sentence demonstrates correct use of a semicolon?',
				options: [
					'She went to the store; and bought milk.',
					'She went to the store; she bought milk.',
					'She went to the store, she bought milk.',
					'She went to the store; because she needed milk.'
				],
				correctAnswer: 'She went to the store; she bought milk.'
			}
		]
	}
};

const DailyQuiz = () => {
	const [selectedDay, setSelectedDay] = useState(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [quizCompleted, setQuizCompleted] = useState(false);
	const [selectedOption, setSelectedOption] = useState(null);
	const [answerSubmitted, setAnswerSubmitted] = useState(false);
	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	const [quizData, setQuizData] = useState(mockData);

	const fetchQuiz = async () => {
		try {
			const API_URL_QUIZ = 'http://speakease-qveub.ondigitalocejn.app/quiz';
			const response = await fetch(API_URL_QUIZ);
			const data = await response.json();
			// console.log('data is ', data['weekdays']['Friday']);

			setQuizData(data ?? mockData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchQuiz();
	}, []);

	const handleDaySelect = day => {
		setSelectedDay(day);
		setCurrentQuestionIndex(0);
		setScore(0);
		setQuizCompleted(false);
		setSelectedOption(null);
		setAnswerSubmitted(false);
	};

	const getCurrentQuestions = () => {
		if (!selectedDay) return [];

		const isWeekend = selectedDay === 'Saturday' || selectedDay === 'Sunday';
		return isWeekend ? quizData.weekend[selectedDay] : quizData.weekdays[selectedDay];
	};

	const handleOptionSelect = option => {
		if (answerSubmitted) return;
		setSelectedOption(option);
	};

	const handleSubmitAnswer = () => {
		if (!selectedOption || answerSubmitted) return;

		const questions = getCurrentQuestions();
		const currentQuestion = questions[currentQuestionIndex];

		if (selectedOption === currentQuestion.correctAnswer) {
			setScore(score + 1);
		}

		setAnswerSubmitted(true);

		// Move to next question after 1.5 seconds
		setTimeout(() => {
			if (currentQuestionIndex < questions.length - 1) {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
				setSelectedOption(null);
				setAnswerSubmitted(false);
			} else {
				setQuizCompleted(true);
			}
		}, 1500);
	};

	const handleStartOver = () => {
		setSelectedDay(null);
		setCurrentQuestionIndex(0);
		setScore(0);
		setQuizCompleted(false);
		setSelectedOption(null);
		setAnswerSubmitted(false);
	};

	const getOptionStyle = option => {
		if (!answerSubmitted) {
			return selectedOption === option ? styles.selectedOption : styles.option;
		}

		const questions = getCurrentQuestions();
		const currentQuestion = questions[currentQuestionIndex];

		if (option === currentQuestion.correctAnswer) {
			return styles.correctOption;
		}

		if (option === selectedOption && selectedOption !== currentQuestion.correctAnswer) {
			return styles.incorrectOption;
		}

		return styles.option;
	};

	return (
		<SafeAreaView style={styles.container}>
			<LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.gradient}>
				<ScrollView contentContainerStyle={styles.scrollContent}>
					<Text style={styles.title}>Daily English Quiz</Text>

					{!selectedDay ? (
						<>
							<Text style={styles.subtitle}>Select a day to start your quiz:</Text>
							<View style={styles.daysContainer}>
								{days.map(day => (
									<TouchableOpacity key={day} style={styles.dayButton} onPress={() => handleDaySelect(day)}>
										<Text style={styles.dayButtonText}>{day}</Text>
									</TouchableOpacity>
								))}
							</View>
						</>
					) : quizCompleted ? (
						<View style={styles.resultContainer}>
							<Text style={styles.resultTitle}>Quiz Completed!</Text>
							<Text style={styles.resultScore}>
								Your score: {score}/{getCurrentQuestions().length}
							</Text>
							<Text style={styles.resultMessage}>
								{score === getCurrentQuestions().length
									? "Perfect! You're a grammar and vocabulary master!"
									: score >= getCurrentQuestions().length * 0.7
										? 'Great job! Keep practicing to improve further.'
										: 'Good effort! Regular practice will help you improve.'}
							</Text>
							<Button title='Try Another Day' onPress={handleStartOver} style={styles.startOverButton} />
						</View>
					) : (
						<View style={styles.quizContainer}>
							<Text style={styles.dayTitle}>{selectedDay}'s Quiz</Text>
							<TouchableOpacity style={styles.backButton} onPress={handleStartOver}>
								<Text style={styles.backButtonText}>← Back</Text>
							</TouchableOpacity>
							<View style={styles.progressContainer}>
								<Text style={styles.progressText}>
									Question {currentQuestionIndex + 1} of {getCurrentQuestions().length}
								</Text>
								<View style={styles.progressBar}>
									<View
										style={[
											styles.progressFill,
											{ width: `${((currentQuestionIndex + 1) / getCurrentQuestions().length) * 100}%` }
										]}
									/>
								</View>
							</View>

							<View style={styles.questionCard}>
								<Text style={styles.questionText}>{getCurrentQuestions()[currentQuestionIndex].question}</Text>
								<View style={styles.optionsContainer}>
									{getCurrentQuestions()[currentQuestionIndex].options.map((option, index) => (
										<TouchableOpacity
											key={index}
											style={getOptionStyle(option)}
											onPress={() => handleOptionSelect(option)}
											disabled={answerSubmitted}>
											<Text style={styles.optionText}>{option}</Text>
										</TouchableOpacity>
									))}
								</View>

								<TouchableOpacity
									style={[styles.submitButton, (!selectedOption || answerSubmitted) && styles.disabledButton]}
									onPress={handleSubmitAnswer}
									disabled={!selectedOption || answerSubmitted}>
									<Text style={styles.submitButtonText}>{answerSubmitted ? 'Next Question...' : 'Submit Answer'}</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
				</ScrollView>
			</LinearGradient>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	gradient: {
		flex: 1
	},
	scrollContent: {
		flexGrow: 1,
		padding: 20
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginTop: 20,
		marginBottom: 30
	},
	subtitle: {
		fontSize: 18,
		color: 'white',
		textAlign: 'center',
		marginBottom: 20
	},
	daysContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		marginBottom: 20
	},
	dayButton: {
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 10,
		margin: 8,
		minWidth: 140,
		alignItems: 'center'
	},
	dayButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	},
	quizContainer: {
		flex: 1
	},
	dayTitle: {
		fontSize: 22,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
		marginBottom: 20
	},
	progressContainer: {
		marginBottom: 20
	},
	progressText: {
		color: 'white',
		fontSize: 14,
		marginBottom: 5,
		textAlign: 'center'
	},
	progressBar: {
		height: 8,
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
		borderRadius: 4,
		overflow: 'hidden'
	},
	progressFill: {
		height: '100%',
		backgroundColor: '#50C878',
		borderRadius: 4
	},
	questionCard: {
		backgroundColor: 'white',
		borderRadius: 15,
		padding: 20,
		marginBottom: 20,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8
	},
	questionText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
		marginBottom: 20,
		textAlign: 'center'
	},
	optionsContainer: {
		marginBottom: 20
	},
	option: {
		backgroundColor: '#f0f0f0',
		padding: 15,
		borderRadius: 10,
		marginBottom: 10
	},
	selectedOption: {
		backgroundColor: '#d0d9ff',
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		borderWidth: 2,
		borderColor: '#3b5998'
	},
	correctOption: {
		backgroundColor: '#d4edda',
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		borderWidth: 2,
		borderColor: '#28a745'
	},
	incorrectOption: {
		backgroundColor: '#f8d7da',
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		borderWidth: 2,
		borderColor: '#dc3545'
	},
	optionText: {
		fontSize: 16,
		color: '#333'
	},
	submitButton: {
		backgroundColor: '#4c669f',
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: 'center'
	},
	disabledButton: {
		backgroundColor: '#9eb1db'
	},
	submitButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	},
	resultContainer: {
		backgroundColor: 'white',
		borderRadius: 15,
		padding: 25,
		alignItems: 'center',
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8
	},
	resultTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 20
	},
	resultScore: {
		fontSize: 20,
		fontWeight: '600',
		color: '#4c669f',
		marginBottom: 15
	},
	resultMessage: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		marginBottom: 30
	},
	startOverButton: {
		marginTop: 10,
		width: '100%'
	},
	startOverButton: {
		marginTop: 10,
		width: '100%'
	},
	backButton: {
		position: 'absolute',
		top: 10,
		left: 10,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		paddingVertical: 8,
		paddingHorizontal: 15,
		borderRadius: 8
	},
	backButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600'
	}
});

export default DailyQuiz;
