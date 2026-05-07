
import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/home'
import Login from './pages/login'
import Form from './pages/form'
import { Toaster } from './components/ui/sonner'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<Form />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
