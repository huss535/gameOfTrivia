import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors';
import * as admin from 'firebase-admin';
import path from 'path';

dotenv.config();
const credentialPath: string = process.env.KEYPATH || '';
const serviceAccount = require(path.resolve(credentialPath));

const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || " ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const credential = serviceAccount as admin.ServiceAccount;

admin.initializeApp({

    credential: admin.credential.cert(credential),
    databaseURL: 'https://gameoftrivia-e4359-default-rtdb.firebaseio.com'
});

const db = admin.database();



app.post('/newGame', async (req: Request, res: Response) => {
    try {
        // Fetch data from the database
        const snapshot = await db.ref('/').once('value');
        const data = snapshot.val();

        // Send data as response
        res.json(data);
    } catch (error) {
        // Handle errors
        const e = error as Error;

        res.status(500).send(`Error fetching data: ${e.message}`);
    }
});
// Endpoint that handles generating the questions through Gemini API
app.post("/fetchQuestions", async (req: Request, res: Response) => {
    const { topics } = req.body;
    const modelResponse: string = `[
    {
        "question": "When did women in the US gain the right to vote?",
        "answers": [
            "1920",
            "1945",
            "1890",
            "1900"
        ]
    },
    {
        "question": "Which famous suffragette was instrumental in the passage of the 19th Amendment?",
        "answers": [
            "Alice Paul",
            "Susan B. Anthony",
            "Elizabeth Cady Stanton",
            "Sojourner Truth"
        ]
    },
    {
        "question": "What is the name of the first woman to win a Nobel Prize?",
        "answers": [
            "Marie Curie",
            "Jane Austen",
            "Rosa Parks",
            "Eleanor Roosevelt"
        ]
    },
    {
        "question": "What is the term for a badminton shot hit under the shuttlecock?",
        "answers": [
            "Drop shot",
            "Smash",
            "Clear",
            "Net shot"
        ]
    },
    {
        "question": "In badminton, what is the maximum number of points a player can score in a single rally?",
        "answers": [
            "1",
            "2",
            "3",
            "4"
        ]
    },
    {
        "question": "Which country is widely considered the birthplace of badminton?",
        "answers": [
            "England",
            "India",
            "China",
            "Denmark"
        ]
    },
    {
        "question": "What is the term for a ghost that is said to be attached to a specific location?",
        "answers": [
            "Resident ghost",
            "Poltergeist",
            "Wraith",
            "Phantom"
        ]
    },
    {
        "question": "In ghost folklore, what is a 'banshee' believed to be?",
        "answers": [
            "A female spirit that warns of death",
            "A mischievous spirit that plays pranks",
            "A malevolent spirit that haunts people",
            "A shape-shifting spirit that can appear in various forms"
        ]
    },
    {
        "question": "What is the term for a ghost that is said to be the spirit of a person who died violently or tragically?",
        "answers": [
            "Vengeful spirit",
            "Haunted spirit",
            "Lost soul",
            "Restless spirit"
        ]
    },
    {
        "question": "In algebra, what is the name of the symbol used to represent an unknown quantity?",
        "answers": [
            "Variable",
            "Constant",
            "Coefficient",
            "Exponent"
        ]
    },
    {
        "question": "What is the mathematical term for a number that can be expressed as a fraction?",
        "answers": [
            "Rational number",
            "Irrational number",
            "Real number",
            "Imaginary number"
        ]
    },
    {
        "question": "What is the name of the process used to solve a system of linear equations?",
        "answers": [
            "Elimination method",
            "Substitution method",
            "Graphing method",
            "All of the above"
        ]
    },
    {
        "question": "What is the name of the first woman to win a Wimbledon singles title?",
        "answers": [
            "Suzanne Lenglen",
            "Billie Jean King",
            "Margaret Court",
            "Serena Williams"
        ]
    },
    {
        "question": "What is the name of the highest badminton competition?",
        "answers": [
            "Thomas & Uber Cup",
            "World Championships",
            "Olympic Games",
            "All of the above"
        ]
    },
    {
        "question": "Which famous female author wrote the novel 'Frankenstein'?",
        "answers": [
            "Mary Shelley",
            "Jane Austen",
            "Emily Brontë",
            "Charlotte Brontë"
        ]
    },
    {
        "question": "What is the name of the first woman to fly solo across the Atlantic Ocean?",
        "answers": [
            "Amelia Earhart",
            "Bessie Coleman",
            "Harriet Quimby",
            "Ruth Elder"
        ]
    },
    {
        "question": "What is the term for a ghost that is said to be a spirit that cannot find peace?",
        "answers": [
            "Lost soul",
            "Restless spirit",
            "Haunted spirit",
            "Vengeful spirit"
        ]
    },
    {
        "question": "In algebra, what is the name of the process used to simplify an algebraic expression?",
        "answers": [
            "Factoring",
            "Expansion",
            "Substitution",
            "All of the above"
        ]
    },
    {
        "question": "What is the name of the first woman to win the Nobel Prize in Economics?",
        "answers": [
            "Elinor Ostrom",
            "Amartya Sen",
            "Ronald Coase",
            "Friedrich Hayek"
        ]
    },
    {
        "question": "What is the term for a ghost that is said to be a spirit that is trapped in a particular location?",
        "answers": [
            "Bound spirit",
            "Haunted spirit",
            "Vengeful spirit",
            "Restless spirit"
        ]
    }
]`

    const prompt = `Please provide 20 trivia questions of moderate difficulty in JSON format (suitable for general knowledge quizzes) about: ${topics.categoryList}.

    Output the questions as a JSON array. Each object in the array should have two keys:
    * "question": the trivia question as a string
    * "answers": an array of exactly four strings, with the correct answer as the first element.
    
   model respnose would be something like this:
${modelResponse}
    
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
