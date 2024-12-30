import logo from './logo.svg';
import './App.css';
import { useEffect } from "react"

import { BrowserRouter, Routes, Route } from "react-router"
import Main from './pages/Main';
import Login from './pages/Login';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/' element={<Main />} />
      </Routes>
  
    </BrowserRouter>
  );
}

export default App;
