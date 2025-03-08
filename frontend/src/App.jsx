import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/" element={<h1>Chat</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
