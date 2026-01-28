import Navbar from "./components/home/Navbar";
import { Routes, Route } from "react-router-dom";

import Home from "./components/home/Home";
import Jobs from "./components/jobs/Jobs";
import Companies from "./components/companies/Companies";
import About from "./components/about/About";
import Login from "./components/home/Login";
import Register from "./components/home/Register";
import Footer from "./components/home/Footer";

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;