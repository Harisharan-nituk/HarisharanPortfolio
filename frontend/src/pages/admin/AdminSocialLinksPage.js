// frontend/src/pages/admin/AdminSocialLinksPage.js
import React, { useState, useEffect, useCallback } from 'react';
import * as socialLinkService from '../../services/socialLinkService';
import { useAuth } from '../../contexts/AuthContext';
import { PlusCircle, Edit3, Trash2, Smartphone, Github, Linkedin, Twitter as TwitterIconLucide, Code, ExternalLink, Globe, Link as LinkIcon, Mail, Info } from 'lucide-react';
import ConfirmationModal from '../../components/common/ConfirmationModal';

// Icon mapping remains the same
const iconComponents = {
  github: Github, linkedin: Linkedin, twitter: TwitterIconLucide, leetcode: Code,
  whatsapp: Smartphone, website: Globe, email: Mail, externallink: ExternalLink,
  info: Info, link: LinkIcon, default: LinkIcon,
};

// --- Add/Edit Modal Component ---
const SocialLinkFormModal = ({ show, onClose, onSave, currentLink, isLoading }) => {
    const isEditing = !!currentLink?._id;
    const [formData, setFormData] = useState({ name: '', url: '', iconName: 'default' });

    useEffect(() => {
        if (show) {
            if (isEditing && currentLink) {
                setFormData({
                    name: currentLink.name || '',
                    url: currentLink.url || '',
                    iconName: currentLink.iconName || 'default',
                });
            } else {
                setFormData({ name: '', url: '', iconName: 'default' });
            }
        }
    }, [currentLink, isEditing, show]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.url.trim() || !formData.iconName.trim()) {
            alert('Platform Name, URL, and Icon are required.');
            return;
        }
        onSave(formData, currentLink?._id);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">{isEditing ? 'Edit Social Link' : 'Add New Social Link'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform Name*</label><input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="input-style w-full" placeholder="e.g., GitHub, LinkedIn"/></div>
                    <div><label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL*</label><input type="url" name="url" id="url" value={formData.url} onChange={handleChange} required className="input-style w-full" placeholder="https://github.com/your-username"/></div>
                    <div><label htmlFor="iconName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon*</label><select name="iconName" id="iconName" value={formData.iconName} onChange={handleChange} required className="input-style w-full">{Object.keys(iconComponents).map(iconKey => (<option key={iconKey} value={iconKey}>{iconKey.charAt(0).toUpperCase() + iconKey.slice(1)}</option>))}</select></div>
                    <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="btn-secondary">Cancel</button><button type="submit" disabled={isLoading} className="btn-primary">{isLoading ? 'Saving...' : 'Save'}</button></div>
                </form>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const AdminSocialLinksPage = () => {
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [linkToDelete, setLinkToDelete] = useState(null);

    const fetchLinks = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await socialLinkService.getAdminSocialLinks();
            setLinks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchLinks(); }, [fetchLinks]);

    const openModal = (link = null) => {
        setEditingLink(link);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleSaveLink = async (formData, id) => {
        setIsProcessing(true);
        try {
            if (id) {
                await socialLinkService.updateSocialLink(id, formData);
            } else {
                await socialLinkService.addSocialLink(formData);
            }
            closeModal();
            fetchLinks();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save link.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const openDeleteModal = (link) => {
        setLinkToDelete(link);
        setShowConfirmModal(true);
    };

    const handleDeleteLink = async () => {
        if (!linkToDelete) return;
        setIsProcessing(true);
        try {
            await socialLinkService.deleteSocialLink(linkToDelete._id);
            setShowConfirmModal(false);
            fetchLinks();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete link.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return <div className="p-6 text-center text-gray-500">Loading Social Links...</div>;

    return (
        <>
            <ConfirmationModal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={handleDeleteLink} title="Delete Social Link" message={`Are you sure you want to delete the link for "${linkToDelete?.name}"?`} isLoading={isProcessing} />
            <SocialLinkFormModal show={isModalOpen} onClose={closeModal} onSave={handleSaveLink} currentLink={editingLink} isLoading={isProcessing} />

            <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 shadow-xl rounded-xl">
                <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-slate-700">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Manage Social Links</h1>
                    <button onClick={() => openModal()} className="btn-primary flex items-center gap-2"><PlusCircle size={18} /> Add Link</button>
                </div>

                <div className="space-y-4">
                    {links.length > 0 ? (
                        links.map(link => {
                            const IconComp = iconComponents[link.iconName?.toLowerCase()] || iconComponents.default;
                            return (
                                <div key={link._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <IconComp className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">{link.name}</p>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">{link.url}</a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => openModal(link)} className="btn-secondary py-2 px-3 text-sm flex items-center gap-1"><Edit3 size={14}/>Update</button>
                                        <button onClick={() => openDeleteModal(link)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg text-sm flex items-center gap-1"><Trash2 size={14}/>Delete</button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500 py-8">No social links yet. Click "Add Link" to get started.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminSocialLinksPage;