function QuestionContainer() {


    return (<div>
        <div id="questionContainer">

            <h1>What is your name ?</h1>

        </div >
        <div>
            <label>
                <input type="radio" name="answers" value="Answer1" />
                <span>Answer1</span>
            </label>
            <label>
                <input type="radio" name="answers" value="Answer2" />
                <span>Answer2</span>
            </label>
        </div>

    </div>);
}

function TriviaPage() {

    return (<QuestionContainer />
    );
}

export default TriviaPage;