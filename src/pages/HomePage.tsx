import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function HomePage() {
    const navigate = useNavigate()
    return (
        <div>
            <h1>Game of trivia</h1>
            <Button buttonTitle="Join Game" eventHandler={() => { navigate("/") }} />
            <Button buttonTitle="Create Game" eventHandler={() => { navigate("/newGame/category") }} />


        </div>);
}

export default HomePage;