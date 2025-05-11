import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import WorkspaceList from '../components/workspace/WorkspaceList';
import Button from '../components/common/Button';
import { PlusIcon } from '@heroicons/react/24/solid';

const Workspaces = () => {
  return (
    <div>
      <PageHeader
        title="Workspaces"
        description="Manage your workspaces and team collaboration"
        actions={
          <Link to="/workspaces/create">
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Workspace
            </Button>
          </Link>
        }
      />
      <WorkspaceList />
    </div>
  );
};

export default Workspaces;