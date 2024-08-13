
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import CreateNewGame from './pages/CreateNewGame';
import HomePage from './pages/HomePage';
import TriviaPage from './pages/TriviaPage';
import HostGameCreate from './pages/HostGameCreate';
import Lobby from './pages/Lobby';
import GuestJoin from './pages/GuestJoin';

function App() {

  return (
    <BrowserRouter>


      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/newGame/category" Component={CreateNewGame} />
        <Route path="/triviaPage" Component={TriviaPage} />
        <Route path="/hostingGame" Component={HostGameCreate} />
        <Route path="/lobby" Component={Lobby} />
        <Route path='/guestJoin' Component={GuestJoin} />


      </Routes>

    </BrowserRouter>
  );
}

export default App
