import { useEffect, useState } from "react";
import RadioButton from "../components/RadioButton";
import { useLocation } from "react-router-dom";
import Button from "../components/Button";

const shuffleElements = (array: string[]) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length; i > 1; i--) {
        const j = Math.floor(Math.random() * i);
        [shuffledArray[i - 1], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i - 1]];
    }
    return shuffledArray;
};

function QuestionContainer() {
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [index, setIndex] = useState(0);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [answers, setAnswers] = useState(["", "", "", ""]);
    const location = useLocation();
    const fetchedQuestions = location.state?.fetchedQuestions || [];

    const handleRadioChange = (value: string, isCorrect: boolean) => {

        setSelectedValue(value); // Update selected value


    };

    const handleClick = () => {
        setIndex(prevIndex => prevIndex + 1);

    }

    useEffect(() => {
        if (fetchedQuestions.length > 0 && index < fetchedQuestions.length) {
            let displayedAnswers = shuffleElements(fetchedQuestions[index].answers);
            setAnswers(displayedAnswers);
            setCorrectAnswer(fetchedQuestions[index].answers[0]); // Adjust based on your data
            setSelectedValue(null); // Reset selected value

        }
    }, [index, fetchedQuestions]);

    if (index >= fetchedQuestions.length) {
        return <div>No more questions.</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100vh' }}>
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
                        handler={handleRadioChange}
                        disabled={selectedValue !== null}
                    />
                ))}
            </div>

            <Button buttonTitle="Next" eventHandler={handleClick} />
        </div>
    );
}

export default QuestionContainer;
