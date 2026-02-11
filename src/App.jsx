import Navbar from "./components/home/Navbar";
import { Routes, Route } from "react-router-dom";

import Home from "./components/home/Home";
import Jobs from "./components/jobs/Jobs";
import Companies from "./components/companies/Companies";
import About from "./components/home/About";
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
import MyCV from "./components/user/MyCV";
import SavedJobs from "./components/user/SavedJobs";
import AppliedJobs from "./components/user/AppliedJobs";
import ShortlistedJobs from "./components/user/ShortlistedJobs";

function App() {
  return (
    <div className="bg-black">
      <Navbar />

      <Routes>
        {/* ===== Public Pages (with footer) ===== */}
        <Route
          path="/"
          element={
            <>
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/jobs"
          element={
            <>
              <Jobs />
              <Footer />
            </>
          }
        />
        <Route
          path="/companies"
          element={
            <>
              <Companies />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Register />
              <Footer />
            </>
          }
        />
        
        /* ===== User Pages ===== */
        <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-cv" element={<MyCV />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/applied-jobs" element={<AppliedJobs />} />
        <Route path="/shortlisted-jobs" element={<ShortlistedJobs />} />
        </Route>

        {/* ===== Admin Pages ===== */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="analytics" element={<Analytics />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="cv-collections" element={<CvCollection />} />
        </Route>

        {/* ===== Company Auth ===== */}
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />

        {/* ===== Company Panel (scroll handled inside layout) ===== */}
        <Route path="/company" element={<CompanyLayout />}>
          <Route index element={<CompanyDashboard />} />
          <Route path="add-job" element={<AddJobPost />} />
          <Route path="manage-jobs" element={<ManageJobPosts />} />
          <Route path="view-job/:id" element={<ViewJobPost />} />
          <Route path="edit-job/:id" element={<EditJobPost />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;