import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";

function Lobby() {
    const location = useLocation();
    const sessionKey = location.state.sessionKey;
    const [socket, setSocket] = useState<Socket | null>(null);
    const [users, setUsers] = useState<string[]>([""]);

    useEffect(() => {
        /* axios.get(import.meta.env.VITE_BACKEND_SERVER + `/getUserByKey?sessionKey=${sessionKey}`).then((response) => {

            setUsers((previousList) => [response.data.users]);
        }).catch((error) => {
            console.log(error)
        }); */

        setUsers(["Andrew", "Jackson", "Aron", "same", "jack", "dcjndknvsi"])


    }, [])
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

                gap: '30px',
                width: '20vw',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center', /* Centers items in each row */
                alignContent: 'center',
                padding: '30px',
                borderRadius: '10px',
                color: 'white'
            }}>
                {users.length > 0 ? (
                    users.map((user) => <span key={user}>{user}</span>)
                ) : (
                    <span>No players yet</span>
                )}
            </div>

        </div>
    );
}

export default Lobby;
