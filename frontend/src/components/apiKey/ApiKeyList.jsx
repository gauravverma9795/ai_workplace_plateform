import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserApiKeys, reset } from '../../features/apiKey/apiKeySlice';
import ApiKeyItem from './ApiKeyItem';
import AddApiKeyForm from './AddApiKeyForm';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

const ApiKeyList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const dispatch = useDispatch();
  const { apiKeys, isLoading, isError, message } = useSelector(
    (state) => state.apiKey
  );

  useEffect(() => {
    dispatch(getUserApiKeys());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleAddSuccess = () => {
    setShowAddForm(false);
    dispatch(getUserApiKeys());
  };

  if (isLoading) {
    return <LoadingSpinner className="mt-4" />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message={message || 'Failed to load API keys'}
      />
    );
  }

  if (showAddForm) {
    return <AddApiKeyForm onSuccess={handleAddSuccess} />;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">API Keys</h2>
        <Button 
          variant="primary" 
          onClick={() => setShowAddForm(true)}
        >
          Add API Key
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have any API keys yet.</p>
            <Button 
              variant="primary" 
              onClick={() => setShowAddForm(true)}
            >
              Add Your First API Key
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {apiKeys.map((apiKey) => (
              <ApiKeyItem 
                key={apiKey._id} 
                apiKey={apiKey} 
                onDeleted={() => dispatch(getUserApiKeys())}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ApiKeyList;