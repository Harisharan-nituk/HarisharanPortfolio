// frontend/src/components/projects/ProjectCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onUpdate, onDelete, isAdminView }) => {
  const placeholderImage = 'https://via.placeholder.com/600x400/E2E8F0/4A5568?text=Project+Image';
  const imageUrl = project.imageUrl ? project.imageUrl : placeholderImage;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl">
      {/* The Image is now a conditional link to the live demo */}
      <a href={project.projectLink || `/project/${project._id}`} target="_blank" rel="noopener noreferrer">
        <img 
          src={imageUrl} 
          alt={project.title || 'Project image'} 
          className="w-full h-56 object-cover group-hover:opacity-80 transition-opacity duration-300 cursor-pointer"
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
        />
      </a>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          {project.title || 'Untitled Project'}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
          {project.description}
        </p>

        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1.5">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-2.5 py-1 rounded-full text-xs font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 flex flex-wrap gap-3 items-center justify-start border-t border-gray-200 dark:border-slate-700">
          {project.projectLink && (
            <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2 px-4">
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm py-2 px-4">
              View Code
            </a>
          )}
        </div>
      </div>

      {isAdminView && (
        <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700 flex justify-end items-center gap-3">
          <button onClick={() => onUpdate(project)} className="btn-secondary text-sm py-1.5 px-3">
            Update
          </button>
          <button onClick={() => onDelete(project)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-md text-sm">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;