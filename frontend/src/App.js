// portfolio_py/frontend/src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// ... (all your other imports should be here)
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
import AdminSkillsPage from './pages/admin/AdminSkillsPage'; // Make sure this is imported
import ProtectedRoute from './components/routing/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';


const AdminResumesPage = () => <div className="p-4">Admin Resumes Management Page</div>;
const AdminProjectsPage = () => <div className="p-4">Admin Projects Management Page</div>;

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-800">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* THE ROUTE FOR SKILLS SHOULD BE REMOVED FROM HERE */}

          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/resetpassword/:resettoken" element={<ResetPasswordPage />} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute isAdminRoute={true} />}>
            <Route path="/admin" element={<AdminRoutes />} />
            <Route path="/admin/skills" element={<AdminSkillsPage />} />
             <Route path="/admin/resumes" element={<ResumePage />} /> {/* This should probably be AdminResumesPage */}
            <Route path="/admin/projects" element={<ProjectsPage />} /> {/* This should probably be AdminProjectsPage */}
            <Route path="/admin/social-links" element={<AdminSocialLinksPage />} />
            <Route path="/admin/about" element={<AboutPage />} /> 

          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

// Helper component to structure admin routes within AdminLayout
const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />

        {/* --- THIS IS THE CORRECT PLACE FOR THE SKILLS ROUTE --- */}

        
        <Route path="*" element={
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-500">Admin Section Not Found</h2>
            <p className="text-gray-600">The specific admin page you're looking for doesn't exist here.</p>
          </div>
        } />
      </Routes>
    </AdminLayout>
  );
};

export default App;
// portfolio_py/frontend/src/App.js
// import React from 'react';
// import { Route, Routes } from 'react-router-dom';

// // Import all your page components
// import HomePage from './pages/HomePage';
// import AboutPage from './pages/admin/AboutPage/AboutPage';
// import ProjectsPage from './pages/ProjectsPage';
// import ContactPage from './pages/ContactPage';
// import ResumePage from './pages/ResumePage';
// import LoginPage from './pages/LoginPage';
// import NotFoundPage from './pages/NotFoundPage';
// import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import ResetPasswordPage from './pages/ResetPasswordPage';
// import AdminLayout from './components/admin/AdminLayout';
// import AdminDashboardPage from './pages/admin/AdminDashboardPage';
// import AdminSocialLinksPage from './pages/admin/AdminSocialLinksPage';
// import AdminSkillsPage from './pages/admin/AdminSkillsPage';
// import ProtectedRoute from './components/routing/ProtectedRoute';
// import Navbar from './components/common/Navbar';
// import Footer from './components/common/Footer';

// // Define placeholder components for clarity if they don't exist
// const AdminResumesPage = () => <div className="p-4">Admin Resumes Management Page</div>;
// const AdminProjectsPage = () => <div className="p-4">Admin Projects Management Page</div>;

// function App() {
//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-slate-800">
//       <Navbar />
//       <div className="flex-grow">
//         <Routes>
//           {/* --- Public Routes --- */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path ="/about" element={<AboutPage/>}/>
//           <Route path="/projects" element={<ProjectsPage />} />
//           <Route path="/resume" element={<ResumePage />} />
//           <Route path="/contact" element={<ContactPage />} />
//           <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
//           <Route path="/resetpassword/:resettoken" element={<ResetPasswordPage />} />
          
//           {/* --- Admin Routes (Wrapped Individually) --- */}
//           <Route 
//             path="/admin" 
//             element={
//               <ProtectedRoute isAdminRoute={true}>
//                 <AdminLayout>
//                   <AdminDashboardPage />
//                 </AdminLayout>
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/admin/about" 
//             element={
//               <ProtectedRoute isAdminRoute={true}>
//                 <AdminLayout>
//                   <AboutPage />
//                 </AdminLayout>
//               </ProtectedRoute>
//             } 
//           />
//            <Route 
//             path="/admin/skills" 
//             element={
//               <ProtectedRoute isAdminRoute={true}>
//                 <AdminLayout>
//                   <AdminSkillsPage />
//                 </AdminLayout>
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/admin/projects" 
//             element={
//               <ProtectedRoute isAdminRoute={true}>
//                 <AdminLayout>
//                   <ProjectsPage />
//                 </AdminLayout>
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/admin/resumes" 
//             element={
//               <ProtectedRoute isAdminRoute={true}>
//                 <AdminLayout>
//                   <ResumePage />
//                 </AdminLayout>
//               </ProtectedRoute>
//             } 
//           />
//            <Route 
//             path="/admin/social-links" 
//             element={
//               <ProtectedRoute isAdminRoute={true}>
//                 <AdminLayout>
//                   <AdminSocialLinksPage />
//                 </AdminLayout>
//               </ProtectedRoute>
//             } 
//           />
          
//           {/* --- Not Found Route --- */}
//           <Route path="*" element={<NotFoundPage />} />
//         </Routes>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// // The old AdminRoutes helper component is no longer needed and can be deleted.

// export default App;