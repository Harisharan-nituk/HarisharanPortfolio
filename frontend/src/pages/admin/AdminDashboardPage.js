// frontend/src/pages/admin/AdminDashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Briefcase, FileText, MessageSquare, Cpu, ArrowRight, Award, Trash2 } from 'lucide-react';

// Reusable card component for statistics
const StatCard = ({ title, value, icon, color, linkTo }) => {
  const IconComponent = icon;
  return (
    <Link to={linkTo} className={`block p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-white/80 uppercase tracking-wider">{title}</p>
          <p className="text-4xl font-bold text-white">{value}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-lg">
          <IconComponent className="h-6 w-6 text-white" />
        </div>
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
      // Set loading to true only on the initial fetch
      if (summary === null) setLoading(true);
      const { data } = await api.get('/admin/summary');
      setSummary(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [summary]); // Dependency array ensures it only re-creates if summary is set from null

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);
  
  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/contact/${messageId}`);
        // Refresh the dashboard data to show the message is gone
        fetchSummary();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete message.');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500 dark:text-gray-300">Loading Dashboard...</div>;
  if (error) return <div className="p-6 text-center text-red-500 bg-red-100 rounded-lg">{error}</div>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Admin Dashboard</h1>
        {currentUser && (
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Welcome back, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentUser.name}!</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard title="Projects" value={summary?.stats?.projects ?? 0} icon={Briefcase} linkTo="/admin/projects" color="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard title="Resumes" value={summary?.stats?.resumes ?? 0} icon={FileText} linkTo="/admin/resumes" color="bg-gradient-to-br from-green-500 to-green-700" />
        <StatCard title="Total Skills" value={summary?.stats?.skills ?? 0} icon={Cpu} linkTo="/admin/skills" color="bg-gradient-to-br from-purple-500 to-purple-700" />
        <StatCard title="Certificates" value={summary?.stats?.certificates ?? 0} icon={Award} linkTo="/admin/about" color="bg-gradient-to-br from-yellow-400 to-amber-600" />
        <StatCard title="Messages" value={summary?.stats?.messages ?? 0} icon={MessageSquare} linkTo="#" color="bg-gradient-to-br from-orange-500 to-orange-700" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Contact Messages</h2>
          <div className="space-y-4">
            {summary?.recentMessages?.length > 0 ? (
              summary.recentMessages.map((msg) => (
                <div key={msg._id} className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 group hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{msg.name}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({msg.email})</span>
                      </div>
                      {msg.subject && (
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subject: <span className="text-indigo-600 dark:text-indigo-400">{msg.subject}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <button 
                        onClick={() => handleDeleteMessage(msg._id)} 
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-1" 
                        title="Delete Message"
                      >
                        <Trash2 size={16} />
                      </button>
                      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>
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
             <Link to="/admin/about" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <span>Manage About Page</span>
                <ArrowRight className="h-5 w-5 text-gray-400" />
             </Link>
             <Link to="/admin/social-links" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <span>Manage Social Links</span>
                <ArrowRight className="h-5 w-5 text-gray-400" />
             </Link>
              <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <span>View Public Site</span>
                <ArrowRight className="h-5 w-5 text-gray-400" />
             </a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;