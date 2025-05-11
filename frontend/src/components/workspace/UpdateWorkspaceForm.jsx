import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateWorkspace, reset } from '../../features/workspace/workspaceSlice';
import Button from '../common/Button';
import Alert from '../common/Alert';

const UpdateWorkspaceForm = ({ workspace, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.workspace
  );

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setDescription(workspace.description || '');
    }
  }, [workspace]);

  useEffect(() => {
    if (isSuccess) {
      onSuccess && onSuccess();
      dispatch(reset());
    }
  }, [isSuccess, onSuccess, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }

    const workspaceData = {
      name,
      description,
    };

    dispatch(updateWorkspace({ id: workspace._id, workspaceData }))
      .unwrap()
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-4" 
        />
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Workspace Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input mt-1"
            placeholder="Enter workspace name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea mt-1"
            rows="3"
            placeholder="Enter workspace description"
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <Button
            type="button"
            variant="secondary"
            className="mr-3"
            onClick={() => onSuccess && onSuccess()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            Update Workspace
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateWorkspaceForm;