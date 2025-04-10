import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signOut } from 'firebase/auth';
import { router } from 'expo-router';

const SettingsScreen = () => {
    const onEditProfilePress = () => {
        router.navigate('/home/settings/editprofile');
    };

	const settingsOptions = [
		{ title: 'Edit Profile', icon: 'person', screen: 'EditProfile', color: '#4A90E2' },
		{ title: 'My Subscription', icon: 'subscriptions', screen: 'subscription', color: '#50C878' },
		{ title: 'Help & Support', icon: 'help', screen: 'HelpSupportScreen', color: '#9370DB' },
		{ title: 'Terms & Policies', icon: 'policy', screen: 'policies', color: '#FF8C00' }
	];

    const onLogOutPress = () => {
        const auth = getAuth();
        signOut(auth);
    };

	const handleOptionPress = (item) => {
		if (item.onPress) {
			item.onPress();
		} else {
			router.navigate(`/home/settings/${item.screen}`);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Settings</Text>

			<View style={styles.optionsContainer}>
				{settingsOptions.map((item, index) => (
					<TouchableOpacity
						key={index}
						style={styles.option}
						onPress={() => handleOptionPress(item)}>
						<View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
							<Icon name={item.icon} size={22} color={item.color} />
						</View>
						<Text style={styles.optionText}>{item.title}</Text>
						<Icon name='chevron-right' size={20} color='#999' />
					</TouchableOpacity>
				))}
			</View>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogOutPress}>
                <LinearGradient colors={['#FF6B6B', '#FF3B30']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.logoutGradient}>
                    <Icon name='logout' size={20} color='#fff' style={styles.logoutIcon} />
                    <Text style={styles.logoutText}>Logout</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 20
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginBottom: 24,
        marginTop: 50
    },
    optionsContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        padding: 8,
        marginBottom: 30
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginVertical: 4
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        flex: 1
    },
    logoutButton: {
        marginTop: 16,
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4
    },
    logoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16
    },
    logoutIcon: {
        marginRight: 10
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff'
    }
});

export default SettingsScreen;