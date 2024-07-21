import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";


dotenv.config();
const port = 3000;
const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || " ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});

//endpoint that handles generating the questions through Gemini API
app.post("/fetchQuestions", async (req: Request, res: Response) => {
    const { topics } = req.body;
    // console.log(topics["categoryList"])
    const prompt = `Please provide 20 fun trivia question of moderate difficulty about:${topics["categoryList"]} \n provide the questions followed by four answers of which only one is true the rmaining three are false \n Here is a sample for what the response should be: (What is the capital of Egypt-Cairo-paris-london-alexandria, and the following qestions follow the same form)`

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);
    res.send(text)

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
