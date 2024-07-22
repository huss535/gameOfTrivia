
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import CreateNewGame from './pages/CreateNewGame';
import HomePage from './pages/HomePage';
import TriviaPage from './pages/TriviaPage';

function App() {

  return (
    <BrowserRouter>


      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/newGame/category" Component={CreateNewGame} />
        <Route path="/triviaPage" Component={TriviaPage} />


      </Routes>

    </BrowserRouter>
  );
}

export default App
