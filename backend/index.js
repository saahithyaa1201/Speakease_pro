import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.API_KEY
});

const app = express();
const server = createServer(app);

app.use(express.json());

const io = new Server(server, {
	cors: {
		origin: ['*']
	}
});

const getContext = topic => {
	return `
	You are an AI conversation partner helping non-native English speakers improve their speaking skills. 
	Use simple, clear English. Limit responses to around 150 words, but exceed if necessary. 
	Stick strictly to the topic introduced in the user's first prompt, do not deviate. 
	If the user gets stuck, provide hints to continue the conversation. 
	Keep the tone encouraging and engaging.
	Please deliver the response in plain text without any Markdown or formatting. Provide the output as raw text.
	User's Topic: ${topic}
`;
};

let context = getContext();

const feedback = `
You are an AI language coach providing feedback to help non-native English speakers improve their speaking skills. 
Analyze only the user's messages in the conversation. Provide constructive feedback within 200 words.  

1. Grammar & Sentence Structure – Highlight important grammatical errors and suggest corrections with explanations.  
2. Vocabulary & Word Choice – Identify words or phrases that could be improved or replaced with more natural expressions.  
3. Clarity & Fluency – Suggest ways to make sentences clearer, more natural, or more fluent.  
4. Encouragement & Progress – Acknowledge improvements and encourage continued practice.  

Keep feedback precise, supportive, and easy to understand. Use simple English and clear examples. 
Do not introduce new topics—only focus on errors and improvements based on the user's conversation.
Please deliver the response in plain text without any Markdown or formatting. Provide the output as raw text.
`;

app.post('/feedback', async (req, res) => {
	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [{ role: 'system', content: feedback }, ...req.body],
			store: false
		});
		res.send({ feedback: completion.choices[0].message.content });
	} catch (error) {
		res.status(500).send();
	}
});

const score = `You are an AI language coach assisting non-native English speakers to improve their language skills.
Analyze the user's messages in the conversation and provide a score for both grammar and vocabulary.
Focus only on the grammar and vocabulary used by the user in their messages. Evaluate the correctness and appropriateness of the grammar and word choices. 
Provide the scores as two numbers out of 5 for grammar and vocabulary, respectively as per Cambridge B2 standard.
Return the scores in JSON format, where 'grammar' represents the score for grammar and 'vocabulary' represents the score for vocabulary.
`;

app.post('/score', async (req, res) => {
	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [{ role: 'system', content: score }, ...req.body],
			store: false
		});
		res.send(completion.choices[0].message.content);
	} catch (error) {
		res.status(500).send();
	}
});

const quiz = `
You are an AI language coach assisting non-native English speakers to improve their language skills.
You need to generate English quizzes for non-native speakers to practice grammar and vocabulary, 
with a focus on topics that align with the Cambridge B2 standard.

The quizzes should cover specific grammar points (e.g., verb forms, tenses, subject-verb agreement, etc.) and 
vocabulary (e.g., word meanings, synonyms, antonyms, etc.). 

Each question should have four options with one correct answer, and you should return the quiz data in the following format:

question: The main question or prompt that tests grammar or vocabulary knowledge.
options: A list of four possible answers to choose from.
correctAnswer: The correct answer from the options.

The quizzes should be divided into the days of the week, with each day covering a different set of questions based on the following guidelines:

Weekdays (Monday to Friday) should cover basic to intermediate grammar and vocabulary topics. 
Each day should consist of 10 questions.
Weekend (Saturday and Sunday) should cover advanced grammar and vocabulary topics, 
with more challenging questions that require deeper understanding of the language.
The grammar topics should focus on areas such as verb tense usage (present, past, future, etc.), sentence structures (subject-verb agreement, conditionals, etc.), and article usage (definite, indefinite articles).
The vocabulary topics should focus on definitions, synonyms, antonyms, and word meanings in context.

Sample JSON:

{
  "weekdays": {
    "Monday": [
      {
        "question": "What is the correct form of the verb in this sentence: 'She _____ to the store yesterday.'",
        "options": ["go", "goes", "went", "going"],
        "correctAnswer": "went"
      },
    ],
    "Tuesday": [
      {
        "question": "Choose the correct sentence:",
        "options": ["I should of gone.", "I should have went.", "I should have gone.", "I should of went."],
        "correctAnswer": "I should have gone."
      },
    ],
    // Continue this format for other days (Wednesday to Friday)
  },
  "weekend": {
    "Saturday": [
      {
        "question": "Which sentence uses the subjunctive mood correctly?",
        "options": ["I wish I was taller.", "I wish I were taller.", "I wish I am taller.", "I wish I be taller."],
        "correctAnswer": "I wish I were taller."
      }
    ],
    "Sunday": [
      {
        "question": "Which of these words is an oxymoron?",
        "options": ["Happy days", "Deafening silence", "Blue sky", "Running water"],
        "correctAnswer": "Deafening silence"
      }
    ]
  }
}
`;

app.get('/quiz', async (req, res) => {
	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: quiz },
				{ role: 'user', content: 'Generate the quiz' }
			],
			store: false
		});
		console.log('response');
		res.send(completion.choices[0].message.content);
	} catch (error) {
		res.status(500).send();
	}
});

io.on('connection', socket => {
	socket.on('topic', topic => {
		context = getContext(topic);
	});

	socket.on('request', async history => {
		try {
			const completion = await openai.chat.completions.create({
				model: 'gpt-4o-mini',
				messages: [{ role: 'system', content: context }, ...history],
				store: false
			});

			socket.emit('reply', completion.choices[0].message.content);
		} catch (error) {
			socket.emit('reply', null);
		}
	});
});

server.listen(3000, () => {
	// console.log('server running at http://localhost:3000');
});
