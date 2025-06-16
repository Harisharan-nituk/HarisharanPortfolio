import React, { useState, useEffect } from 'react';
import * as certificateService from '../../../services/certificateService';

const CertificationsSection = () => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      setIsLoading(true);
      try {
        const data = await certificateService.getCertificates();
        setCertificates(data || []);
      } catch (err) {
        setError('Failed to fetch certificates.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCertificates();
  }, []);
  
  const getTransformedImageUrl = (url) => {
    if (!url || !url.includes('/upload/')) return url;
    const parts = url.split('/upload/');
    return `${parts[0]}/upload/w_800,c_limit,q_auto,f_auto/${parts[1]}`;
  };

  return (
    <section id="certifications" className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-xl shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">Certifications</h2>
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
              <div key={cert._id} className="border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden flex flex-col">
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
              </div>
              );
          })}
        </div>
      )}
    </section>
  );
};

export default CertificationsSection;