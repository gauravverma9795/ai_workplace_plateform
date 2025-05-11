import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTemplate } from '../../features/template/templateSlice';
import { formatDate } from '../../utils/helpers';
import Button from '../common/Button';
import ConfirmModal from '../common/ConfirmModal';
import { DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const TemplateCard = ({ template, onDeleted }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.template);

  const handleDelete = () => {
    dispatch(deleteTemplate(template._id))
      .unwrap()
      .then(() => {
        setShowDeleteModal(false);
        onDeleted && onDeleted();
      })
      .catch((error) => {
        console.error('Failed to delete template:', error);
      });
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center mr-3">
              <DocumentTextIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-500">
                Created {formatDate(template.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
        
        {template.description && (
          <p className="mt-2 text-sm text-gray-600">{template.description}</p>
        )}
        
        {isExpanded && (
          <div className="mt-4 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Prompt:</h4>
              <div className="mt-1 p-3 bg-gray-50 rounded border text-sm text-gray-600">
                {template.prompt}
              </div>
            </div>
            
            {template.variables && template.variables.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Variables:</h4>
                <div className="mt-1 flex flex-wrap">
                  {template.variables.map((variable) => (
                    <span
                      key={variable}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
                    >
                      {variable}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Template"
        message="Are you sure you want to delete this template? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        isLoading={isLoading}
      />
    </div>
  );
};

export default TemplateCard;