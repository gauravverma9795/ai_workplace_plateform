import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserWorkspaces } from '../features/workspace/workspaceSlice';
import PageHeader from '../components/common/PageHeader';
import WorkspaceCard from '../components/workspace/WorkspaceCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PlusIcon } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { workspaces, isLoading } = useSelector((state) => state.workspace);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserWorkspaces());
  }, [dispatch]);

  const renderWorkspaces = () => {
    if (isLoading) {
      return <LoadingSpinner className="mt-8" />;
    }

    if (workspaces.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workspaces found</h3>
          <p className="text-gray-500 mb-6">Create your first workspace to get started.</p>
          <Link
            to="/workspaces/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Workspace
          </Link>
        </div>
      );
    }

    return (
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workspaces.slice(0, 3).map((workspace) => (
          <WorkspaceCard key={workspace._id} workspace={workspace} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.firstName || 'User'}!`}
        actions={
          <Link to="/workspaces/create">
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Workspace
            </Button>
          </Link>
        }
      />

      <div className="mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Recent Workspaces</h2>
          <Link to="/workspaces" className="text-sm font-medium text-primary-600 hover:text-primary-500">
            View all workspaces
          </Link>
        </div>
        {renderWorkspaces()}
      </div>
    </div>
  );
};

export default Dashboard;