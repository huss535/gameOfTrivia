import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors';

dotenv.config();
const port = 3000;
const app = express();
app.use(express.json());
app.use(cors())
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || " ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});

//endpoint that handles generating the questions through Gemini API
app.post("/fetchQuestions", async (req: Request, res: Response) => {
    const { topics } = req.body;
    // console.log(topics["categoryList"])
    const prompt = `Please provide 20 trivia questions of moderate difficulty in JSON format (suitable for general knowledge quizzes) about: ${topics.categoryList}

Output the questions as a JSON array. Each object in the array should have two keys:
* "question": the trivia question as a string
* "answers": an array of strings containing the four answer options, with the correct answer as the first element

Example:
{ questions:[
  {"question": "What is the capital of Egypt?", "answers": ["Cairo", "Paris", "London", "Alexandria"]},
  // ... more questions]
} Please only send the JSON object in the proper format without any other characters as to not cause errors, this data will be processed in a backend server
 I will be processing this information using JSON.parse() method in typescript make sure to generate a json text that does not cause any errors.
`;


    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = JSON.parse(response.text());
    //console.log(text);
    //console.log(text)
    res.send(text)

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
