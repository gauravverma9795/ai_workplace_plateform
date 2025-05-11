import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTeamMember, removeTeamMember } from '../../features/team/teamSlice';
import Button from '../common/Button';
import ConfirmModal from '../common/ConfirmModal';

const MemberItem = ({ member, workspaceId, canEdit, currentUserId }) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.team);

  const getRoleLabel = (role) => {
    switch(role) {
      case 'admin': return 'Admin';
      case 'editor': return 'Editor';
      case 'viewer': return 'Viewer';
      case 'owner': return 'Owner';
      default: return role;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      case 'owner': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRoleChange = (newRole) => {
    const roleData = { role: newRole };
    
    dispatch(updateTeamMember({ workspaceId, userId: member.userId, roleData }))
      .unwrap()
      .then(() => {
        setShowRoleMenu(false);
      })
      .catch((error) => {
        console.error('Failed to update member role:', error);
      });
  };

  const handleRemoveMember = () => {
    dispatch(removeTeamMember({ workspaceId, userId: member.userId }))
      .unwrap()
      .then(() => {
        setShowRemoveModal(false);
      })
      .catch((error) => {
        console.error('Failed to remove team member:', error);
      });
  };

  const isCurrentUser = member.userId === currentUserId;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
            {(member?.email?.charAt(0) || '?').toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{member?.email || 'Unknown email'}</p>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(member.role)}`}>
                {getRoleLabel(member.role)}
              </span>
              {isCurrentUser && (
                <span className="ml-2 text-xs text-gray-500">(You)</span>
              )}
            </div>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex space-x-2">
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
              >
                Change Role
              </Button>
              
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleRoleChange('admin')}
                      disabled={member.role === 'admin'}
                    >
                      Admin
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleRoleChange('editor')}
                      disabled={member.role === 'editor'}
                    >
                      Editor
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleRoleChange('viewer')}
                      disabled={member.role === 'viewer'}
                    >
                      Viewer
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowRemoveModal(true)}
            >
              Remove
            </Button>
          </div>
        )}
      </div>
      
      <ConfirmModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={handleRemoveMember}
        title="Remove Team Member"
        message={`Are you sure you want to remove ${member?.email || 'this user'} from this workspace?`}
        confirmText="Remove"
        cancelText="Cancel"
        confirmColor="danger"
        isLoading={isLoading}
      />
    </div>
  );
};

export default MemberItem;
