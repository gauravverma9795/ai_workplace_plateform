import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserWorkspaces, reset } from '../../features/workspace/workspaceSlice';
import WorkspaceCard from './WorkspaceCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

const WorkspaceList = () => {
  const dispatch = useDispatch();
  const { workspaces, isLoading, isError, message } = useSelector(
    (state) => state.workspace
  );

  useEffect(() => {
    dispatch(getUserWorkspaces());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner size="lg" className="mt-8" />;
  }

  if (isError) {
    return <Alert type="error" message={message} />;
  }

  if (workspaces.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You don't have any workspaces yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace._id} workspace={workspace} />
      ))}
    </div>
  );
};

export default WorkspaceList;