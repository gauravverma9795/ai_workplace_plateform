import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkspace } from '../features/workspace/workspaceSlice';
import { getUserRole } from '../utils/helpers';
import MemberList from '../components/team/MemberList';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const TeamManagement = () => {
  const { workspaceId } = useParams();
  const dispatch = useDispatch();
  
  const { workspace, isLoading, isError, message } = useSelector(
    (state) => state.workspace
  );
  
  const { user } = useSelector((state) => state.auth);
  
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
  
  const userRole = getUserRole(workspace, user?.clerkId);
  const canManageMembers = userRole === 'owner' || userRole === 'admin';
  
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
      
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Team Management</h1>
        <MemberList 
          workspaceId={workspaceId} 
          canManageMembers={canManageMembers} 
        />
      </div>
    </div>
  );
};

export default TeamManagement;