import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkspace, deleteWorkspace } from '../features/workspace/workspaceSlice';
import { getUserRole } from '../utils/helpers';
import PageHeader from '../components/common/PageHeader';
import ContentList from '../components/content/ContentList';
import UpdateWorkspaceForm from '../components/workspace/UpdateWorkspaceForm';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { PencilIcon, TrashIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';

const WorkspaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const { workspace, isLoading, isError, message } = useSelector(
    (state) => state.workspace
  );
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (id) {
      dispatch(getWorkspace(id));
    }
  }, [dispatch, id]);
  
  const userRole = getUserRole(workspace, user?.clerkId);
  const isOwner = workspace && workspace.owner === user?.clerkId;
  const isAdmin = userRole === 'admin';
  const canEdit = isOwner || isAdmin;

  const handleDelete = () => {
    dispatch(deleteWorkspace(id))
      .unwrap()
      .then(() => {
        navigate('/workspaces');
      })
      .catch((error) => {
        console.error('Failed to delete workspace:', error);
      });
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="mt-8" />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message={message || 'Failed to load workspace'}
      />
    );
  }

  if (!workspace) {
    return (
      <Alert
        type="error"
        message="Workspace not found"
      />
    );
  }

  if (isEditing) {
    return (
      <div>
        <div className="mb-6">
          <Button 
            variant="secondary" 
            onClick={() => setIsEditing(false)}
          >
            Back to Workspace
          </Button>
        </div>
        <UpdateWorkspaceForm 
          workspace={workspace} 
          onSuccess={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={workspace.name}
        description={workspace.description}
        actions={
          <div className="flex space-x-2">
            {canEdit && (
              <>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsEditing(true)}
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit
                </Button>
                {isOwner && (
                  <Button 
                    variant="danger" 
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Delete
                  </Button>
                )}
              </>
            )}
            <Link to={`/workspace/${id}/generator`}>
              <Button variant="primary">
                <DocumentPlusIcon className="h-5 w-5 mr-2" />
                Generate Content
              </Button>
            </Link>
          </div>
        }
      />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Content</h2>
        <ContentList workspaceId={id} />
      </div>
      
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Workspace"
        message="Are you sure you want to delete this workspace? This action will permanently delete all content and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
      />
    </div>
  );
};

export default WorkspaceDetail;