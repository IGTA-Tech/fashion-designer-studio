import React, { useState } from 'react';

const ProjectGallery = ({ projects, onLoadProject, onDeleteProject, currentProjectId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div>
        <h2 className="font-heading text-2xl font-bold mb-4">My Projects</h2>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <div className="text-4xl mb-2">📁</div>
            <p>No projects yet</p>
            <p className="text-sm mt-1">Start by uploading a sketch!</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`card cursor-pointer transition-all duration-200 ${
                currentProjectId === project.id
                  ? 'ring-2 ring-primary'
                  : 'hover:scale-102'
              }`}
              onClick={() => onLoadProject(project)}
            >
              <div className="flex items-start space-x-3">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  {project.sketchImages?.[0] ? (
                    <img
                      src={project.sketchImages[0].preview}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : project.generatedImages?.[0] ? (
                    <img
                      src={`data:image/jpeg;base64,${project.generatedImages[0].base64}`}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      👗
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary truncate">
                    {project.name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    {formatDate(project.timestamp)}
                  </p>
                  {project.notes && (
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                      {project.notes}
                    </p>
                  )}
                  <div className="flex items-center space-x-3 mt-2 text-xs text-text-secondary">
                    <span>📷 {project.sketchImages?.length || 0}</span>
                    <span>🎨 {project.generatedImages?.length || 0}</span>
                    <span>💬 {project.messages?.length || 0}</span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this project?')) {
                      onDeleteProject(project.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 text-xl opacity-0 group-hover:opacity-100
                           transition-opacity duration-200"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectGallery;
