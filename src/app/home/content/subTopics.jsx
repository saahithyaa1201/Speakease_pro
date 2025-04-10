/**
 * SubTopics.js - A React Native component for displaying educational subtopics
 *
 * This component provides a user interface for:
 * 1. Selecting difficulty levels (beginner, intermediate, advanced)
 * 2. Viewing subtopics organized by these levels in expandable accordions
 * 3. Navigating to specific subtopic content
 *
 * The component uses Firebase Firestore to fetch data and Expo Router for navigation.
 * It includes responsive design elements and animations for a polished user experience.
 */

import React, { useState, useEffect } from 'react'; // Core React functionality and hooks
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	Dimensions,
	Alert,
	Platform,
	Animated
} from 'react-native'; // UI primitives from React Native
import { useRouter, useLocalSearchParams } from 'expo-router'; // Navigation tools from Expo
import { MaterialIcons } from '@expo/vector-icons'; // Icon set for UI elements
import { db } from '../../firebaseConfig'; // Firebase database reference
import { collection, query, where, getDocs } from 'firebase/firestore'; // Firestore database query utilities

const { width } = Dimensions.get('window'); // Get screen width for responsive layouts

/**
 * Color theme definitions for different difficulty levels
 * Each level has a cohesive color palette with primary, secondary, and tertiary colors
 * This helps visually distinguish content by difficulty level
 */
const levelThemes = {
	beginner: {
		primary: '#4158D0',
		secondary: '#C850C0',
		tertiary: '#FFCC70',
		lightBg: '#EFF6FF',
		icon: 'school'
	},
	intermediate: {
		primary: '#0093E9',
		secondary: '#80D0C7',
		tertiary: '#33D9DE',
		lightBg: '#ECFEFF',
		icon: 'trending-up'
	},
	advanced: {
		primary: '#8E2DE2',
		secondary: '#4A00E0',
		tertiary: '#7F53EB',
		lightBg: '#F5F3FF',
		icon: 'star'
	}
};

/**
 * Define the available difficulty levels with their display names and icons
 * Used to populate the level selection buttons
 */
const levels = [
	{ id: 'beginner', name: 'Beginner', icon: levelThemes.beginner.icon },
	{ id: 'intermediate', name: 'Intermediate', icon: levelThemes.intermediate.icon },
	{ id: 'advanced', name: 'Advanced', icon: levelThemes.advanced.icon }
];

/**
 * SubTopics - Main component for subtopic browsing and selection
 * Manages level selection, data fetching, and UI state management
 */
