import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../src/app/login';

describe('<LoginScreen />', () => {
	test('Text renders correctly on LoginScreen', () => {
		const { getByText } = render(<LoginScreen />);

		getByText('Welcome Back To SpeakEase!');
	});
});
