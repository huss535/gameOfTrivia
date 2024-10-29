import axios from "axios";
import Button from "../components/Button";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

function HostGameCreate() {
    const [userName, setUserName] = useState("")
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const topics = location.state;
    console.log(topics);

    const handleClick = (buttonTitle: string, event: React.MouseEvent<HTMLButtonElement>) => {

        const params = { userName: userName, topics: { categoryList: topics.toString() } };
        setLoading(true);
        axios.post(import.meta.env.VITE_BACKEND_SERVER + "/newGame", params).then((response) => {
            const fetchedQuestions = response.data;
            console.log(fetchedQuestions)
            navigate("/lobby", { state: { sessionKey: fetchedQuestions.sessionKey, userName: userName } })

        }).catch((error) => {
            alert(error);
        })
            .finally(() => {
                setLoading(false);
            });
    }

    //const sessionData = location.state?.fetchedQuestions;


    return (
        loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <TailSpin height="80" width="80" color="#00BFFF" ariaLabel="loading" />
                <h2>Fetching your questions</h2>
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                {/*   <h1>Your name for this game is {sessionData.users[0]}</h1>
            <h1>Others can join your session using this code: {sessionData.sessionKey}</h1> */}
                { }
                <label><h1>Enter your name</h1></label>
                <input className="text-input" onChange={(e) => { setUserName(e.target.value) }} />
                <Button buttonTitle="Start game" eventHandler={handleClick} />
            </div>

        )



    );

}

export default HostGameCreate;