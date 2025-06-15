// frontend/src/components/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Briefcase, FileText, MessageSquare, Cpu, ArrowRight } from 'lucide-react';

// A reusable card component for statistics
const StatCard = ({ title, value, icon, color, linkTo }) => {
  const IconComponent = icon;
  return (
    <Link to={linkTo} className={`block p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-white/80 uppercase">{title}</p>
          <p className="text-4xl font-bold text-white">{value}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-lg">
          <IconComponent className="h-6 w-6 text-white" />
        </div>
      </div>
    </Link>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/admin/summary');
        setSummary(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-300">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500 bg-red-100 rounded-lg">{error}</div>;
  }

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

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Projects" value={summary?.stats?.projects ?? 0} icon={Briefcase} linkTo="/admin/projects" color="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard title="Resumes" value={summary?.stats?.resumes ?? 0} icon={FileText} linkTo="/admin/resumes" color="bg-gradient-to-br from-green-500 to-green-700" />
        <StatCard title="Total Skills" value={summary?.stats?.skills ?? 0} icon={Cpu} linkTo="/admin/about" color="bg-gradient-to-br from-purple-500 to-purple-700" />
        <StatCard title="Messages" value={summary?.stats?.messages ?? 0} icon={MessageSquare} linkTo="/contact" color="bg-gradient-to-br from-orange-500 to-orange-700" />
      </div>

      {/* --- Recent Messages & Quick Links --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Contact Messages</h2>
          <div className="space-y-4">
            {summary?.recentMessages?.length > 0 ? (
              summary.recentMessages.map((msg) => (
                <div key={msg._id} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-200">{msg.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{msg.subject || 'No Subject'}</p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
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
                <span>Manage About & Skills</span>
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

export default Dashboard;