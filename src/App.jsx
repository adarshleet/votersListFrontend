import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import VoterList from "./pages/VoterList/VoterList";
import PoliticalStatus from "./pages/PoliticalStatus/PoliticalStatus";
import VotingStatus from "./pages/VotingStatus/VotingStatus";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/voters" element={<VoterList />} />
        <Route path="/politicalStatus" element={<PoliticalStatus />} />
        <Route path="/votingStatus" element={<VotingStatus />} />


      </Routes>
    </BrowserRouter>
  );
}
