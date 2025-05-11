import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteApiKey } from '../../features/apiKey/apiKeySlice';
import { formatDate } from '../../utils/helpers';
import Button from '../common/Button';
import ConfirmModal from '../common/ConfirmModal';

const ApiKeyItem = ({ apiKey, onDeleted }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.apiKey);

  const handleDelete = () => {
    dispatch(deleteApiKey(apiKey._id))
      .unwrap()
      .then(() => {
        setShowDeleteModal(false);
        onDeleted && onDeleted();
      })
      .catch((error) => {
        console.error('Failed to delete API key:', error);
      });
  };

  const getProviderLabel = (provider) => {
    switch(provider) {
      case 'openai': return 'OpenAI';
      default: return provider;
    }
  };

  return (
    <li className="px-4 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{apiKey.name}</h3>
          <div className="mt-1 flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
              {getProviderLabel(apiKey.provider)}
            </span>
            <span className="text-sm text-gray-500">
              Added {formatDate(apiKey.createdAt)}
            </span>
          </div>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </Button>
      </div>
      
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete API Key"
        message="Are you sure you want to delete this API key? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        isLoading={isLoading}
      />
    </li>
  );
};

export default ApiKeyItem;