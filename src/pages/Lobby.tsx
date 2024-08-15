import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Button from "../components/Button";

function Lobby() {
    const location = useLocation();
    const sessionKey = location.state.sessionKey;
    const user = location.state.user;
    const [isCreator, setIsCreator] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [users, setUsers] = useState<string[]>([""]);

    useEffect(() => {
        if (user === users[0]) {
            setIsCreator(true)
        }

    }, [users]);


    useEffect(() => {
        axios.get(import.meta.env.VITE_BACKEND_SERVER + `/getUserByKey?sessionKey=${sessionKey}`)
            .then((response) => {
                setUsers(response.data.users);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [sessionKey]);

    useEffect(() => {
        // Establish a socket connection
        const newSocket = io("http://localhost:3080");
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log("connected to web socket");
            // Join the specific room based on sessionKey
            newSocket.emit('joinRoom', sessionKey);
        });

        // Listen for incoming 'joiningLobby' events
        newSocket.on("joiningLobby", (updatedUsers: string[]) => {
            setUsers(updatedUsers);
        });

        // Clean up the socket connection when the component unmounts
        /*    return () => {
               newSocket.disconnect();
           }; */
    }, [sessionKey]);

    if (!sessionKey) {
        return <div>Error: No session key provided.</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            <h1>Welcome, your access code is: <span style={{ color: "#517891" }}>{sessionKey}</span>,<br />
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
                    users.map((user, index) => (<div key={index}><span >{user}</span></div>))
                ) : (
                    <span>No players yet</span>
                )}
            </div>

            {isCreator ? <Button buttonTitle="Start Game" eventHandler={() => { }} /> : null}

        </div>
    );
}

export default Lobby;
