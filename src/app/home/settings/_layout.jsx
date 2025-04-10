import { Stack } from 'expo-router';

export default function SettingsLayout() {
	return (
		<Stack>
			<Stack.Screen name='index' options={{ headerShown: false }} />
			<Stack.Screen name='policies' options={{ headerShown: false }} />
			<Stack.Screen name='EditProfile' options={{ headerShown: false }} />
			<Stack.Screen name='HelpSupportScreen' options={{ headerShown: false }} />
			<Stack.Screen name='subscription' options={{ headerShown: false }} />
		</Stack>
	);
}
