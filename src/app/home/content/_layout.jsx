import { Stack } from 'expo-router';

export default function ContentLayout() {
	return (
		<Stack>
			<Stack.Screen name='mainTopics' options={{ headerShown: false }} />
			<Stack.Screen name='subTopics' options={{ headerShown: false }} />
			<Stack.Screen name='examTopics' options={{ headerShown: false }} />
			<Stack.Screen name='conversation' options={{ headerShown: false }} />
		</Stack>
	);
}
