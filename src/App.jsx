import Navbar from "./components/home/Navbar";
import { Routes, Route } from "react-router-dom";

import Home from "./components/home/Home";
import Jobs from "./components/jobs/Jobs";
import Companies from "./components/companies/Companies";
import About from "./components/about/About";
import Login from "./components/home/Login";
import Register from "./components/home/Register";
import Footer from "./components/home/Footer";
import Dashboard from "./components/user/Dashboard";
import Profile from "./components/user/Profile";
import UserLayout from "./components/user/UserLayout";
import AdminLayout from "./components/admin/AdminLayout";
import Analytics from "./components/admin/Analytics";
import ManageUsers from "./components/admin/ManageUsers";
import CvCollection from "./components/admin/CvCollection";

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
        <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Analytics />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="cv" element={<CvCollection />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  );
}

export default App;