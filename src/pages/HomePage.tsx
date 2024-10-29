import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function HomePage() {
    const navigate = useNavigate()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100vh' }}>
            <h1 id="mainHeader" >
                Game of Trivia
            </h1>

            <div>
                {/*   <Button buttonTitle="Join Game" eventHandler={() => { navigate("/guestJoin") }} /> */}
                <Button buttonTitle="Create Game" eventHandler={() => { navigate("/newGame/category") }} />

            </div>


        </div>);
}

export default HomePage;