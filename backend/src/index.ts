import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors';
import postgres from 'postgres';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';


dotenv.config();
const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());

//Websocket
const server = createServer();
const io = new Server(server, {
    cors: {
        origin: '*', // Your frontend URL
        methods: ['GET', 'POST']
    }
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || " ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
io.on('connection', (socket) => {
    console.log('A new client connected');

    // Emit a custom event to the connected client
    socket.emit('welcome', { message: 'Welcome to the server!' });
});




interface triviaQuestion {
    question: string,
    answers: string[]
}
interface gameSession {
    sessionKey: string;
    sessionInfo: triviaQuestion[];
    users: string[];
    isActive: boolean;



}


// Database credentials
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
PGPASSWORD = decodeURIComponent(PGPASSWORD || " ");

const sql = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    },
});


async function generateQuestions(topics: any) {
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
    return responseText

}

app.get("/", async (req: Request, res: Response) => {

    const result = await sql`SELECT * from gamesessions`;
    res.json(result);

})


app.post('/joinGame', async (req: Request, res: Response) => {
    const { sessionKey, userName } = req.body;

    try {
        // Fetch the current list of users
        const result = await sql`SELECT users FROM gamesessions WHERE sessionkey = ${sessionKey}`;
        const users: string[] = result[0]?.users || [];

        // Check if the user is already in the list
        if (users.includes(userName)) {
            console.log("User already added");
            const sessionInfo = await sql`SELECT * FROM gamesessions WHERE sessionkey = ${sessionKey}`;

            return res.json(sessionInfo);
        }


        // Add the new user to the list
        const newUsers = [...users, userName];
        // Update the game session with the new user
        await sql`UPDATE gamesessions SET users = ${sql.array(newUsers)} WHERE sessionkey = ${sessionKey}`;
        const sessionInfo = await sql`SELECT * FROM gamesessions WHERE sessionkey = ${sessionKey}`;

        //for updating user joining game in real time
        //io.emit("joiningLobby", { userName })
        io.to(sessionKey).emit("joiningLobby", newUsers);

        console.log("User added to game session");
        res.json(sessionInfo);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("An error occurred while joining the game");
    }


});
io.on('connection', (socket) => {
    socket.on('joinRoom', (sessionKey) => {
        socket.join(sessionKey);
        console.log(`User joined room: ${sessionKey}`);
    });
});

app.get("/getSessionByKey", async (req: Request, res: Response) => {

    const sessionKey: string = req.query.sessionKey as string;
    try {
        const result = await sql`SELECT * from gamesessions WHERE sessionKey= ${sessionKey}`;
        res.json(result)
    } catch (e: any) {

        res.status(500).send(e.message)
    }


})

app.get("/getUserByKey", async (req: Request, res: Response) => {

    const sessionKey: string = req.query.sessionKey as string;
    try {
        const result = await sql`SELECT users from gamesessions WHERE sessionKey= ${sessionKey}`;
        res.json(result[0])
    } catch (e: any) {

        res.status(500).send(e.message)
    }


})


//endpoint to define new games and add them to database
app.post('/newGame', async (req: Request, res: Response) => {
    const { topics, userName } = req.body;

    let sessionString: string = uuidv4();
    sessionString = sessionString.slice(0, 8);
    const existingSessions = await sql`SELECT 1 FROM gamesessions WHERE sessionkey = ${sessionString}`;


    try {
        const responseText: string = await generateQuestions(topics);

        // Ensure the response is in the correct format
        const parsedData = JSON.parse(responseText);
        let newGameSession: gameSession = {
            sessionKey: sessionString,
            sessionInfo: parsedData,
            users: [userName],
            isActive: true
        };

        await sql`
        INSERT INTO gamesessions (sessionkey, sessioninfo, users, isactive) 
        VALUES (
            ${newGameSession.sessionKey}, 
            ${JSON.stringify(newGameSession.sessionInfo)}, 
            ${newGameSession.users}, 
            ${newGameSession.isActive}
        )
    `;

        console.log("Successful");

        // Send data as response
        res.status(201).json(newGameSession);

    } catch (error: any) {
        console.error('Error:', error);

        // Handle different types of errors
        if (error instanceof SyntaxError) {
            res.status(500).json({ error: 'Failed to parse response.' });
        } else if (error.message.includes('fetch data')) {
            res.status(500).json({ error: `Error fetching data: ${error.message}` });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    }
});

// Endpoint that handles generating the questions through Gemini API
app.post("/fetchQuestions", async (req: Request, res: Response) => {
    const { topics } = req.body;
    const responseText: string = await generateQuestions(topics)
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
server.listen(3080, () => {
    console.log('WebSocket server running on http://localhost:3080');
});