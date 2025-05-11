import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkspaceTemplates, reset } from '../../features/template/templateSlice';
import TemplateCard from './TemplateCard';
import CreateTemplateForm from './CreateTemplateForm';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

const TemplateList = ({ workspaceId }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const dispatch = useDispatch();
  const { templates, isLoading, isError, message } = useSelector(
    (state) => state.template
  );

  useEffect(() => {
    if (workspaceId) {
      dispatch(getWorkspaceTemplates(workspaceId));
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, workspaceId]);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    dispatch(getWorkspaceTemplates(workspaceId));
  };

  if (isLoading) {
    return <LoadingSpinner className="mt-4" />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message={message || 'Failed to load templates'}
      />
    );
  }

  if (showCreateForm) {
    return (
      <CreateTemplateForm 
        workspaceId={workspaceId} 
        onSuccess={handleCreateSuccess} 
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Prompt Templates</h2>
        <Button 
          variant="primary" 
          onClick={() => setShowCreateForm(true)}
        >
          Create Template
        </Button>
      </div>
      
      {templates.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No templates found in this workspace.</p>
          <Button 
            variant="primary" 
            onClick={() => setShowCreateForm(true)}
          >
            Create First Template
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {templates.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              onDeleted={() => dispatch(getWorkspaceTemplates(workspaceId))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateList;