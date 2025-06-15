// // frontend/src/pages/admin/AdminDashboardPage.js
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import api from '../../services/api';
// import { Briefcase, FileText, MessageSquare, Cpu, ArrowRight, Trash2 } from 'lucide-react';

// const StatCard = ({ title, value, icon, color, linkTo }) => {
//   const IconComponent = icon;
//   return (
//     <Link to={linkTo} className={`block p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ${color}`}>
//       <div className="flex justify-between items-start">
//         <div>
//           <p className="text-sm font-medium text-white/80 uppercase">{title}</p>
//           <p className="text-4xl font-bold text-white">{value}</p>
//         </div>
//         <div className="p-3 bg-white/20 rounded-lg"><IconComponent className="h-6 w-6 text-white" /></div>
//       </div>
//     </Link>
//   );
// };

// const AdminDashboardPage = () => {
//   const { currentUser } = useAuth();
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const fetchSummary = useCallback(async () => {
//     try {
//       const { data } = await api.get('/admin/summary');
//       setSummary(data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to load dashboard data.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     setLoading(true);
//     fetchSummary();
//   }, [fetchSummary]);
  
//   // This function now correctly uses the authenticated API instance
//   const handleDeleteMessage = async (messageId) => {
//     if (window.confirm('Are you sure you want to delete this message?')) {
//       try {
//         // --- THIS IS THE FIX ---
//         // The URL should start from the resource, not with /api again.
//         await api.delete(`/contact/${messageId}`); 
//         fetchSummary();
//       } catch (err) {
//         alert(err.response?.data?.message || 'Failed to delete message.');
//         console.error(err);
//       }
//     }
//   };

//   if (loading) return <div className="p-6 text-center text-gray-500 dark:text-gray-300">Loading Dashboard...</div>;
//   if (error) return <div className="p-6 text-center text-red-500 bg-red-100 rounded-lg">{error}</div>;

//   return (
//     <div className="space-y-10">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Admin Dashboard</h1>
//         {currentUser && <p className="text-lg text-gray-600 dark:text-gray-300">Welcome back, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentUser.name}!</span></p>}
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard title="Projects" value={summary?.stats?.projects ?? 0} icon={Briefcase} linkTo="/admin/projects" color="bg-gradient-to-br from-blue-500 to-blue-700" />
//         <StatCard title="Resumes" value={summary?.stats?.resumes ?? 0} icon={FileText} linkTo="/admin/resumes" color="bg-gradient-to-br from-green-500 to-green-700" />
//         <StatCard title="Total Skills" value={summary?.stats?.skills ?? 0} icon={Cpu} linkTo="/admin/skills" color="bg-gradient-to-br from-purple-500 to-purple-700" />
//         <StatCard title="Messages" value={summary?.stats?.messages ?? 0} icon={MessageSquare} linkTo="#" color="bg-gradient-to-br from-orange-500 to-orange-700" />
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Contact Messages</h2>
//           <div className="space-y-4">
//             {summary?.recentMessages?.length > 0 ? (
//               summary.recentMessages.map((msg) => (
//                 <div key={msg._id} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 flex justify-between items-center group">
//                   <div>
//                     <p className="font-semibold text-gray-700 dark:text-gray-200">{msg.name}</p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">{msg.subject || 'No Subject'}</p>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <button onClick={() => handleDeleteMessage(msg._id)} className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Message">
//                       <Trash2 size={16} />
//                     </button>
//                     <span className="text-xs text-gray-400 dark:text-gray-500">
//                       {new Date(msg.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent messages.</p>
//             )}
//           </div>
//         </div>
//         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h2>
//           <div className="space-y-3">
//             <Link to="/admin/about" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><span>Manage About & Skills</span><ArrowRight className="h-5 w-5 text-gray-400" /></Link>
//             <Link to="/admin/social-links" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><span>Manage Social Links</span><ArrowRight className="h-5 w-5 text-gray-400" /></Link>
//             <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><span>View Public Site</span><ArrowRight className="h-5 w-5 text-gray-400" /></a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardPage;
// frontend/src/pages/admin/AdminDashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Briefcase, FileText, MessageSquare, Cpu, ArrowRight, Award, Trash2 } from 'lucide-react';

const StatCard = ({ title, value, icon, color, linkTo }) => {
  const IconComponent = icon;
  return (
    <Link to={linkTo} className={`block p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ${color}`}>
      <div className="flex justify-between items-start">
        <div><p className="text-sm font-medium text-white/80 uppercase">{title}</p><p className="text-4xl font-bold text-white">{value}</p></div>
        <div className="p-3 bg-white/20 rounded-lg"><IconComponent className="h-6 w-6 text-white" /></div>
      </div>
    </Link>
  );
};

const AdminDashboardPage = () => {
  const { currentUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/summary');
      setSummary(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchSummary();
  }, [fetchSummary]);
  
  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/contact/${messageId}`);
        fetchSummary();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete message.');
      }
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500 dark:text-gray-300">Loading Dashboard...</div>;
  if (error) return <div className="p-6 text-center text-red-500 bg-red-100 rounded-lg">{error}</div>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Admin Dashboard</h1>
        {currentUser && <p className="text-lg text-gray-600 dark:text-gray-300">Welcome back, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentUser.name}!</span></p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard title="Projects" value={summary?.stats?.projects ?? 0} icon={Briefcase} linkTo="/admin/projects" color="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard title="Resumes" value={summary?.stats?.resumes ?? 0} icon={FileText} linkTo="/admin/resumes" color="bg-gradient-to-br from-green-500 to-green-700" />
        <StatCard title="Total Skills" value={summary?.stats?.skills ?? 0} icon={Cpu} linkTo="/admin/skills" color="bg-gradient-to-br from-purple-500 to-purple-700" />
        <StatCard title="Certificates" value={summary?.stats?.certificates ?? 0} icon={Award} linkTo="/admin/about" color="bg-gradient-to-br from-yellow-400 to-amber-600" />
        <StatCard title="Messages" value={summary?.stats?.messages ?? 0} icon={MessageSquare} linkTo="#" color="bg-gradient-to-br from-orange-500 to-orange-700" />
      </div>

      {/* --- THIS ENTIRE SECTION IS NOW RESTORED --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Contact Messages</h2>
          <div className="space-y-4">
            {summary?.recentMessages?.length > 0 ? (
              summary.recentMessages.map((msg) => (
                <div key={msg._id} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 flex justify-between items-center group">
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-200">{msg.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{msg.subject || 'No Subject'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleDeleteMessage(msg._id)} className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Message">
                      <Trash2 size={16} />
                    </button>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent messages.</p>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h2>
          <div className="space-y-3">
            <Link to="/admin/about" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><span>Manage About & Skills</span><ArrowRight className="h-5 w-5 text-gray-400" /></Link>
            <Link to="/admin/social-links" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><span>Manage Social Links</span><ArrowRight className="h-5 w-5 text-gray-400" /></Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><span>View Public Site</span><ArrowRight className="h-5 w-5 text-gray-400" /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;