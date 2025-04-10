//words required based on each level
export const levelWordRequired = { Beginner: 50, Intermediate: 100, Advanced: 150 };

export const topics = [
	'Food',
	'Places',
	'Pets',
	'Technology',
	'Nature',
	'Hobbies',
	'Books',
	'Health',
	'Family',
	'Education',
	'Sports',
	'Weather',
	'Entertainment',
	'Celebration',
	'Emotions',
	'Science'
].map(title => ({ title, wordsRequired: 100, wordsSpoken: 50, completed: false }));
