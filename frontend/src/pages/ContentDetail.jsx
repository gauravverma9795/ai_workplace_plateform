import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getContent, clearContent } from '../features/content/contentSlice';
import { getWorkspace } from '../features/workspace/workspaceSlice';
import ContentDetailComponent from '../components/content/ContentDetail';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ContentDetail = () => {
  const { workspaceId, contentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { content, isLoading: contentLoading, isError: contentError, message: contentMessage } = useSelector(
    (state) => state.content
  );
  
  const { workspace, isLoading: workspaceLoading, isError: workspaceError } = useSelector(
    (state) => state.workspace
  );
  
  useEffect(() => {
    if (workspaceId) {
      dispatch(getWorkspace(workspaceId));
    }
    
    if (contentId) {
      dispatch(getContent(contentId));
    }
    
    return () => {
      dispatch(clearContent());
    };
  }, [dispatch, workspaceId, contentId]);
  
  const handleDelete = () => {
    navigate(`/workspaces/${workspaceId}`);
  };
  
  if (contentLoading || workspaceLoading) {
    return <LoadingSpinner size="lg" className="mt-8" />;
  }
  
  if (contentError) {
    return (
      <Alert
        type="error"
        message={contentMessage || 'Failed to load content'}
      />
    );
  }
  
  if (workspaceError) {
    return (
      <Alert
        type="error"
        message="Failed to load workspace"
      />
    );
  }
  
  if (!content) {
    return (
      <Alert
        type="error"
        message="Content not found"
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
      
      <ContentDetailComponent 
        content={content} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default ContentDetail;