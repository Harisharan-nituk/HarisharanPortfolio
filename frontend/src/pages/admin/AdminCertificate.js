import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as certificateService from '../../services/certificateService';
import CertificateFormModal from '../../pages/admin/AboutPage/CertificateFormModal';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';

const AdminCertificate = () => {
  const { isAdmin } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const data = await certificateService.getCertificates();
            

      setCertificates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch certificates.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleOpenModal = (certificate = null) => {
    setEditingCertificate(certificate);
    setShowModal(true);
  };

  const handleSave = async (formData, id) => {
    setIsLoading(true);
    try {
      if (id) {
        await certificateService.updateCertificate(id, formData);
      } else {
        await certificateService.addCertificate(formData);
      }
      setShowModal(false);
      fetchCertificates();
    } catch (err) {
      console.error('Failed to save certificate:', err);
      alert('Could not save certificate. Check console for details.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the certificate "${name}"?`)) {
      setIsLoading(true);
      try {
        await certificateService.deleteCertificate(id);
        fetchCertificates();
      } catch (err) {
        console.error('Failed to delete certificate:', err);
        alert('Could not delete certificate. Check console for details.');
      } finally {
          setIsLoading(false);
      }
    }
  };
  
  const getTransformedImageUrl = (url) => {
    if (!url || !url.includes('/upload/')) return url;
    const parts = url.split('/upload/');
    return `${parts[0]}/upload/w_800,c_limit,q_auto,f_auto/${parts[1]}`;
  };

  return (
    <>
      <section id="certifications" className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-xl shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">Certifications</h2>
          {isAdmin && (
            <button onClick={() => handleOpenModal()} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
              <PlusCircle size={16} /> Add Certificate
            </button>
          )}
        </div>

        {isLoading && <p>Loading certificates...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {!isLoading && !error && certificates.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No certificates listed yet.</p>
        )}

        {certificates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {certificates.map((cert) => {
                const isPdf = cert.mimetype === 'application/pdf';
                const previewUrl = isPdf ? `${cert.imageUrl}#toolbar=0&navpanes=0&scrollbar=0` : getTransformedImageUrl(cert.imageUrl);

                return (
                <div key={cert._id} className="border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden group relative flex flex-col">
                    <div className="w-full h-80 bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                        {isPdf ? (
                            <iframe 
                                src={previewUrl} 
                                title={`Preview of ${cert.name}`}
                                className="w-full h-full border-0"
                            ></iframe>
                        ) : (
                            <img 
                                src={previewUrl || cert.imageUrl} 
                                alt={cert.name} 
                                className="max-w-full max-h-full object-contain"
                            />
                        )}
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{cert.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuingOrganization}</p>
                    </div>
                    {isAdmin && (
                        <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(cert)} className="p-1.5 bg-yellow-400 text-black rounded-full shadow-lg hover:bg-yellow-500"><Edit3 size={12} /></button>
                            <button onClick={() => handleDelete(cert._id, cert.name)} className="p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700"><Trash2 size={12} /></button>
                        </div>
                    )}
                </div>
                );
            })}
          </div>
        )}
      </section>

      {isAdmin && showModal && (
        <CertificateFormModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} currentCertificate={editingCertificate} isLoading={isLoading}/>
      )}
    </>
  );
};

export default AdminCertificate;