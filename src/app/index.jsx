import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const WelcomeScreen = () => {
	// Get the navigation object from expo-router
	const router = useRouter();

	// Handler for the Login button press
	const handleLoginPress = () => {
		// Navigate to the LoginScreen when pressed
		router.navigate('/login');
	};

	// Handler for the Sign Up button press
	const handleSignUpPress = () => {
		// Navigate to the SignupScreen when pressed
		router.navigate('/signup');
	};

	const authStateChange = () => {
		const auth = getAuth();
		onAuthStateChanged(auth, user => {
			if (user) {
				router.navigate('/home');
			} else {
				router.navigate('/');
			}
		});
	};

	useEffect(() => {
		authStateChange();
	}, []);

	return (
		// SafeAreaView ensures content is displayed within the safe area boundaries of the device
		<SafeAreaView style={styles.container}>
			<View style={styles.contentContainer}>
				

				{/* Main welcome heading */}
				<Text style={styles.title1}>Welcome to</Text>
				<Text style={styles.title2}>SpeakEase</Text>

				{/* App logo - make sure the path to the image is correct */}
				<Image source={require('../../assets/images/speakease-logo.jpg')} style={styles.image} resizeMode='contain' />

				{/* App description text */}
				<Text style={styles.description1}>Speak with confidence, learn with ease.</Text>
				<Text style={styles.description2}>Your journey to fluent English starts now!</Text>

				{/* Container for the login and signup buttons */}
				<View style={styles.buttonContainer}>
					{/* Login button - styled with black background and white text */}
					<TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
						<Text style={styles.loginButtonText}>Login</Text>
					</TouchableOpacity>

					{/* Sign Up button - styled as an outline button with black border */}
					<TouchableOpacity style={styles.signUpButton} onPress={handleSignUpPress}>
						<Text style={styles.signUpButtonText}>Sign Up</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

// Styles for the component
const styles = StyleSheet.create({
	// Main container that fills the entire screen with white background
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
	},
	// Content container that centers all elements and adds horizontal padding
	contentContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24
	},
	// Style for the app logo image
	image: {
		width: 300,
		height: 300,
		
	},
	// Style for the main welcome title text
	title1: {
		fontSize: 38,
		fontWeight: 'bold',
		color: '#000000',
		textAlign: 'center',
		
	},

	title2: {
		fontSize: 30,
		fontWeight: 'bold',
		color: '#000000',
		textAlign: 'center',
		marginBottom: 16
	},
	// Style for the app description text
	description1: {
		fontSize: 16,
		color: '#555555',
		textAlign: 'center',
		marginBottom: 1,
		lineHeight: 24
	},
	description2: {
		fontSize: 16,
		color: '#555555',
		textAlign: 'center',
		marginBottom: 48,
		lineHeight: 24
	},
	// Container for both buttons that sets width and spacing
	buttonContainer: {
		width: '100%',
		gap: 16 // Space between the buttons
	},
	// Style for the Login button - black background with white text
	loginButton: {
		backgroundColor: '#000000',
		borderRadius: 8,
		paddingVertical: 16,
		width: '100%',
		alignItems: 'center'
	},
	// Style for the Login button text
	loginButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold'
	},
	// Style for the Sign Up button - white background with black border
	signUpButton: {
		backgroundColor: '#FFFFFF',
		borderColor: '#000000',
		borderWidth: 1,
		borderRadius: 8,
		paddingVertical: 16,
		width: '100%',
		alignItems: 'center'
	},
	// Style for the Sign Up button text
	signUpButtonText: {
		color: '#000000',
		fontSize: 16,
		fontWeight: 'bold'
	}
});

export default WelcomeScreen;
