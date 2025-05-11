import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTeamMembers, reset } from '../../features/team/teamSlice';
import MemberItem from './MemberItem';
import AddMemberForm from './AddMemberForm';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

const MemberList = ({ workspaceId, canManageMembers }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const dispatch = useDispatch();
  const { members, isLoading, isError, message } = useSelector(
    (state) => state.team
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (workspaceId) {
      dispatch(getTeamMembers(workspaceId));
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, workspaceId]);

  const handleAddSuccess = () => {
    setShowAddForm(false);
    dispatch(getTeamMembers(workspaceId));
  };

  if (isLoading) {
    return <LoadingSpinner className="mt-4" />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message={message || 'Failed to load team members'}
      />
    );
  }

  if (showAddForm) {
    return (
      <AddMemberForm 
        workspaceId={workspaceId} 
        onSuccess={handleAddSuccess} 
      />
    );
  }

  const owner = members.find(member => member.role === 'owner');
  const regularMembers = members.filter(member => member.role !== 'owner');

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
        {canManageMembers && (
          <Button 
            variant="primary" 
            onClick={() => setShowAddForm(true)}
          >
            Add Member
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {owner && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Owner</h3>
            <MemberItem 
              member={owner} 
              workspaceId={workspaceId}
              canEdit={false}
              currentUserId={user?.clerkId}
            />
          </div>
        )}
        
        {regularMembers.length === 0 ? (
          <div className="text-center py-4 bg-white rounded-lg shadow border border-gray-200">
            <p className="text-gray-500">No additional team members yet.</p>
          </div>
        ) : (
          <>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Members</h3>
            {regularMembers.map((member) => (
              <MemberItem 
                key={member.userId} 
                member={member} 
                workspaceId={workspaceId}
                canEdit={canManageMembers && member.userId !== user?.clerkId}
                currentUserId={user?.clerkId}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MemberList;