import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, stringToColor } from '../../utils/helpers';

const WorkspaceCard = ({ workspace, className = '' }) => {
  return (
    <Link
      to={`/workspaces/${workspace._id}`}
      className={`block bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="px-5 py-4">
        <div className="flex items-center">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center text-white mr-3"
            style={{ backgroundColor: stringToColor(workspace.name) }}
          >
            {workspace.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{workspace.name}</h3>
            <p className="text-sm text-gray-500">
              Created {formatDate(workspace.createdAt)}
            </p>
          </div>
        </div>
        {workspace.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{workspace.description}</p>
        )}
        <div className="mt-3 flex items-center">
          <span className="text-sm text-gray-600">
            {workspace.members.length + 1} members
          </span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-600">
            {workspace.contents?.length || 0} contents
          </span>
        </div>
      </div>
    </Link>
  );
};

export default WorkspaceCard;