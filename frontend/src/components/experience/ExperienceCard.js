// frontend/src/components/experience/ExperienceCard.js
import React from 'react';

const ExperienceCard = ({ experience, onUpdate, onDelete, isAdminView }) => {
  const placeholderLogo = 'https://via.placeholder.com/100x100/E2E8F0/4A5568?text=Company';
  const logoUrl = experience.companyLogo ? experience.companyLogo : placeholderLogo;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getDuration = (startDate, endDate, isCurrent) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    let duration = '';
    if (years > 0) duration += `${years} ${years === 1 ? 'year' : 'years'}`;
    if (months > 0) {
      if (duration) duration += ' ';
      duration += `${months} ${months === 1 ? 'month' : 'months'}`;
    }
    if (!duration) duration = 'Less than a month';
    return duration;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl border-l-4 border-blue-500">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start gap-4 mb-4">
          <img 
            src={logoUrl} 
            alt={experience.company || 'Company logo'} 
            className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 dark:border-slate-700"
            onError={(e) => { e.target.onerror = null; e.target.src = placeholderLogo; }}
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
              {experience.position || 'Position'}
            </h3>
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-1">
              {experience.company || 'Company'}
            </p>
            {experience.location && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                📍 {experience.location}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span className="font-semibold">Duration:</span> {formatDate(experience.startDate)} - {experience.isCurrent ? 'Present' : formatDate(experience.endDate)} ({getDuration(experience.startDate, experience.endDate, experience.isCurrent)})
          </p>
          {experience.isCurrent && (
            <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-2 py-1 rounded-full">
              Current Position
            </span>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
          {experience.description}
        </p>

        {experience.technologies && experience.technologies.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1.5">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech, index) => (
                <span key={`${tech}-${index}`} className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-200 px-2.5 py-1 rounded-full text-xs font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {isAdminView && (
        <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700 flex justify-end items-center gap-3">
          <button onClick={() => onUpdate(experience)} className="btn-secondary text-sm py-1.5 px-3">
            Update
          </button>
          <button onClick={() => onDelete(experience)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-md text-sm">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ExperienceCard;

