import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Button from "../components/Button";
import { FaCopy } from "react-icons/fa";

function Lobby() {
    const location = useLocation();
    const sessionKey = location.state.sessionKey;
    const user = location.state.user;
    const [isCreator, setIsCreator] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [users, setUsers] = useState<string[]>([]);
    const [adminUser, setAdminUser] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        if (user === adminUser) {
            setIsCreator(true);
        }
    }, [user, adminUser]);

    useEffect(() => {
        axios.get(import.meta.env.VITE_BACKEND_SERVER + `/getUserByKey?sessionKey=${sessionKey}`)
            .then((response) => {
                setAdminUser(response.data.users[0]);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [sessionKey]);

    useEffect(() => {
        const newSocket = io("http://localhost:3080");

        newSocket.on("connect", () => {
            newSocket.emit("joinRoom", sessionKey, user);
        });

        newSocket.on("updateUserList", (updatedUsers: string[]) => {
            setUsers(updatedUsers);
        });

        newSocket.on("sessionStart", () => {
            navigate("/triviaPage", { state: { sessionKey, fetchedQuestions: null } });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [sessionKey, user, navigate]);


    if (!sessionKey) {
        return <div>Error: No session key provided.</div>;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(sessionKey);
    };



    const handleClick = () => {
        socket?.emit("gameStart", sessionKey);
        navigate("/triviaPage", { state: { sessionKey: sessionKey, fetchedQuestions: null } });
    };

    return (
        <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            <h1>Welcome, your access code is: <span style={{ color: "#517891" }}>{sessionKey}</span>
                <button style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'white' }} onClick={handleCopy}>
                    <FaCopy />
                </button><br />
                please use it to join your session</h1>
            <h2>Current players: </h2>

            <br />
            <div style={{
                height: '20%',
                gap: "20px",
                width: '30vw',
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignContent: "space-around",
                padding: '30px',
                borderRadius: '10px',
                color: 'white'
            }}>
                {users.length > 0 ? (
                    users.map((user, index) => (<div key={index}><span>{user}</span></div>))
                ) : (
                    <span>No players yet</span>
                )}
            </div>

            {isCreator ? <Button buttonTitle="Start Game" eventHandler={handleClick} /> : null}

        </div>
    );
}

export default Lobby;
