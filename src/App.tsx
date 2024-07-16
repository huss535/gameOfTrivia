
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import CreateNewGame from './pages/CreateNewGame';

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
