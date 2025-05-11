import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createApiKey, reset } from '../../features/apiKey/apiKeySlice';
import Button from '../common/Button';
import Alert from '../common/Alert';

const AddApiKeyForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [provider, setProvider] = useState('openai');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.apiKey);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Key name is required');
      return;
    }

    if (!key.trim()) {
      setError('API key is required');
      return;
    }

    const apiKeyData = {
      name,
      key,
      provider,
    };

    dispatch(createApiKey(apiKeyData))
      .unwrap()
      .then(() => {
        dispatch(reset());
        onSuccess && onSuccess();
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Add API Key</h2>
      
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
            Key Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input mt-1"
            placeholder="Enter a name for this API key"
            required
          />
        </div>
        
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
            Provider
          </label>
          <select
            id="provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="form-select mt-1"
          >
            <option value="openai">OpenAI</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="key" className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <input
            type="password"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="form-input mt-1"
            placeholder="Enter your API key"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Your API key is stored securely and never shared.
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
            Add API Key
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddApiKeyForm;