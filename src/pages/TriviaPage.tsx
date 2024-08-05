import { useEffect, useState } from "react";
import RadioButton from "../components/RadioButton";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";

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
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [answerCounter, setAnswerCounter] = useState(0);
    const [index, setIndex] = useState(0);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [answers, setAnswers] = useState(["", "", "", ""]);
    const location = useLocation();
    const fetchedQuestions = location.state?.fetchedQuestions || [];
    const [progress, setProgress] = useState(0);
    console.log(fetchedQuestions)
    useEffect(() => {
        document.documentElement.style.setProperty('--progress', `${progress}%`);
    }, [progress]);

    const handleRadioChange = (value: string) => {
        setSelectedValue(value);
    };

    const handleClick = () => {
        if (selectedValue) {
            // Check if the selected answer is correct
            if (selectedValue === correctAnswer) {
                setAnswerCounter(previousValue => previousValue + 1);
            }
            setProgress((previousProgress) => Math.min(previousProgress + 100 / fetchedQuestions.length, 100));
            setIndex(prevIndex => prevIndex + 1);
            setSelectedValue(null); // Reset selected value
        } else {
            alert("You did not choose anything yet.");
        }
    };

    useEffect(() => {
        if (fetchedQuestions.length > 0 && index < fetchedQuestions.length) {
            let displayedAnswers = shuffleElements(fetchedQuestions[index].answers);
            setAnswers(displayedAnswers);
            setCorrectAnswer(fetchedQuestions[index].answers[0]); // Adjust based on your data
        }
    }, [index, fetchedQuestions]);

    if (index >= fetchedQuestions.length) {
        return <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100vh', fontSize: '35px' }}>
            <p>
                Your score is: {answerCounter}/{fetchedQuestions.length}
            </p>
            <Button buttonTitle="Return to main page" eventHandler={() => { navigate("/") }} />
        </div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100vh', margin: '30px' }}>
            <div id="questionContainer">
                <h1>{fetchedQuestions[index].question}</h1>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
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
        </div>
    );
}

export default QuestionContainer;
