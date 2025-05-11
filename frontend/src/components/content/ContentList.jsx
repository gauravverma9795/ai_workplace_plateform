import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getWorkspaceContent, reset } from '../../features/content/contentSlice';
import ContentCard from './ContentCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

const ContentList = ({ workspaceId }) => {
  const dispatch = useDispatch();
  const { contents, isLoading, isError, message } = useSelector(
    (state) => state.content
  );

  useEffect(() => {
    if (workspaceId) {
      dispatch(getWorkspaceContent(workspaceId));
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, workspaceId]);

  if (isLoading) {
    return <LoadingSpinner className="mt-4" />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message={message || 'Failed to load content'}
      />
    );
  }

  if (!contents || contents.length === 0) {
    return (
      <div className="text-center py-6 bg-white rounded-lg shadow border border-gray-200">
        <p className="text-gray-500 mb-4">No content found in this workspace.</p>
        <Link
          to={`/workspace/${workspaceId}/generator`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Generate Content
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contents.map((content) => (
        <ContentCard
          key={content._id}
          content={content}
          workspaceId={workspaceId}
        />
      ))}
    </div>
  );
};

export default ContentList;