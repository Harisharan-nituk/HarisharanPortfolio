// frontend/src/components/projects/ProjectList.js
import React from 'react';
import ProjectItem from './ProjectItem';

const ProjectList = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return <p className="text-center text-gray-500">No projects to display.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      {projects.map((project) => (
        <ProjectItem key={project._id || project.title} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;