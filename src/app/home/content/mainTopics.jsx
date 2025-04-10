import React, { useEffect, useState } from 'react'; // Importing core React and hooks for component state and lifecycle
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native'; // UI components from React Native
import { useRouter } from 'expo-router'; // For navigation between screens in Expo
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons'; // Icon libraries for the UI
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods to fetch data

import { db } from '../../firebaseConfig'; // Firebase database instance from local config

const MainTopics = () => {
	const router = useRouter(); // Initialize the router for navigation
	const [topics, setTopics] = useState([]); // State to store the fetched topics
	const [loading, setLoading] = useState(true); // State to track loading status
	const [error, setError] = useState(null); // State to handle any errors during fetching

	// Function to fetch topics from Firestore database
	const fetchTopics = async () => {
		try {
			setLoading(true); // Set loading state to true before fetching
			const querySnapshot = await getDocs(collection(db, 'topics')); // Get all documents from 'topics' collection
			const topicsData = querySnapshot.docs.map(doc => ({
				id: doc.id, // Extract document ID
				...doc.data() // Spread all document fields
			}));
			setTopics(topicsData); // Update state with fetched data
		} catch (error) {
			console.error('Error fetching topics:', error); // Log error for debugging
			setError('Failed to load topics. Please try again later.'); // Set user-friendly error message
		} finally {
			setLoading(false); // Set loading to false regardless of success/failure
		}
	};

	// Use effect hook to fetch topics when component mounts
	useEffect(() => {
		fetchTopics(); // Call the fetch function
	}, []); // Empty dependency array means this runs once on mount

	// Helper function to return the correct icon component based on the icon name
	const getIcon = iconName => {
		switch (iconName) {
			case 'restaurant':
				return <MaterialIcons name='restaurant' size={24} color='black' /> // Food-related topics
			case 'location':
				return <Ionicons name='location-outline' size={24} color='black' /> // Location/travel topics
			case 'paw':
				return <FontAwesome name='paw' size={24} color='black' /> // Animal-related topics
			case 'hardware-chip':
				return <Ionicons name='hardware-chip-outline' size={24} color='black' />// Technology topics
			case 'leaf':
				return <Ionicons name='leaf' size={24} color='black' /> // Nature/environment topics
			case 'brush':
				return <MaterialIcons name='brush' size={24} color='black' /> // Art/creative topics
			case 'book':
				return <FontAwesome name='book' size={24} color='black' /> // Educational/literature topics
			case 'medkit':
				return <MaterialIcons name='medical-services' size={24} color='black' /> // Health/medical topics
			case 'people':
				return <Ionicons name='people-outline' size={24} color='black' /> // Social/community topics
			case 'school':
				return <MaterialIcons name='school' size={24} color='black' /> // Education topics
			case 'football':
				return <MaterialIcons name='sports-football' size={24} color='black' /> // Sports topics
			case 'cloudy':
				return <Ionicons name='cloud-outline' size={24} color='black' /> // Weather/climate topics
			case 'music':
				return <MaterialCommunityIcons name='music' size={24} color='black' /> // Music topics (Note: MaterialCommunityIcons is not imported!)
			case 'gift':
				return <FontAwesome name='gift' size={24} color='black' /> // Gift/celebration topics
			case 'happy':
				return <Ionicons name='happy-outline' size={24} color='black' /> // Entertainment/happiness topics
			case 'flask':
				return <FontAwesome name='flask' size={24} color='black' /> // Science topics
			default:
				return <Ionicons name='help-circle-outline' size={24} color='black' /> // Default icon for unknown types
		}
	};

	// Render function for each topic item in the list
	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={[styles.topicContainer, { backgroundColor: item.backgroundColor || '#F0F0F0' }]} // Apply custom background color or default
			onPress={() =>
				router.push({
					pathname: '/home/content/subTopics', // Navigate to subtopics screen
					params: { topicId: item.id, mainTopic: item.topic } // Pass topic ID and name as parameters
				})
			}>
			<View style={styles.contentContainer}>
				<View style={styles.iconContainer}>{getIcon(item.icon)}</View> 
				<View style={styles.textContainer}>
					<Text style={styles.topicTitle}>{item.topic}</Text> 
					<Text style={styles.topicDescription}>{item.description}</Text> 
				</View>
			</View>
			{item.image ? (
				<Image source={{ uri: item.image }} style={styles.topicImage} /> 
			) : (
				// Fallback UI when no image is available
				<View style={[styles.topicImage, styles.placeholderImage]}>
					<MaterialIcons name='image-not-supported' size={32} color='#AAA' />
				</View>
			)}
		</TouchableOpacity>
	);

	// Loading state UI
	if (loading) {
		return (
			<View style={styles.loaderContainer}>
				<ActivityIndicator size='large' color='#0000ff' /> 
				<Text style={styles.loadingText}>Loading topics...</Text> 
			</View>
		);
	}

	// Error state UI
	if (error) {
		return (
			<View style={styles.errorContainer}>
				<MaterialIcons name='error-outline' size={48} color='red' /> 
				<Text style={styles.errorText}>{error}</Text>
				<TouchableOpacity style={styles.retryButton} onPress={fetchTopics}>
					<Text style={styles.retryButtonText}>Retry</Text>
				</TouchableOpacity>
			</View>
		);
	}

	// Main render function with topics grid
	return (
		<View style={styles.container}>
			{topics.length === 0 ? (
				// Display message when no topics are available
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>No topics available</Text>
				</View>
			) : (
				// Render topics in a grid layout using FlatList
				<FlatList
					data={topics} // Data source for the list
					renderItem={renderItem} // Function to render each item
					keyExtractor={item => item.id} // Unique key for each item
					numColumns={2} // Display in 2 columns (grid layout)
					columnWrapperStyle={styles.columnWrapper} // Style for each row in the grid
					contentContainerStyle={styles.listContainer} // Style for the entire list container
					style={{ marginTop: 35 }} // Additional margin at top
					showsVerticalScrollIndicator={false} // Hide scrollbar for cleaner UI
				/>
			)}
		</View>
	);
};

