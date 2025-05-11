import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTeamMember, reset } from '../../features/team/teamSlice';
import Button from '../common/Button';
import Alert from '../common/Alert';

const AddMemberForm = ({ workspaceId, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.team);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const memberData = {
      email,
      role,
    };

    dispatch(addTeamMember({ workspaceId, memberData }))
      .unwrap()
      .then(() => {
        dispatch(reset());
        setEmail('');
        setRole('viewer');
        onSuccess && onSuccess();
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Add Team Member</h2>
      
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input mt-1"
            placeholder="Enter email address"
            required
          />
        </div>
        
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-select mt-1"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Admins can manage members, Editors can create/edit content, Viewers can only view content.
          </p>
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
            Add Member
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddMemberForm;