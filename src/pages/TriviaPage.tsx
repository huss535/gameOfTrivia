import { useEffect, useState } from "react";
import RadioButton from "../components/RadioButton";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import axios from "axios";

// Add shuffleElements function here
const shuffleElements = (array: string[]) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length; i > 1; i--) {
        const j = Math.floor(Math.random() * i);
        [shuffledArray[i - 1], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i - 1]];
    }
    return shuffledArray;
};

function QuestionContainer() {
    const navigate = useNavigate();
    const location = useLocation();
    const [fetchedQuestions, setFetchedQuestions] = useState(location.state?.fetchedQuestions);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [answerCounter, setAnswerCounter] = useState(0);
    const [index, setIndex] = useState(0);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState(["", "", "", ""]);
    const [progress, setProgress] = useState(0);
    const [isEnd, setIsEnd] = useState(false);

    const sessionKey = location.state.sessionKey;

    useEffect(() => {
        document.documentElement.style.setProperty('--progress', `${progress}%`);
    }, [progress]);

    const handleRadioChange = (value: string) => {
        setSelectedValue(value);
    };

    const handleClick = () => {
        if (selectedValue) {
            if (selectedValue === correctAnswer) {
                setAnswerCounter(prevValue => prevValue + 1);
            }
            setProgress(prevProgress => Math.min(prevProgress + 100 / fetchedQuestions.length, 100));
            setIndex(prevIndex => prevIndex + 1);
            setSelectedValue(null); // Reset selected value
        } else {
            alert("You did not choose anything yet.");
        }
    };

    useEffect(() => {
        if (sessionKey) {
            axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/getSessionByKey?sessionKey=${sessionKey}`)
                .then(response => {
                    setFetchedQuestions(JSON.parse(response.data.sessioninfo));
                })
                .catch(error => {
                    console.error('Failed to fetch session data:', error);
                });
        }
    }, [sessionKey]);

    useEffect(() => {
        if (fetchedQuestions) {
            if (index >= fetchedQuestions.length) {
                setIsEnd(true);
                return;
            }

            if (fetchedQuestions.length > 0 && index < fetchedQuestions.length) {
                const displayedAnswers = shuffleElements(fetchedQuestions[index].answers);
                setQuestion(fetchedQuestions[index].question);
                setAnswers(displayedAnswers);
                setCorrectAnswer(fetchedQuestions[index].answers[0]); // Adjust based on your data
            }
        }
    }, [index, fetchedQuestions]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100vh', margin: '30px' }}>
            {isEnd ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100vh', fontSize: '35px' }}>
                    <h1>Your score is: {answerCounter}/{fetchedQuestions.length}</h1>
                    <Button buttonTitle="Main Page" eventHandler={() => navigate("/")} />
                </div>
            ) : (
                <>
                    <div id="questionContainer">
                        <h1>{question}</h1>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: "40rem" }}>
                        {answers.map((answer, idx) => (
                            <RadioButton
                                key={idx}
                                isChecked={selectedValue === answer}
                                isCorrect={correctAnswer === answer}
                                radioText={answer}
                                handler={() => handleRadioChange(answer)}
                                disabled={selectedValue !== null}
                            />
                        ))}
                    </div>
                    <Button buttonTitle="Next" eventHandler={handleClick} />
                    <ProgressBar />
                </>
            )}
        </div>
    );
}

export default QuestionContainer;
