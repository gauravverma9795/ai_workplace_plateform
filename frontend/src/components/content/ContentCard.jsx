import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, truncateText } from '../../utils/helpers';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const ContentCard = ({ content, workspaceId }) => {
  return (
    <Link
      to={`/workspace/${workspaceId}/content/${content._id}`}
      className="block bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow p-4"
    >
      <div className="flex">
        <div className="flex-shrink-0 mr-4">
          <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center">
            <DocumentTextIcon className="h-6 w-6 text-primary-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">{content.title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {formatDate(content.createdAt)}
          </p>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {truncateText(content.text, 150)}
          </p>
          {content.tags && content.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap">
              {content.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;