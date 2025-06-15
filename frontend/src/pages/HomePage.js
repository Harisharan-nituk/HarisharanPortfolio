// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ArrowRight, Edit } from 'lucide-react';

// Reusable styles for modal inputs and labels
const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 sm:text-sm";
const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

// Modal for editing text content
const EditTextModal = ({ show, onClose, onSave, currentSettings, isLoading }) => {
  const [formData, setFormData] = useState({
    ownerName: '', jobTitle: '', specialization: '', homePageIntroParagraph: '',
  });

  useEffect(() => {
    if (show && currentSettings) {
      setFormData({
        ownerName: currentSettings.ownerName || '',
        jobTitle: currentSettings.jobTitle || '',
        specialization: currentSettings.specialization || '',
        homePageIntroParagraph: currentSettings.homePageIntroParagraph || '',
      });
    }
  }, [show, currentSettings]);

  if (!show) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Edit Homepage Content</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label htmlFor="ownerName" className={labelClasses}>Your Name</label><input type="text" name="ownerName" id="ownerName" value={formData.ownerName} onChange={handleChange} className={inputClasses} /></div>
          <div><label htmlFor="jobTitle" className={labelClasses}>Your Profession / Title</label><input type="text" name="jobTitle" id="jobTitle" value={formData.jobTitle} onChange={handleChange} className={inputClasses} /></div>
          <div><label htmlFor="specialization" className={labelClasses}>Specialization / Tagline</label><input type="text" name="specialization" id="specialization" value={formData.specialization} onChange={handleChange} className={inputClasses} /></div>
          <div><label htmlFor="homePageIntroParagraph" className={labelClasses}>Introductory Paragraph</label><textarea name="homePageIntroParagraph" id="homePageIntroParagraph" rows="4" value={formData.homePageIntroParagraph} onChange={handleChange} className={inputClasses}></textarea></div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for editing the profile photo
const EditPhotoModal = ({ show, onClose, onSave, isLoading }) => {
    const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
    const handleSubmit = (e) => { e.preventDefault(); if (!selectedPhotoFile) { alert("Please select a photo."); return; } onSave(selectedPhotoFile); };

    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Update Profile Photo</h2>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div><label htmlFor="profilePhotoFileModalInput" className={labelClasses}>New Photo</label><input type="file" name="profilePhotoFileModalInput" id="profilePhotoFileModalInput" accept="image/*" onChange={(e) => setSelectedPhotoFile(e.target.files[0])} required className="file-input-style w-full mt-1" /></div>
                    <div className="flex justify-end space-x-3 pt-2"><button type="button" onClick={onClose} className="btn-secondary" disabled={isLoading}>Cancel</button><button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? 'Uploading...' : 'Upload'}</button></div>
                </form>
            </div>
        </div>
    );
};


const HomePage = () => {
  const { isAdmin } = useAuth();
  const { siteSettings, isLoading: isLoadingSettings } = useSettings();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditTextModal, setShowEditTextModal] = useState(false);
  const [showEditPhotoModal, setShowEditPhotoModal] = useState(false);

  const handleUpdateTextSettings = async (formData) => {
    setIsProcessing(true);
    try {
      await api.put('/settings', formData);
      setShowEditTextModal(false);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update content.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProfilePhotoUpload = async (photoFile) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('profilePhoto', photoFile); 

    try {
      await api.post('/settings/profile-photo', formData);
      setShowEditPhotoModal(false);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingSettings) {
    return <div className="flex justify-center items-center h-screen"><div className="text-lg text-gray-500">Loading...</div></div>;
  }
  
  const { ownerName, jobTitle, specialization, homePageIntroParagraph, profilePhotoUrl } = siteSettings;
  const profilePhotoToDisplay = profilePhotoUrl || "/images/default-profile.png";

  return (
    <>
      {isAdmin && (
          <>
            <EditTextModal show={showEditTextModal} onClose={() => setShowEditTextModal(false)} currentSettings={siteSettings} onSave={handleUpdateTextSettings} isLoading={isProcessing} />
            <EditPhotoModal show={showEditPhotoModal} onClose={() => setShowEditPhotoModal(false)} onSave={handleProfilePhotoUpload} isLoading={isProcessing} />
          </>
      )}

      <div className="relative overflow-hidden bg-white dark:bg-slate-900">
        <div className="absolute inset-0 bg-hero-gradient opacity-20 dark:opacity-30 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)] py-12">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="text-center md:text-left relative">
              {isAdmin && (
                <button onClick={() => setShowEditTextModal(true)} className="absolute top-0 right-0 md:right-auto md:left-0 -mt-4 md:mt-0 md:-ml-12 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors" title="Edit Content"><Edit size={18} /></button>
              )}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 dark:text-white leading-tight">Hello, I'm <span className="text-sky-500">{ownerName}</span>.</h1>
              <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto md:mx-0">A passionate {jobTitle} specializing in {specialization}.</p>
              <p className="mt-6 text-slate-500 dark:text-slate-400 max-w-xl mx-auto md:mx-0">{homePageIntroParagraph}</p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4"><Link to="/projects" className="group btn-primary bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/20 text-lg px-8 py-3 flex items-center justify-center">View My Work <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" /></Link><Link to="/contact" className="btn-secondary text-lg px-8 py-3 flex items-center justify-center">Get In Touch</Link></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }} className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 justify-self-center order-first md:order-last">
              {isAdmin && (
                <button onClick={() => setShowEditPhotoModal(true)} className="absolute bottom-2 right-2 z-20 p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors" title="Change Photo"><Edit size={18} /></button>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-300 to-blue-500 rounded-full blur-2xl opacity-50 dark:opacity-40"></div>
              <img src={profilePhotoToDisplay} alt={ownerName} className="relative w-full h-full object-cover rounded-full shadow-2xl border-4 border-white dark:border-slate-800" />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;