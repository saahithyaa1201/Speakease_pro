import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const router = useRouter();

	const validateEmail = email => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	};

	const handleLogin = () => {
		Keyboard.dismiss();

		// Reset previous errors
		setEmailError('');
		setPasswordError('');

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

		// TODO: Implement login logic
		console.log('Login attempt:', email);
		const auth = getAuth();
		signInWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				// Signed up
				const user = userCredential.user;
				// console.log('User signed up:', user);
			})
			.catch(error => {
				console.log(error);
			});
	};

	const navigateToSignup = () => {
		router.navigate('/signup');
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome Back To SpeakEase</Text>

			{/* Email Input */}
			<View>
				<TextInput
					style={[styles.input, emailError && styles.inputError]}
					placeholder='Enter your Email'
					value={email}
					onChangeText={setEmail}
					keyboardType='email-address'
					autoCapitalize='none'
					placeholderTextColor='black'
				/>
				{emailError && <Text style={styles.errorText}>{emailError}</Text>}
			</View>

			{/* Password Input */}
			<View style={styles.passwordContainer}>
				<TextInput
					style={[styles.passwordInput, passwordError && styles.inputError]}
					placeholder='Enter your password'
					value={password}
					onChangeText={setPassword}
					secureTextEntry={!showPassword}
					placeholderTextColor='black'
				/>
				<TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
					<Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color='gray' />
				</TouchableOpacity>
			</View>
			{passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

			{/* Forgot Password */}
			<TouchableOpacity style={styles.forgotPassword}>
				<Text>Forgot Password?</Text>
			</TouchableOpacity>

			{/* Login Button */}
			<TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
				<Text style={styles.loginButtonText}>Login</Text>
			</TouchableOpacity>

			{/* Signup Link */}
			<TouchableOpacity onPress={navigateToSignup}>
				<Text style={styles.signupText}>
					Don't have an account? <Text style={styles.signupBoldText}>Sign up</Text>
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
		backgroundColor: 'white'
	},
	title: {
		fontSize: 30,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center'
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
		borderColor: 'red'
	},
	errorText: {
		color: 'red',
		marginBottom: 10,
		marginLeft: 10,
		fontSize: 12
	},
	forgotPassword: {
		alignSelf: 'flex-end',
		marginBottom: 15
	},
	loginButton: {
		backgroundColor: 'black',
		padding: 15,
		borderRadius: 8,
		alignItems: 'center'
	},
	loginButtonText: {
		color: 'white',
		fontWeight: 'bold'
	},
	signupText: {
		textAlign: 'center',
		marginTop: 15
	},
	signupBoldText: {
		fontWeight: 'bold',
		color: 'black'
	}
});

export default LoginScreen;
