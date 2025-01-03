import logo from './logo.svg';
import './App.css';
import { useEffect } from "react"

import { BrowserRouter, Routes, Route } from "react-router"
import Main from './pages/Main';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}/>
        
        <Route path="/" element={<ProtectedRoute />}>
          <Route path='/' element={<Main />} />
        </Route>
      </Routes>
  
    </BrowserRouter>
  );
}

export default App;