// Styles for the component using StyleSheet for better performance
const styles = StyleSheet.create({
	container: {
		flex: 1, // Take up all available space
		padding: 16, // Add padding around the edges
		backgroundColor: '#F5F5F5' // Light gray background
	},
	loaderContainer: {
		flex: 1, // Take up all available space
		justifyContent: 'center', // Center content vertically
		alignItems: 'center', // Center content horizontally
		backgroundColor: '#F5F5F5' // Match main background
	},
	loadingText: {
		marginTop: 10, // Space above the text
		fontSize: 16, // Text size
		color: '#333' // Dark gray text
	},
	errorContainer: {
		flex: 1, // Take up all available space
		justifyContent: 'center', // Center content vertically
		alignItems: 'center', // Center content horizontally
		backgroundColor: '#F5F5F5', // Match main background
		padding: 20 // More padding for error state
	},
	errorText: {
		marginTop: 10, // Space above text
		fontSize: 16, // Text size
		color: '#333', // Dark gray text
		textAlign: 'center' // Center align text
	},
	retryButton: {
		marginTop: 20, // Space above button
		paddingVertical: 10, // Vertical padding inside button
		paddingHorizontal: 20, // Horizontal padding inside button
		backgroundColor: '#007BFF', // Blue button
		borderRadius: 8 // Rounded corners
	},
	retryButtonText: {
		color: '#FFF', // White text
		fontSize: 16, // Text size
		fontWeight: 'bold' // Bold text
	},
	emptyContainer: {
		flex: 1, // Take up all available space
		justifyContent: 'center', // Center content vertically
		alignItems: 'center' // Center content horizontally
	},
	emptyText: {
		fontSize: 16, // Text size
		color: '#666' // Medium gray text
	},
	listContainer: {
		paddingBottom: 16 // Add padding at bottom of list
	},
	columnWrapper: {
		justifyContent: 'space-between' // Distribute items evenly in row
	},
	topicContainer: {
		padding: 16, // Internal padding
		borderRadius: 8, // Rounded corners
		marginBottom: 16, // Space below each item
		elevation: 3, // Android shadow
		shadowColor: '#000', // iOS shadow color
		shadowOffset: { width: 0, height: 2 }, // iOS shadow direction
		shadowOpacity: 0.1, // iOS shadow opacity
		shadowRadius: 4, // iOS shadow blur radius
		width: '48%', // Take up slightly less than half the screen width
		alignItems: 'center' // Center content horizontally
	},
	contentContainer: {
		flexDirection: 'row', // Arrange items horizontally
		alignItems: 'flex-start', // Align items to top
		width: '100%', // Use full container width
		marginBottom: 8 // Space below content
	},
	iconContainer: {
		marginRight: 8, // Space to the right of icon
		alignSelf: 'flex-start' // Align to top
	},
	textContainer: {
		flex: 1 // Take up remaining space
	},
	topicImage: {
		width: '100%', // Use full container width
		height: 100, // Fixed height
		borderRadius: 8 // Rounded corners
	},
	placeholderImage: {
		backgroundColor: '#E0E0E0', // Light gray background
		justifyContent: 'center', // Center content vertically
		alignItems: 'center' // Center content horizontally
	},
	topicTitle: {
		fontSize: 16, // Text size
		fontWeight: 'bold', // Bold text
		marginBottom: 4 // Space below title
	},
	topicDescription: {
		fontSize: 12, // Smaller text size
		color: '#555' // Medium gray text
	}
});

export default MainTopics; // Export the component for use in other files