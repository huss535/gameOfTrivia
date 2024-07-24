import { useState } from "react";
import RadioButton from "../components/RadioButton";

function QuestionContainer() {
    const [selectedValue, setSelectedValue] = useState('');

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    };

    return (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100vh' }}>
        <div id="questionContainer">

            <h1>What is your name ?</h1>

        </div >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <RadioButton isCorrect={true} radioText="Eric" handler={handleRadioChange} />
            <RadioButton isCorrect={false} radioText="Osama" handler={handleRadioChange} />
            <RadioButton isCorrect={false} radioText="Jay-z" handler={handleRadioChange} />
            <RadioButton isCorrect={false} radioText="Rakim Stapelton" handler={handleRadioChange} />
        </div>

    </div>);
}

function TriviaPage() {

    return (<QuestionContainer />
    );
}

export default TriviaPage;