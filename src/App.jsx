import Navbar from "./components/home/Navbar";
import { Routes, Route } from "react-router-dom";

import Home from "./components/home/Home";
import Jobs from "./components/jobs/Jobs";
import Companies from "./components/companies/Companies";
import About from "./components/about/About";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;