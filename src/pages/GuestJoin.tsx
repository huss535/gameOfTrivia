import { useState } from "react";
import Button from "../components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function GuestJoin() {
    const [sessionCode, setSessionCode] = useState("");
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    const handleClick = () => {
        if (sessionCode === "" || userName === "") {
            alert("Please fill out all info");
        } else {
            const params = {
                sessionKey: sessionCode,
                userName: userName,
            };

            axios.post(import.meta.env.VITE_BACKEND_SERVER + "/joinGame", params)
                .then((response) => {
                    if (response.data === "Session does not exist") {
                        alert("Session code invalid, session does not exist");
                    } else {
                        navigate("/lobby", { state: { sessionKey: sessionCode, user: userName } });
                    }
                })
                .catch((e) => {
                    console.error("Error joining the game:", e.message);
                    alert("An error occurred while trying to join the game. Please try again later.");
                });
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <label>
                <h1>Enter session code</h1>
            </label>
            <input
                className="text-input"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
            />

            <label>
                <h1>Enter your name</h1>
            </label>
            <input
                className="text-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />

            <Button buttonTitle="Start game" eventHandler={handleClick} />
        </div>
    );
}

export default GuestJoin;
