import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkspace } from '../features/workspace/workspaceSlice';
import ContentGeneratorComponent from '../components/content/ContentGenerator';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ContentGenerator = () => {
  const { workspaceId } = useParams();
  const dispatch = useDispatch();
  
  const { workspace, isLoading, isError, message } = useSelector(
    (state) => state.workspace
  );
  
  useEffect(() => {
    if (workspaceId) {
      dispatch(getWorkspace(workspaceId));
    }
  }, [dispatch, workspaceId]);
  
  if (isLoading) {
    return <LoadingSpinner size="lg" className="mt-8" />;
  }
  
  if (isError) {
    return (
      <Alert
        type="error"
        message={message || 'Failed to load workspace'}
      />
    );
  }
  
  if (!workspace) {
    return (
      <Alert
        type="error"
        message="Workspace not found"
      />
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link to={`/workspaces/${workspaceId}`}>
          <Button variant="secondary">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Workspace
          </Button>
        </Link>
      </div>
      
      <ContentGeneratorComponent />
    </div>
  );
};

export default ContentGenerator;