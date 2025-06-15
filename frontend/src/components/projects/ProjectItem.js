// frontend/src/components/projects/ProjectItem.js
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you might link to a detailed project page

const ProjectItem = ({ project }) => {
  // Basic placeholder image if imageUrl is not provided
  const imageUrl = project.imageUrl || 'https://via.placeholder.com/400x250/E2E8F0/4A5568?text=Project+Image';

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-105 duration-300 ease-in-out">
      <Link to={`/project/${project._id}`} className="block"> {/* Or your preferred detail route */}
        <img
          src={imageUrl}
          alt={project.title || 'Project image'}
          className="w-full h-56 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x250/E2E8F0/4A5568?text=Image+Error'; }}
        />
      </Link>
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2 truncate">
          <Link to={`/project/${project._id}`} className="hover:text-indigo-600 transition-colors">
            {project.title || 'Untitled Project'}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden">
          {project.description ? (project.description.substring(0, 120) + (project.description.length > 120 ? '...' : '')) : 'No description available.'}
        </p>
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs text-gray-500 uppercase font-semibold mb-1">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech) => ( // Show max 4 techs
                <span
                  key={tech}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-3 justify-start">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 shadow hover:shadow-md"
            >
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition duration-300 shadow hover:shadow-md"
            >
              View Code
            </a>
          )}
           <Link
              to={`/project/${project._id}`} // Or your preferred detail route
              className="inline-block text-sm bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 shadow hover:shadow-md"
            >
              Details
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;