import React from 'react';

const TemplateSelector = ({ templates, selectedTemplateId, onSelectTemplate }) => {
  if (templates.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-2">
        No templates found in this workspace.
      </div>
    );
  }

  return (
    <div>
      <select
        value={selectedTemplateId}
        onChange={(e) => onSelectTemplate(e.target.value)}
        className="form-select"
      >
        <option value="">Write your own prompt</option>
        {templates.map((template) => (
          <option key={template._id} value={template._id}>
            {template.name}
          </option>
        ))}
      </select>
      
      {selectedTemplateId && (
        <div className="mt-2 text-sm text-gray-500">
          {templates.find((t) => t._id === selectedTemplateId)?.description}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;