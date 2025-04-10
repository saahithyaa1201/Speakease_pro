import { Tabs } from 'expo-router';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';

const TabLayout = () => {
	return (
		<Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
			<Tabs.Screen
				name='content'
				options={{
					headerShown: false,
					title: 'Home',
					tabBarIcon: ({ color }) => <FontAwesome size={28} name='home' color={color} />
				}}
			/>
			<Tabs.Screen
				name='progress'
				options={{
					headerShown: false,
					title: 'Progress',
					tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name='progress-star' color={color} />
				}}
			/>

			<Tabs.Screen
				name='dailyQuiz'
				options={{
					headerShown: false,
					title: 'Daily Quiz',
					tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name='clipboard-text' color={color} />
				}}
			/>
			<Tabs.Screen
				name='settings'
				options={{
					headerShown: false,
					title: 'Settings',
					tabBarIcon: ({ color }) => <Feather size={28} name='settings' color={color} />
				}}
			/>

			<Tabs.Screen
				name='goals'
				options={{
					headerShown: false,
					title: 'Goals',
					tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name='target' color={color} />
				}}
			/>

		</Tabs>
	);
};

export default TabLayout;
