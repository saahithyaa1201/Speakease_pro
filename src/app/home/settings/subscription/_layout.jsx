import { Stack } from 'expo-router';

export default function SubscriptionLayout() {
	return (
		<Stack>
			<Stack.Screen name='index' options={{ headerShown: false }} />
			<Stack.Screen name='coupon' options={{ headerShown: false }} />
		</Stack>
	);
}
