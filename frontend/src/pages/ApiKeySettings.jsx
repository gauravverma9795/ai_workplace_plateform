import React from 'react';
import PageHeader from '../components/common/PageHeader';
import ApiKeyList from '../components/apiKey/ApiKeyList';

const ApiKeySettings = () => {
  return (
    <div>
      <PageHeader
        title="API Key Management"
        description="Manage your third-party API keys for AI content generation"
      />
      
      <div className="mt-6">
        <ApiKeyList />
      </div>
    </div>
  );
};

export default ApiKeySettings;