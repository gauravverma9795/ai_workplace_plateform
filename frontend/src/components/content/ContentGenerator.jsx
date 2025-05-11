import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { generateContent, reset } from '../../features/content/contentSlice';
import { getWorkspaceTemplates } from '../../features/template/templateSlice';
import { getUserApiKeys } from '../../features/apiKey/apiKeySlice';
import Button from '../common/Button';
import Alert from '../common/Alert';
import TemplateSelector from '../template/TemplateSelector';

const ContentGenerator = () => {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [templateVariables, setTemplateVariables] = useState({});
  const [selectedApiKeyId, setSelectedApiKeyId] = useState('');
  const [error, setError] = useState(null);
  
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isLoading, isSuccess, isError, message, content } = useSelector(
    (state) => state.content
  );
  const { templates } = useSelector((state) => state.template);
  const { apiKeys } = useSelector((state) => state.apiKey);
  
  useEffect(() => {
    dispatch(getWorkspaceTemplates(workspaceId));
    dispatch(getUserApiKeys());
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, workspaceId]);
  
  useEffect(() => {
    if (isSuccess && content) {
      navigate(`/workspace/${workspaceId}/content/${content._id}`);
    }
  }, [isSuccess, content, navigate, workspaceId]);
  
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
    
    // Reset variables when template changes
    setTemplateVariables({});
    
    // If no template selected, keep existing prompt
    if (!templateId) return;
    
    // Find the selected template
    const template = templates.find((t) => t._id === templateId);
    if (template) {
      // Initialize variables with empty values
      const initialVariables = {};
      template.variables.forEach((variable) => {
        initialVariables[variable] = '';
      });
      setTemplateVariables(initialVariables);
    }
  };
  
  const handleVariableChange = (variableName, value) => {
    setTemplateVariables((prev) => ({
      ...prev,
      [variableName]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please provide a title for the content');
      return;
    }
    
    if (!selectedTemplateId && !prompt.trim()) {
      setError('Please provide a prompt or select a template');
      return;
    }
    
    const contentData = {
      title,
      workspaceId,
    };
    
    if (selectedTemplateId) {
      contentData.templateId = selectedTemplateId;
      contentData.variables = templateVariables;
    } else {
      contentData.prompt = prompt;
    }
    
    if (selectedApiKeyId) {
      const apiKey = apiKeys.find((key) => key._id === selectedApiKeyId);
      if (apiKey) {
        contentData.apiKey = apiKey.key;
      }
    }
    
    dispatch(generateContent(contentData));
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generate AI Content</h1>
      
      {isError && (
        <Alert 
          type="error" 
          message={message || 'Failed to generate content'} 
          onClose={() => dispatch(reset())}
          className="mb-6"
        />
      )}
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Content Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input mt-1"
            placeholder="Enter a title for your content"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Template (Optional)
          </label>
          <TemplateSelector
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={handleTemplateSelect}
          />
        </div>
        
        {selectedTemplateId && templates.find((t) => t._id === selectedTemplateId)?.variables.length > 0 && (
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Template Variables</h3>
            <div className="space-y-3">
              {templates
                .find((t) => t._id === selectedTemplateId)
                ?.variables.map((variable) => (
                  <div key={variable}>
                    <label className="block text-sm text-gray-700">
                      {variable}
                    </label>
                    <input
                      type="text"
                      value={templateVariables[variable] || ''}
                      onChange={(e) => handleVariableChange(variable, e.target.value)}
                      className="form-input mt-1"
                      placeholder={`Enter ${variable}`}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
        
        {!selectedTemplateId && (
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
              Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="form-textarea mt-1"
              rows="5"
              placeholder="Enter your prompt for AI content generation"
              required={!selectedTemplateId}
            />
          </div>
        )}
        
        {apiKeys.length > 0 && (
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              API Key (Optional)
            </label>
            <select
              id="apiKey"
              value={selectedApiKeyId}
              onChange={(e) => setSelectedApiKeyId(e.target.value)}
              className="form-select mt-1"
            >
              <option value="">Use default API key</option>
              {apiKeys.map((key) => (
                <option key={key._id} value={key._id}>
                  {key.name} ({key.provider})
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={isLoading}
          >
            Generate Content
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContentGenerator;