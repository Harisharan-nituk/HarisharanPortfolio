import React, { useState, useEffect } from 'react';

const CertificateFormModal = ({ show, onClose, onSave, currentCertificate, isLoading }) => {
  const isEditing = !!currentCertificate?._id;

  const [formData, setFormData] = useState({
    name: '',
    issuingOrganization: '',
    description: '',
    credentialId: '',
    credentialUrl: '',
    dateIssued: '',
  });
  const [certificateImage, setCertificateImage] = useState(null);

  useEffect(() => {
    if (show) {
      if (isEditing && currentCertificate) {
        setFormData({
          name: currentCertificate.name || '',
          issuingOrganization: currentCertificate.issuingOrganization || '',
          description: currentCertificate.description || '',
          credentialId: currentCertificate.credentialId || '',
          credentialUrl: currentCertificate.credentialUrl || '',
          dateIssued: currentCertificate.dateIssued || '',
        });
        setCertificateImage(null);
      } else {
        setFormData({
            name: '',
            issuingOrganization: '',
            description: '',
            credentialId: '',
            credentialUrl: '',
            dateIssued: '',
        });
        setCertificateImage(null);
      }
    }
  }, [currentCertificate, isEditing, show]);

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setCertificateImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.issuingOrganization) {
      alert('Name and Issuing Organization are required.');
      return;
    }
    if (!isEditing && !certificateImage) {
        alert('A certificate image or PDF is required when adding a new certificate.');
        return;
    }
    
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
        submissionData.append(key, formData[key]);
    });
    if (certificateImage) {
        submissionData.append('certificateImage', certificateImage);
    }

    onSave(submissionData, currentCertificate?._id);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">{isEditing ? 'Edit' : 'Add'} Certificate</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Certificate Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 input-style w-full" />
          </div>
           <div>
            <label htmlFor="issuingOrganization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Issuing Organization</label>
            <input type="text" name="issuingOrganization" id="issuingOrganization" value={formData.issuingOrganization} onChange={handleChange} required className="mt-1 input-style w-full" />
          </div>
          <div>
            <label htmlFor="dateIssued" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Issued</label>
            <input type="text" name="dateIssued" id="dateIssued" value={formData.dateIssued} onChange={handleChange} className="mt-1 input-style w-full" placeholder="e.g., June 2024"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 input-style w-full"></textarea>
          </div>
           <div>
            <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Credential ID (Optional)</label>
            <input type="text" name="credentialId" id="credentialId" value={formData.credentialId} onChange={handleChange} className="mt-1 input-style w-full" />
          </div>
          <div>
            <label htmlFor="credentialUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Credential URL (Optional)</label>
            <input type="url" name="credentialUrl" id="credentialUrl" value={formData.credentialUrl} onChange={handleChange} className="mt-1 input-style w-full" />
          </div>
           <div>
            <label htmlFor="certificateImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Certificate Image/PDF</label>
            <input type="file" name="certificateImage" id="certificateImage" onChange={handleFileChange} className="mt-1 file-input-style w-full" accept="image/*,application/pdf" />
             {isEditing && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave blank to keep the existing file.</p>}
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-70">{isLoading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateFormModal;