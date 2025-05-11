import React from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const Alert = ({ type = 'info', message, onClose }) => {
  const alertClasses = {
    success: 'bg-green-50 text-green-800 border-green-400',
    error: 'bg-red-50 text-red-800 border-red-400',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-400',
    info: 'bg-blue-50 text-blue-800 border-blue-400',
  };
  
  const iconClasses = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };
  
  const icons = {
    success: <CheckCircleIcon className={`h-5 w-5 ${iconClasses[type]}`} aria-hidden="true" />,
    error: <XCircleIcon className={`h-5 w-5 ${iconClasses[type]}`} aria-hidden="true" />,
    warning: <ExclamationTriangleIcon className={`h-5 w-5 ${iconClasses[type]}`} aria-hidden="true" />,
    info: <InformationCircleIcon className={`h-5 w-5 ${iconClasses[type]}`} aria-hidden="true" />,
  };
  
  return (
    <div className={`rounded-md border p-4 ${alertClasses[type]}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 ${alertClasses[type]} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;