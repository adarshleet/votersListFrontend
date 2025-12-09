import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import VoterList from "./pages/VoterList/VoterList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/voters" element={<VoterList />} />


      </Routes>
    </BrowserRouter>
  );
}
