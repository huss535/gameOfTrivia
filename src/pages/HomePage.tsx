import Button from "../components/Button";

function HomePage() {

    return (
        <div>
            <h1>Game of trivia</h1>
            <Button buttonTitle="Join Game" eventHandler={() => { }} />
            <Button buttonTitle="Create Game" eventHandler={() => { }} />
            <div className="checkbox-container">
                <div className="checkBox">
                    <label >

                        <input type="checkbox" />
                        <span>Horror</span>

                    </label>
                </div>
            </div>

        </div>);
}

export default HomePage;