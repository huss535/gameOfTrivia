
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import CreateNewGame from './pages/CreateNewGame';
import HomePage from './pages/HomePage';

function App() {

  return (
    <BrowserRouter>


      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/newGame/category" Component={CreateNewGame} />


      </Routes>

    </BrowserRouter>
  );
}

export default App
