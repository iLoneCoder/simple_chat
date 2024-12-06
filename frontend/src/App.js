import logo from './logo.svg';
import './App.css';
import { useEffect } from "react"

import { BrowserRouter, Routes, Route } from "react-router"
import Main from './pages/Main';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
      </Routes>
  
    </BrowserRouter>
  );
}

export default App;
