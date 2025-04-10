import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

/*Topic selection as cards */
const ProgressByTopic = ({ topics }) => {
	return (
		<View style={styles.topicsContainer}>
			<Text style={styles.sectionTitle}>Topics</Text>
			<View style={styles.topicsGrid}>
				{topics.map((topic, index) => (
					<View key={index} style={styles.topicCard}>
						<View style={styles.topicHeader}>
							<Image
								source={{ uri: `https://picsum.photos/50?random=${index}` }} // random image for each topic
								style={styles.topicImage}
							/>
							<Text style={styles.topicText}>{topic.title}</Text>
						</View>
						<Text style={styles.progressText}>
							{topic.wordsSpoken}/{200} words
						</Text>
						<View style={styles.progressBarContainer}>
							<View style={[styles.progressBarFill, { width: `${(topic.wordsSpoken / 200) * 100}%` }]} />
						</View>
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	topicsContainer: { marginTop: 30, width: '100%' },
	sectionTitle: { fontSize: 22, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 10, color: '#1D4ED8' }, // Updated to blue
	topicsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
	topicCard: {
		width: '48%',
		backgroundColor: '#E3F2FD', // Updated to light blue
		borderRadius: 10,
		padding: 15,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3
	},
	topicHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
	topicImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
	topicItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginVertical: 10,
		backgroundColor: '#E3F2FD', // Updated to light blue
		padding: 15,
		borderRadius: 10
	},
	topicText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
	progressText: { fontSize: 14, color: '#666', marginBottom: 5 },
	progressBarContainer: { height: 5, backgroundColor: 'white', borderRadius: 5, overflow: 'hidden', marginBottom: 10 },
	progressBarFill: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 5 }, // Updated to blue
	progressContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%',
		marginBottom: 20
	}
});

export default ProgressByTopic;
