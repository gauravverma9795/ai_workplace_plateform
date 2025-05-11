import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateContent, deleteContent } from '../../features/content/contentSlice';
import { formatDate } from '../../utils/helpers';
import Button from '../common/Button';
import Alert from '../common/Alert';
import ConfirmModal from '../common/ConfirmModal';

const ContentDetail = ({ content, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.content);

  useEffect(() => {
    if (content) {
      setTitle(content.title);
      setText(content.text);
      setTags(content.tags || []);
    }
  }, [content]);

  const handleSave = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const contentData = {
      title,
      text,
      tags,
    };

    dispatch(updateContent({ id: content._id, contentData }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        setError(null);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleDelete = () => {
    dispatch(deleteContent(content._id))
      .unwrap()
      .then(() => {
        setShowDeleteModal(false);
        onDelete && onDelete();
      })
      .catch((err) => {
        setError(err);
      });
  };

  if (!content) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}
      
      <div className="flex justify-between items-start mb-6">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input text-2xl font-bold"
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Created {formatDate(content.createdAt)}
            {content.createdAt !== content.updatedAt && ` • Updated ${formatDate(content.updatedAt)}`}
          </p>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsEditing(false);
                  setTitle(content.title);
                  setText(content.text);
                  setTags(content.tags || []);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSave}
                isLoading={isLoading}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="secondary" 
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button 
                variant="danger" 
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="form-textarea"
              rows="12"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <span className="sr-only">Remove tag</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddTag} className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="form-input"
                placeholder="Add a tag"
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
        </>
      ) : (
        <>
          <div className="prose max-w-none">
            {content.text.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
          
          {tags && tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Tags</h3>
              <div className="flex flex-wrap mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {content.prompt && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900">Original Prompt</h3>
              <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                {content.prompt}
              </div>
            </div>
          )}
        </>
      )}
      
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Content"
        message="Are you sure you want to delete this content? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ContentDetail;