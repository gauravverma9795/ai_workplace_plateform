import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTemplate, reset } from '../../features/template/templateSlice';
import Button from '../common/Button';
import Alert from '../common/Alert';

const CreateTemplateForm = ({ workspaceId, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [variableInput, setVariableInput] = useState('');
  const [variables, setVariables] = useState([]);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.template);

  const handleAddVariable = (e) => {
    e.preventDefault();
    if (variableInput.trim() && !variables.includes(variableInput.trim())) {
      setVariables([...variables, variableInput.trim()]);
      setVariableInput('');
    }
  };

  const handleRemoveVariable = (variable) => {
    setVariables(variables.filter((v) => v !== variable));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Template name is required');
      return;
    }

    if (!prompt.trim()) {
      setError('Prompt is required');
      return;
    }

    const templateData = {
      name,
      description,
      prompt,
      workspaceId,
      variables,
    };

    dispatch(createTemplate(templateData))
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
      <h2 className="text-xl font-bold text-gray-900 mb-4">Create Prompt Template</h2>
      
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
            Template Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input mt-1"
            placeholder="Enter template name"
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
            rows="2"
            placeholder="Enter template description"
          />
        </div>
        
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
            placeholder="Enter your prompt template. Use {{variable_name}} for variables."
            required
          />
          {/* <p className="mt-1 text-sm text-gray-500">
            Use {{variable_name}} syntax for variables, e.g., "Write a blog post about {{topic}}."
          </p> */}
          <p className="mt-1 text-sm text-gray-500">
  Use {"{{variable_name}}"} syntax for variables, e.g., "Write a blog post about {"{{topic}}"}."
</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Variables
          </label>
          <div className="flex flex-wrap mb-2">
            {variables.map((variable) => (
              <span
                key={variable}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
              >
                {variable}
                <button
                  type="button"
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                  onClick={() => handleRemoveVariable(variable)}
                >
                  <span className="sr-only">Remove variable</span>
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={handleAddVariable} className="flex">
            <input
              type="text"
              value={variableInput}
              onChange={(e) => setVariableInput(e.target.value)}
              className="form-input"
              placeholder="Add a variable"
            />
            <Button
              type="submit"
              variant="secondary"
              className="ml-2"
            >
              Add
            </Button>
          </form>
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
            Create Template
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplateForm;