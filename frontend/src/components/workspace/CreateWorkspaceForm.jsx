import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createWorkspace, reset } from '../../features/workspace/workspaceSlice';
import Button from '../common/Button';
import Alert from '../common/Alert';

const CreateWorkspaceForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.workspace
  );

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

    dispatch(createWorkspace(workspaceData))
      .unwrap()
      .then((workspace) => {
        dispatch(reset());
        if (onSuccess) {
          onSuccess(workspace._id);
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <div>
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
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            Create Workspace
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateWorkspaceForm;