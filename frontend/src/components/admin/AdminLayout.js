// portfolio_py/frontend/src/components/admin/AdminLayout.js
import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminDashboardPage from "../../pages/admin/AdminDashboardPage";
import AboutPage from "../../pages/admin/AboutPage/AboutPage";
import ResumePage from "../../pages/ResumePage";
import AdminSkillsPage from "../../pages/admin/AdminSkillsPage";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  LogOut,
  Cpu,
  ExternalLink,
  Info,
  Link as LucideLinkIcon,
} from "lucide-react";

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
      isActive
         ? 'bg-indigo-600 text-white shadow-md'
        : 'text-gray-300 hover:bg-indigo-500/20 hover:text-white' }`;

  // Check if current path is under /admin/
  // Since this layout only renders for /admin/*, we can assume Outlet is always needed.
  // The original check was a bit redundant. We will render Outlet directly.

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      <aside className="w-64 bg-gray-800 dark:bg-slate-800 text-gray-100 flex flex-col p-4 shadow-lg">
        <div className="text-center py-4 border-b border-gray-700 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-white">Admin Portal</h2>
          {currentUser && (
            <p className="text-xs text-gray-400 mt-1">
              Welcome, {currentUser.name}
            </p>
          )}
        </div>

        <nav className="flex-grow mt-4 space-y-1">
          <NavLink to="/admin" className={navLinkClasses}>
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/about" className={navLinkClasses}>
            <Info className="mr-3 h-5 w-5" />
            Manage About
          </NavLink>
          <NavLink to="/admin/projects" className={navLinkClasses}>
            <Briefcase className="mr-3 h-5 w-5" />
            Manage Projects
          </NavLink>
          <NavLink to="/admin/resumes" className={navLinkClasses}>
            <FileText className="mr-3 h-5 w-5" />
            Manage Resumes
          </NavLink>
          <NavLink to="/admin/social-links" className={navLinkClasses}>
            <LucideLinkIcon className="mr-3 h-5 w-5" />
            Manage Social Links
          </NavLink>
          <NavLink to="/admin/skills" className={navLinkClasses}>
            <Cpu className="mr-3 h-5 w-5" />
            Manage Skills
          </NavLink>
        </nav>

        <div className="pt-4 mt-auto border-t border-gray-700 dark:border-slate-700 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={navLinkClasses({ isActive: false })}
          >
            <ExternalLink className="mr-3 h-5 w-5" />
            View Public Site
          </a>
          <button
            onClick={logout}
            className={`${navLinkClasses({
              isActive: false,
            })} w-full text-left`}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <AdminDashboardPage />
      </main>
    </div>
  );
};

export default AdminLayout;
// portfolio_py/frontend/src/components/admin/AdminLayout.js
// import React from "react";
// import { NavLink } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import {
//   LayoutDashboard,
//   FileText,
//   Briefcase,
//   LogOut,
//   Cpu,
//   ExternalLink,
//   Info,
//   Link as LucideLinkIcon,
// } from "lucide-react";

// const AdminLayout = ({ children }) => {
//   const { currentUser, logout } = useAuth();

//   const navLinkClasses = ({ isActive }) =>
//     `flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
//       isActive
//         ? 'bg-indigo-600 text-white shadow-md'
//         : 'text-gray-300 hover:bg-indigo-500/20 hover:text-white'
//     }`;

//   return (
//     <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
//       <aside className="w-64 bg-gray-800 dark:bg-slate-800 text-gray-100 flex flex-col p-4 shadow-lg">
//         <div className="text-center py-4 border-b border-gray-700 dark:border-slate-700">
//           <h2 className="text-xl font-semibold text-white">Admin Portal</h2>
//           {currentUser && (
//             <p className="text-xs text-gray-400 mt-1">
//               Welcome, {currentUser.name}
//             </p>
//           )}
//         </div>

//         <nav className="flex-grow mt-4 space-y-1">
//           <NavLink to="/admin" end className={navLinkClasses}>
//             <LayoutDashboard className="mr-3 h-5 w-5" />
//             Dashboard
//           </NavLink>
//           <NavLink to="/admin/about" className={navLinkClasses}>
//             <Info className="mr-3 h-5 w-5" />
//             Manage About
//           </NavLink>
//           <NavLink to="/admin/projects" className={navLinkClasses}>
//             <Briefcase className="mr-3 h-5 w-5" />
//             Manage Projects
//           </NavLink>
//           <NavLink to="/admin/resumes" className={navLinkClasses}>
//             <FileText className="mr-3 h-5 w-5" />
//             Manage Resumes
//           </NavLink>
//           <NavLink to="/admin/social-links" className={navLinkClasses}>
//             <LucideLinkIcon className="mr-3 h-5 w-5" />
//             Manage Social Links
//           </NavLink>
//           <NavLink to="/admin/skills" className={navLinkClasses}>
//             <Cpu className="mr-3 h-5 w-5" />
//             Manage Skills
//           </NavLink>
//         </nav>

//         <div className="pt-4 mt-auto border-t border-gray-700 dark:border-slate-700 space-y-2">
//           <a
//             href="/"
//             target="_blank"
//             rel="noopener noreferrer"
//             className={navLinkClasses({ isActive: false })}
//           >
//             <ExternalLink className="mr-3 h-5 w-5" />
//             View Public Site
//           </a>
//           <button
//             onClick={logout}
//             className={`${navLinkClasses({
//               isActive: false,
//             })} w-full text-left`}
//           >
//             <LogOut className="mr-3 h-5 w-5" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       <main className="flex-1 overflow-y-auto p-6 md:p-8">
//         {children}
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;