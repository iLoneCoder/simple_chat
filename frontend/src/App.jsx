import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Main from './pages/Main'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route path='/' element={<Main />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
