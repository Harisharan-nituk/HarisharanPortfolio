// Harisharan_portfolio/frontend/src/App.js

import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';

// Page and Component Imports
import HomePage from './pages/HomePage';
import AboutPage from './pages/admin/AboutPage/AboutPage'; 
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import ResumePage from './pages/ResumePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSocialLinksPage from './pages/admin/AdminSocialLinksPage'; 
import AdminSkillsPage from './pages/admin/AdminSkillsPage';
import ProtectedRoute from './components/routing/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminEducationPage from './pages/admin/AdminEducationPage';
import AdminCertificate from './pages/admin/AdminCertificate';
import AdminResumesPage from './pages/admin/AdminResumesPage';

// Use the existing ProjectsPage and ResumePage for admin for now
// You can create dedicated admin pages for these later if you wish.

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-800">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/resetpassword/:resettoken" element={<ResetPasswordPage />} />
          
          {/* --- Admin Routes --- */}
          {/* All admin routes are now nested under this single protected route */}
          <Route element={<ProtectedRoute isAdminRoute={true} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} /> {/* Default page for /admin */}
              <Route path="about" element={<AboutPage />} />
              <Route path="skills" element={<AdminSkillsPage />} />
              <Route path="projects" element={<AdminProjectsPage />} /> {/* Admin view of projects */}
              <Route path="resumes" element={<AdminResumesPage />} /> {/* Admin view of resumes */}
              <Route path="social-links" element={<AdminSocialLinksPage />} />
              <Route path="edu" element={<AdminEducationPage />} />
              <Route path="certificate" element={<AdminCertificate/>}/>
            </Route>
          </Route>

          {/* --- Not Found Route --- */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;