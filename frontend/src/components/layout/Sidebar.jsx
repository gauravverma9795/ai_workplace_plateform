import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HomeIcon,
  FolderIcon,
  UsersIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { workspaceId } = useParams();
  const { workspace } = useSelector((state) => state.workspace);

  if (!workspace || !workspaceId) {
    return null;
  }

  const navigation = [
    { name: 'Overview', href: `/workspaces/${workspaceId}`, icon: HomeIcon },
    { name: 'Content Generator', href: `/workspace/${workspaceId}/generator`, icon: PencilSquareIcon },
    { name: 'Team', href: `/workspace/${workspaceId}/team`, icon: UsersIcon },
    { name: 'Templates', href: `/workspace/${workspaceId}/templates`, icon: DocumentTextIcon },
    { name: 'Settings', href: `/workspace/${workspaceId}/settings`, icon: Cog6ToothIcon },
  ];

  return (
    <div className="hidden md:block min-h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex flex-col h-full px-3 py-4">
        <div className="mb-6 px-3">
          <h2 className="text-lg font-medium text-gray-900 truncate">{workspace.name}</h2>
          <p className="text-sm text-gray-500 truncate">{workspace.description}</p>
        </div>
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              <item.icon
                className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;