import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors';

dotenv.config();
const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || " ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});

// Endpoint that handles generating the questions through Gemini API
app.post("/fetchQuestions", async (req: Request, res: Response) => {
    const { topics } = req.body;

    const prompt = `Please provide 20 trivia questions of moderate difficulty in JSON format (suitable for general knowledge quizzes) about: ${topics.categoryList}.

    Output the questions as a JSON array. Each object in the array should have two keys:
    * "question": the trivia question as a string
    * "answers": an array of exactly four strings, with the correct answer as the first element.
    
    Example:
    [
      {"question": "What is the capital of Egypt?", "answers": ["Cairo", "Paris", "London", "Alexandria"]}
      // ... more questions
    ]
    
    Important:
    1. Each JSON object should be properly closed with a brace '}'.
    2. Each array of answers should be properly closed with a square bracket ']'.
    3. Separate each JSON object with a comma.
    4. The JSON output should not include any additional characters or text outside of the array.
    5. Ensure there are no trailing commas in the JSON objects or arrays.
    6. The JSON output must be syntactically correct and valid for parsing using JSON.parse().
    7. Each question object must have exactly four answers.
    8. Do not place a comma after the last object generated
    
    Please only output the JSON array as specified without any additional text or characters.`;



    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    try {
        // Ensure the response is in the correct format
        const parsedData = JSON.parse(responseText);
        res.json(parsedData);
    } catch (error) {
        console.log(responseText);
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate questions or parse the response.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
