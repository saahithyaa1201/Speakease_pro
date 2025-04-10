import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Firebase Authentication imports
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// Firebase Firestore imports for database operations
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const SignupScreen = () => {
	// State variables for form inputs
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// State variables for validation errors
	const [usernameError, setUsernameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');

	// State for password visibility toggle
	const [showPassword, setShowPassword] = useState(false);

	// Router for navigation between screens
	const router = useRouter();

	const validateEmail = email => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	};

	const setUserDataAfterSignup = async (uid, userData = {}) => {
		// Get Firestore instance
		const db = getFirestore();
		// Create reference to user document in "users" collection
		const userRef = doc(db, 'users', uid);

		// Define default user data structure with app-specific fields
		const defaultUserData = {
			uid: uid,
			userName: userData.userName || username,
			name: userData.name || '',
			proficiencyLevel: userData.proficiencyLevel || 'beginner',
			lessonsCompleted: userData.lessonsCompleted || [],
			currentLevel: userData.currentLevel || 1,
			initialLevel: userData.initialLevel || 1,
			subscribedPlan: userData.subscribedPlan || 'free',
			subscriptionInfo: userData.subscriptionInfo || {
				dateOfSubscription: null,
				plan: 'free',
				amountPaid: 0,
				expiry: null,
				dataRelatedToPayment: {}
			},
			profileImageURL: userData.profileImageURL || '',
			lastLogin: new Date().toISOString()
		};

		// Write to Firestore with merge option to preserve existing data
		return setDoc(userRef, defaultUserData, { merge: true })
			.then(() => {
				console.log('User data successfully written to Firestore!');
				return defaultUserData;
			})
			.catch(error => {
				console.error('Error writing user data to Firestore: ', error);
				throw error; // Re-throw to be caught by the calling function
			});
	};

	/**
	 * Handles the signup process including validation and Firebase operations
	 */
	const handleSignup = () => {
		// Hide keyboard after submit
		Keyboard.dismiss();

		// Reset all previous error messages
		setUsernameError('');
		setEmailError('');
		setPasswordError('');

		// Validate username
		if (!username) {
			setUsernameError('Username is required');
			return;
		}
		if (username.length < 3) {
			setUsernameError('Username must be at least 3 characters');
			return;
		}

		// Validate email
		if (!email) {
			setEmailError('Email is required');
			return;
		}
		if (!validateEmail(email)) {
			setEmailError('Invalid email format');
			return;
		}

		// Validate password
		if (!password) {
			setPasswordError('Password is required');
			return;
		}
		if (password.length < 6) {
			setPasswordError('Password must be at least 6 characters');
			return;
		}

		// Proceed with Firebase Authentication
		console.log('Signup attempt:', email);
		const auth = getAuth();
		createUserWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				// User successfully created in Firebase Authentication
				const user = userCredential.user;

				// Now create the user's profile in Firestore database
				return setUserDataAfterSignup(user.uid, {
					userName: username,
					name: '',
					profileImageURL: ''
				});
			})
			.then(() => {
				// Both authentication and database operations succeeded
				console.log('User created and data stored successfully');
				// Navigate to login screen
				router.push('/login');
			})
			.catch(error => {
				// Handle authentication or database errors
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(error);

				// Display user-friendly error messages based on error codes
				if (errorCode === 'auth/email-already-in-use') {
					setEmailError('Email is already in use');
				} else if (errorCode === 'auth/weak-password') {
					setPasswordError('Password is too weak');
				} else {
					// Fallback for other errors
					setEmailError(errorMessage);
				}
			});
	};

	/**
	 * Navigates to the login screen
	 */
	const navigateToLogin = () => {
		router.navigate('/login');
	};

	// UI Rendering
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Sign Up</Text>
			<Text style={styles.subtitle}>Join us to improve your English</Text>

			{/* Username Input */}
			<View>
				<TextInput
					style={[styles.input, usernameError && styles.inputError]}
					placeholder='Enter your username'
					value={username}
					onChangeText={setUsername}
					autoCapitalize='none'
          placeholderTextColor='black'
				/>
				{usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
			</View>

			{/* Email Input */}
			<View>
				<TextInput
					style={[styles.input, emailError && styles.inputError]}
					placeholder='Enter your email'
					value={email}
					onChangeText={setEmail}
					keyboardType='email-address'
					autoCapitalize='none'
					placeholderTextColor='black'
				/>
				{emailError && <Text style={styles.errorText}>{emailError}</Text>}
			</View>

			{/* Password Input with Show/Hide Toggle */}
			<View style={styles.passwordContainer}>
				<TextInput
					style={[styles.passwordInput, passwordError && styles.inputError]}
					placeholder='Enter your password'
					value={password}
					onChangeText={setPassword}
					secureTextEntry={!showPassword} // Toggle password visibility
					placeholderTextColor='black'
				/>
				<TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
					<Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color='gray' />
				</TouchableOpacity>
			</View>
			{passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

			{/* Signup Button */}
			<TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
				<Text style={styles.signupButtonText}>Sign Up</Text>
			</TouchableOpacity>

			{/* Login Link for existing users */}
			<TouchableOpacity onPress={navigateToLogin}>
				<Text style={styles.loginText}>
					Already have an account? <Text style={styles.loginBoldText}>Login</Text>
				</Text>
			</TouchableOpacity>
		</View>
	);
};

// Styles for the component
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
		backgroundColor: 'white'
	},
	title: {
		fontSize: 40,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 8
	},
	subtitle: {
		fontSize: 18,
		color: '#666',
		textAlign: 'center',
		fontStyle: 'italic',
		marginBottom: 30
	},
	input: {
		height: 50,
		borderColor: 'gray',
		borderWidth: 1,
		marginBottom: 10,
		paddingHorizontal: 10,
		borderRadius: 8
	},
	passwordContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	passwordInput: {
		flex: 1,
		height: 50,
		borderColor: 'gray',
		borderWidth: 1,
		paddingHorizontal: 10,
		borderRadius: 8
	},
	eyeIcon: {
		position: 'absolute',
		right: 10
	},
	inputError: {
		borderColor: 'red' // Highlight input fields with errors
	},
	errorText: {
		color: 'red',
		marginBottom: 10,
		marginLeft: 10,
		fontSize: 12
	},
	signupButton: {
		backgroundColor: 'black',
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 20
	},
	signupButtonText: {
		color: 'white',
		fontWeight: 'bold'
	},
	loginText: {
		textAlign: 'center',
		marginTop: 15
	},
	loginBoldText: {
		fontWeight: 'bold',
		color: 'black'
	}
});

export default SignupScreen;
