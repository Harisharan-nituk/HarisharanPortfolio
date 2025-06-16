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


// No, none of the potential issues you've identified will cause a deployment error. They are excellent observations for improving code quality and preventing minor warnings or styling issues at runtime.

// Your analysis is spot on. Here are the corrected files with your suggested improvements applied.

// 1. Technology key in ProjectCard and ProjectItem
// You are correct that using a non-unique key can cause issues. Using the index is a great way to ensure the key is always unique.

// File: Harisharanportfolio /frontend/src/components/projects/ProjectCard.js (Corrected)

// JavaScript

// // ... (imports and other code)
//         {project.technologies && project.technologies.length > 0 && (
//           <div className="mb-4">
//             <h4 className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1.5">Technologies:</h4>
//             <div className="flex flex-wrap gap-2">
//               {project.technologies.map((tech, index) => (
//                 <span key={`${tech}-${index}`} className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-2.5 py-1 rounded-full text-xs font-medium">
//                   {tech}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}
// // ... (rest of the file)
// File: Harisharanportfolio /frontend/src/components/projects/ProjectItem.js (Corrected)

// JavaScript

// // ... (imports and other code)
//         {project.technologies && project.technologies.length > 0 && (
//           <div className="mb-4">
//             <h4 className="text-xs text-gray-500 uppercase font-semibold mb-1">Technologies:</h4>
//             <div className="flex flex-wrap gap-2">
//               {project.technologies.slice(0, 4).map((tech, index) => ( // Show max 4 techs
//                 <span
//                   key={`${tech}-${index}`}
//                   className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
//                 >
//                   {tech}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}
// // ... (rest of the file)
// 2. Button Styling
// Your observation is valid, but the project is configured correctly. The .btn-primary and .btn-secondary classes are defined in your global stylesheet, so the buttons will render with the intended styles.

// 3. ProjectList key
// This is an excellent suggestion to make the component more robust against incomplete data.

// File: Harisharanportfolio /frontend/src/components/projects/ProjectList.js (Corrected)

// JavaScript

// import React from 'react';
// import ProjectItem from './ProjectItem';

// const ProjectList = ({ projects }) => {
//   if (!projects || projects.length === 0) {
//     return <p className="text-center text-gray-500">No projects to display.</p>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
//       {projects.map((project, index) => (
//         <ProjectItem key={project._id ?? `${project.title}-${index}`} project={project} />
//       ))}
//     </div>
//   );
// };

// export default ProjectList;