const SubTopics = () => {
	const router = useRouter(); // Initialize router for screen navigation
	const { topicId, mainTopic } = useLocalSearchParams(); // Extract parameters from URL

	// State management
	const [selectedLevels, setSelectedLevels] = useState([]); // Track which difficulty levels are selected
	const [subtopics, setSubtopics] = useState([]); // Store fetched subtopics from Firestore
	const [loading, setLoading] = useState(false); // Track data loading state
	const [error, setError] = useState(null); // Track error states during data fetching

	// Animation state for subtopic cards - creates scale effect when pressed
	const [scaleAnims] = useState(() => subtopics.map(() => new Animated.Value(1)));

	// Track expanded/collapsed state for each difficulty level accordion
	const [accordionStates, setAccordionStates] = useState({
		beginner: false,
		intermediate: false,
		advanced: false
	});

	// Animation values for smooth accordion expansion/collapse effects
	const [accordionAnims] = useState({
		beginner: new Animated.Value(0),
		intermediate: new Animated.Value(0),
		advanced: new Animated.Value(0)
	});

	/**
	 * Toggle selection of a difficulty level
	 * Allows multi-select with a maximum of 3 levels
	 * @param {string} levelId - The ID of the level to toggle
	 */
	const toggleLevel = levelId => {
		setSelectedLevels(
			current =>
				current.includes(levelId)
					? current.filter(id => id !== levelId) // Remove if already selected
					: current.length < 3
						? [...current, levelId] // Add if we have less than 3 selected
						: current // Don't change if already have 3 selected
		);
	};

	/**
	 * Toggle accordion expansion for a specific level
	 * Controls both the state and animation of the accordion
	 * @param {string} levelId - The ID of the level accordion to toggle
	 */
	const toggleAccordion = levelId => {
		const isExpanded = !accordionStates[levelId];
		setAccordionStates(prev => ({
			...prev,
			[levelId]: isExpanded
		}));

		// Animate the accordion expansion/collapse with smooth transition
		Animated.timing(accordionAnims[levelId], {
			toValue: isExpanded ? 1 : 0, // Target value based on expanded state
			duration: 300, // Animation duration in milliseconds
			useNativeDriver: false // Height animations can't use native driver
		}).start();
	};

	/**
	 * Fetch subtopics from Firestore based on selected levels and current topic
	 * Updates subtopics state with filtered data from the database
	 */
	const fetchSubtopics = async () => {
		// Input validation - ensure we have necessary data before querying
		if (selectedLevels.length === 0 || !topicId) {
			console.warn('Missing topicId or no levels selected');
			return;
		}

		try {
			setLoading(true); // Show loading indicator during fetch
			setError(null); // Clear any previous errors

			// Convert topicId to number for exact type matching in Firestore query
			const numericTopicId = Number(topicId);

			// Create a Firestore query that filters subtopics by topic ID and selected difficulty levels
			const subtopicsRef = collection(db, 'subtopic');
			const q = query(subtopicsRef, where('topicId', '==', numericTopicId), where('level', 'in', selectedLevels));

			// Execute the query and process results
			const querySnapshot = await getDocs(q);
			const fetchedSubtopics = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}));

			setSubtopics(fetchedSubtopics); // Update state with fetched data
		} catch (err) {
			// Handle errors during data fetching
			setError(err.message || 'Failed to load subtopics');
		} finally {
			setLoading(false); // Hide loading indicator when finished
		}
	};

	/**
	 * Effect hook to fetch subtopics when selected levels or topic changes
	 * Automatically triggers data refresh when dependencies change
	 */
	useEffect(() => {
		if (selectedLevels.length > 0 && topicId) {
			fetchSubtopics();
		} else {
			setSubtopics([]); // Clear subtopics if no levels selected
		}
	}, [selectedLevels, topicId]); // Re-run when these dependencies change

	/**
	 * Helper function to get theme colors based on difficulty level
	 * @param {string} level - The level ID to get theme for
	 * @returns {Object} Theme color object for the specified level
	 */
	const getLevelTheme = level => {
		return levelThemes[level] || levelThemes.beginner; // Default to beginner theme if not found
	};

	/**
	 * Handle subtopic card press - navigate to conversation screen with topic details
	 * @param {number} index - Index of the card in the list
	 * @param {Object} subtopic - Subtopic data object
	 */
	const onCardPress = (index, subtopic) => {
		// Navigate to the conversation screen with topic information
		router.push({
			pathname: '/home/content/conversation',
			params: {
				topic: subtopic.description,
				title: subtopic.title,
				mainTopic
			}
		});

		// Note: Animation code is commented out but would create a press effect
		// Animated.sequence([
		// 	Animated.timing(scaleAnims[index], {
		// 		toValue: 0.95,
		// 		duration: 100,
		// 		useNativeDriver: true
		// 	}),
		// 	Animated.timing(scaleAnims[index], {
		// 		toValue: 1,
		// 		duration: 100,
		// 		useNativeDriver: true
		// 	})
		// ]).start(() => {});
	};

	/**
	 * Helper function to filter subtopics by difficulty level
	 * @param {string} level - The level ID to filter by
	 * @returns {Array} Filtered array of subtopics matching the level
	 */
	const getSubtopicsByLevel = level => {
		return subtopics.filter(subtopic => subtopic.level === level);
	};

	return (
		<View style={styles.container}>
			{/* Decorative background elements for visual enhancement */}
			<View style={styles.decorativeCircle1} />
			<View style={styles.decorativeCircle2} />

			{/* Main screen title */}
			<Text style={styles.mainTitle}>Explore Your Learning Journey</Text>

			{/* Level selection section with multi-select capability */}
			<View style={styles.levelContainer}>
				<Text style={styles.sectionTitle}>
					Select Levels <Text style={styles.subtitle}>(Choose up to 3)</Text>
				</Text>
				<View style={styles.levelsGrid}>
					{levels.map(level => {
						const isSelected = selectedLevels.includes(level.id);
						const theme = getLevelTheme(level.id);
						return (
							<TouchableOpacity
								key={level.id}
								style={[
									styles.levelButton,
									isSelected
										? {
												backgroundColor: theme.primary,
												backgroundImage: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
											}
										: {
												backgroundColor: 'white',
												borderWidth: 2,
												borderColor: theme.lightBg
											}
								]}
								onPress={() => toggleLevel(level.id)}
								activeOpacity={0.8}>
								<View
									style={[
										styles.iconContainer,
										{
											backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : theme.lightBg,
											borderColor: isSelected ? 'rgba(255,255,255,0.5)' : theme.primary + '30'
										}
									]}>
									<MaterialIcons name={level.icon} size={26} color={isSelected ? 'white' : theme.primary} />
								</View>
								<Text style={[styles.levelButtonText, { color: isSelected ? 'white' : theme.primary }]}>{level.name}</Text>
								{isSelected && (
									<View style={styles.selectedIndicator}>
										<MaterialIcons name='check-circle' size={20} color='white' />
									</View>
								)}
							</TouchableOpacity>
						);
					})}
				</View>
			</View>

			{/* Scrollable content area for subtopics with different states (loading, error, empty) */}
			<ScrollView
				style={styles.subtopicsContainer}
				contentContainerStyle={styles.subtopicsContentContainer}
				showsVerticalScrollIndicator={false}>
				{loading ? (
					// Loading state UI with activity indicator while fetching data
					<View style={styles.loadingContainer}>
						<View style={styles.loaderCard}>
							<ActivityIndicator size='large' color='#8B5CF6' />
							<Text style={styles.loadingText}>Loading your learning path...</Text>
						</View>
					</View>
				) : error ? (
					// Error state UI with retry option when fetch fails
					<View style={styles.errorContainer}>
						<View style={styles.errorCard}>
							<MaterialIcons name='error-outline' size={50} color='#f87171' />
							<Text style={styles.errorTitle}>Oops!</Text>
							<Text style={styles.errorText}>{error}</Text>
							<TouchableOpacity style={styles.retryButton} onPress={fetchSubtopics}>
								<Text style={styles.retryButtonText}>Try Again</Text>
							</TouchableOpacity>
						</View>
					</View>
				) : subtopics.length === 0 ? (
					// Empty state UI with appropriate message based on selection state
					<View style={styles.emptyContainer}>
						<View style={styles.emptyCard}>
							<MaterialIcons name='import-contacts' size={60} color='#94a3b8' />
							<Text style={styles.emptyTitle}>{selectedLevels.length === 0 ? 'Select a Level' : 'No Subtopics Found'}</Text>
							<Text style={styles.emptyText}>
								{selectedLevels.length === 0
									? 'Choose one or more difficulty levels to see available subtopics'
									: 'Try selecting different difficulty levels'}
							</Text>
						</View>
					</View>
				) : (
					// Accordion for each level with subtopics - dynamically rendered based on selection
					levels.map(level => {
						const levelSubtopics = getSubtopicsByLevel(level.id);
						const isSelected = selectedLevels.includes(level.id);
						const theme = getLevelTheme(level.id);

						// Skip rendering if level isn't selected or has no subtopics
						if (!isSelected || levelSubtopics.length === 0) return null;

						const isExpanded = accordionStates[level.id];
						// Calculate dynamic height for accordion animation based on content
						const accordionHeight = accordionAnims[level.id].interpolate({
							inputRange: [0, 1],
							outputRange: [0, levelSubtopics.length * 250] // Approximate height per card
						});

						return (
							<View key={level.id} style={styles.accordionContainer}>
								{/* Accordion header - shows level name and can be clicked to expand/collapse */}
								<TouchableOpacity
									style={[
										styles.accordionHeader,
										{
											backgroundColor: theme.primary,
											backgroundImage: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
										}
									]}
									onPress={() => toggleAccordion(level.id)}
									activeOpacity={0.9}>
									<View style={styles.accordionTitleContainer}>
										<MaterialIcons name={theme.icon} size={22} color='white' style={styles.headerIcon} />
										<Text style={styles.accordionTitle}>{level.name}</Text>
										<View style={styles.countBadge}>
											<Text style={styles.countBadgeText}>{levelSubtopics.length}</Text>
										</View>
									</View>
									<MaterialIcons name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color='white' />
								</TouchableOpacity>

								{/* Animated accordion content - height changes based on expanded state */}
								<Animated.View
									style={[
										styles.accordionContent,
										{
											height: accordionHeight,
											overflow: 'hidden'
										}
									]}>
									<View style={styles.accordionContentInner}>
										{/* Render each subtopic as a card with topic information */}
										{levelSubtopics.map((subtopic, index) => (
											<Animated.View key={subtopic.id} style={[{ transform: [{ scale: scaleAnims[index] || 1 }] }]}>
												<TouchableOpacity style={styles.subtopicItem} activeOpacity={0.9}>
													<View style={styles.contentContainer}>
														<View
															style={[
																styles.subtopicIconContainer,
																{
																	backgroundColor: theme.lightBg,
																	borderColor: theme.primary + '30'
																}
															]}>
															<MaterialIcons name='book' size={28} color={theme.primary} />
														</View>

														<View style={styles.textContainer}>
															<Text style={styles.subtopicTitle}>{subtopic.title}</Text>
															<Text style={styles.subtopicDescription}>{subtopic.description}</Text>
														</View>
													</View>

													<View style={styles.subtopicFooter}>
														<View style={styles.divider} />

														<TouchableOpacity
															onPress={() => onCardPress(index, subtopic)}
															style={[
																styles.startButton,
																{
																	backgroundColor: theme.primary,
																	backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`
																}
															]}>
															<Text style={styles.startButtonText}>Begin Learning</Text>
															<MaterialIcons name='arrow-forward' size={16} color='white' />
														</TouchableOpacity>
													</View>
												</TouchableOpacity>
											</Animated.View>
										))}
									</View>
								</Animated.View>
							</View>
						);
					})
				)}
			</ScrollView>
		</View>
	);
};

/**
 * StyleSheet for the component
 * Uses React Native's StyleSheet for optimal performance
 * Styles are organized by component section for better readability
 */
const styles = StyleSheet.create({
	container: {
		flex: 1, // Take up full available space
		padding: 20, // Internal padding
		backgroundColor: '#fafafa', // Light background color
		position: 'relative', // For absolute positioned decorative elements
		overflow: 'hidden' // Prevent decorative elements from bleeding outside
	},
	// Decorative background elements for visual appeal
	decorativeCircle1: {
		position: 'absolute', // Position independently of normal flow
		width: 300,
		height: 300,
		borderRadius: 150, // Make it circular
		backgroundColor: 'rgba(168, 85, 247, 0.08)', // Transparent purple
		top: -150, // Position partly off-screen
		right: -80
	},
	decorativeCircle2: {
		position: 'absolute',
		width: 200,
		height: 200,
		borderRadius: 100,
		backgroundColor: 'rgba(59, 130, 246, 0.06)', // Transparent blue
		bottom: -40,
		left: -60
	},
	mainTitle: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#1e293b', // Dark blue-gray
		marginTop: 25,
		marginBottom: 30,
		textAlign: 'center',
		textShadowColor: 'rgba(0, 0, 0, 0.05)', // Subtle text shadow for depth
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 16,
		color: '#334155' // Dark gray-blue
	},
	subtitle: {
		fontSize: 14,
		fontWeight: 'normal',
		color: '#64748b' // Medium gray-blue
	},
	levelContainer: {
		marginBottom: 28 // Space below level selection section
	},
	levelsGrid: {
		flexDirection: 'row',
		justifyContent: 'space-between' // Distribute level buttons evenly
	},
	levelButton: {
		alignItems: 'center',
		padding: 14,
		borderRadius: 20,
		width: width * 0.3 - 4, // Responsive width - 30% of screen minus small margin
		elevation: 4, // Android shadow
		shadowColor: '#000', // iOS shadow properties
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		position: 'relative' // For absolute positioned indicator
	},
	iconContainer: {
		width: 56,
		height: 56,
		borderRadius: 28, // Circular container
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
		borderWidth: 1 // Subtle border
	},
	levelButtonText: {
		fontSize: 14,
		fontWeight: '600' // Semi-bold
	},
	selectedIndicator: {
		position: 'absolute',
		top: 8,
		right: 8 // Positioned in top-right corner
	},
	subtopicsContainer: {
		flex: 1 // Take remaining space
	},
	subtopicsContentContainer: {
		paddingBottom: 16 // Add padding at bottom of scrollable content
	},
	// Accordion styles for collapsible sections
	accordionContainer: {
		marginBottom: 16,
		borderRadius: 24, // Rounded corners
		backgroundColor: 'white',
		overflow: 'hidden', // Keep content within rounded borders
		elevation: 5, // Android shadow
		shadowColor: '#000', // iOS shadow
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8
	},
	accordionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		paddingHorizontal: 20
	},
	accordionTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	accordionTitle: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18
	},
	headerIcon: {
		marginRight: 10 // Space between icon and title
	},
	accordionContent: {
		backgroundColor: 'white'
	},
	accordionContentInner: {
		padding: 16,
		paddingTop: 8
	},
	subtopicItem: {
		marginBottom: 16,
		borderRadius: 20,
		backgroundColor: 'white',
		overflow: 'hidden',
		elevation: 2, // Subtle shadow for depth
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		borderWidth: 1,
		borderColor: '#e2e8f0' // Light border
	},
	contentContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16
	},
	subtopicIconContainer: {
		width: 64,
		height: 64,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
		borderWidth: 1
	},
	textContainer: {
		flex: 1 // Take up remaining space
	},
	subtopicTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1e293b',
		marginBottom: 6
	},
	subtopicDescription: {
		fontSize: 14,
		color: '#64748b',
		lineHeight: 20 // Better text readability
	},
	subtopicFooter: {
		padding: 16,
		paddingTop: 0,
		alignItems: 'flex-end' // Align button to right
	},
	divider: {
		height: 1, // Thin line
		backgroundColor: '#e2e8f0', // Light gray
		width: '100%',
		marginBottom: 16
	},
	startButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 16,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4
	},
	startButtonText: {
		color: 'white',
		fontWeight: 'bold',
		marginRight: 8 // Space between text and icon
	},
	countBadge: {
		backgroundColor: 'rgba(255,255,255,0.3)', // Semi-transparent white
		borderRadius: 12,
		paddingVertical: 2,
		paddingHorizontal: 8,
		marginLeft: 10
	},
	countBadgeText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 14
	},
	// Loading state styles
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: 300 // Minimum height to prevent layout shift
	},
	loaderCard: {
		backgroundColor: 'white',
		borderRadius: 24,
		padding: 30,
		alignItems: 'center',
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.1,
		shadowRadius: 6
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: '#64748b',
		fontWeight: '500'
	},
	// Error state styles
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: 300
	},
	errorCard: {
		backgroundColor: 'white',
		borderRadius: 24,
		padding: 30,
		alignItems: 'center',
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		width: '100%'
	},
	errorTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#ef4444', // Red color for error
		marginTop: 10,
		marginBottom: 8
	},
	errorText: {
		fontSize: 16,
		color: '#64748b',
		textAlign: 'center',
		marginBottom: 20
	},
	retryButton: {
		backgroundColor: '#8b5cf6', // Purple
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 16,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4
	},
	retryButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold'
	},
	// Empty state styles when no subtopics available
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: 300
	},
	emptyCard: {
		backgroundColor: 'white',
		borderRadius: 24,
		padding: 30,
		alignItems: 'center',
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		width: '100%'
	},
	emptyTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#475569', // Dark gray-blue
		marginTop: 16,
		marginBottom: 8
	},
	emptyText: {
		fontSize: 16,
		color: '#94a3b8', // Light gray-blue
		textAlign: 'center'
	}
});

export default SubTopics; // Export component for use in navigation
