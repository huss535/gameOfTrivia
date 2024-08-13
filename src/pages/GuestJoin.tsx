import Button from "../components/Button";

function GuestJoin() {
    return (<div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        {/*   <h1>Your name for this game is {sessionData.users[0]}</h1>
    <h1>Others can join your session using this code: {sessionData.sessionKey}</h1> */}
        { }

        <label><h1>Enter session code</h1></label>
        <input className="text-input" onChange={(e) => { }} />

        <label><h1>Enter a name</h1></label>
        <input className="text-input" onChange={(e) => { }} />

        <Button buttonTitle="Start game" eventHandler={() => { }} />
    </div>);
}

export default GuestJoin;
