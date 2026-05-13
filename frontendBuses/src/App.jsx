import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./Context/UserContext";
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import './App.css'

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element ={<Home/>} />
            <Route path="*" element ={<>NOT FOUND </>} />
            <Route path= "/home" element ={<Home/>} />
            <Route path= "/login" element ={<Login/>} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App
