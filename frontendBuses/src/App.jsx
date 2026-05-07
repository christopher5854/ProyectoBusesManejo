import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./Context/UserContext";
import { Home } from './pages/Home';
import './App.css'

function App() {
  return (
    <div clasName="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element ={<>Pagina Inicio </>} />
            <Route path="*" element ={<>NOT FOUND </>} />
            <Route path= "/home" element ={<Home/>} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App
