import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateWorkspaceForm from '../components/workspace/CreateWorkspaceForm';
import Button from '../components/common/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const CreateWorkspacePage = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="mb-6">
        <Button 
          variant="secondary" 
          onClick={() => navigate('/workspaces')}
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Workspaces
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Create New Workspace</h1>
        <CreateWorkspaceForm onSuccess={(workspaceId) => navigate(`/workspaces/${workspaceId}`)} />
      </div>
    </div>
  );
};

export default CreateWorkspacePage;