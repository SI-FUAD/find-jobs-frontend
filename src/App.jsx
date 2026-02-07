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
import CompanyLogin from "./components/companies/CompanyLogin";
import CompanyRegister from "./components/companies/CompanyRegister";
import CompanyLayout from "./components/companies/CompanyLayout";
import CompanyDashboard from "./components/companies/CompanyDashboard";
import AddJobPost from "./components/companies/AddJobPost";
import ManageJobPosts from "./components/companies/ManageJobPosts";
import EditJobPost from "./components/companies/EditJobPost";
import ViewJobPost from "./components/companies/ViewJobPost";

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
        <Route path="/profile" element={<Profile />} /></Route>
        <Route path="/admin" element={<AdminLayout />}>
        <Route path="analytics" element={<Analytics />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="cv-collections" element={<CvCollection />} /></Route>
        <Route path="/company/login" element={<CompanyLogin />} />
      <Route path="/company/register" element={<CompanyRegister />} />
      <Route path="/company" element={<CompanyLayout />}>
      <Route index element={<CompanyDashboard />} />
      <Route path="add-job" element={<AddJobPost />} />
      <Route path="manage-jobs" element={<ManageJobPosts />} /></Route>
      <Route path="/company/manage-jobs" element={<ManageJobPosts />} />
      <Route path="/company/view-job/:id" element={<ViewJobPost />} />
      <Route path="/company/edit-job/:id" element={<EditJobPost />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;