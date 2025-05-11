import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSubscription, getCurrentUser } from '../features/auth/authSlice';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const ProfileSettings = () => {
  const [subscriptionPlan, setSubscriptionPlan] = useState('free');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setSubscriptionPlan(user.subscriptionPlan || 'free');
    }
  }, [user]);

  const handleUpdateSubscription = () => {
    dispatch(updateSubscription({ subscriptionPlan }))
      .unwrap()
      .then(() => {
        setSuccess('Subscription plan updated successfully');
        setTimeout(() => setSuccess(null), 3000);
      })
      .catch((error) => {
        setError(error);
      });
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <PageHeader
        title="Profile Settings"
        description="Manage your profile and subscription"
      />
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-6 mt-6"
        />
      )}
      
      {success && (
        <Alert 
          type="success" 
          message={success} 
          onClose={() => setSuccess(null)}
          className="mb-6 mt-6"
        />
      )}
      
      <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="h-16 w-16 rounded-full mr-4"
            />
          ) : (
            <UserCircleIcon className="h-16 w-16 text-gray-300 mr-4" />
          )}
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {user.email}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Subscription Plan</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select your subscription plan to access different features
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="free"
                    name="subscription"
                    type="radio"
                    checked={subscriptionPlan === 'free'}
                    onChange={() => setSubscriptionPlan('free')}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="free" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Free</span>
                    <span className="block text-sm text-gray-500">
                      Limited to 1 workspace, 1 member per workspace
                    </span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="base"
                    name="subscription"
                    type="radio"
                    checked={subscriptionPlan === 'base'}
                    onChange={() => setSubscriptionPlan('base')}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="base" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Base</span>
                    <span className="block text-sm text-gray-500">
                      Up to 3 workspaces, 2 members per workspace
                    </span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="pro"
                    name="subscription"
                    type="radio"
                    checked={subscriptionPlan === 'pro'}
                    onChange={() => setSubscriptionPlan('pro')}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="pro" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Pro</span>
                    <span className="block text-sm text-gray-500">
                      Up to 10 workspaces, 5 members per workspace
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleUpdateSubscription}
                isLoading={isLoading}
              >
                Update Subscription
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;