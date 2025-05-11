import React, { Fragment, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useSelector, useDispatch } from 'react-redux';
import { getUserWorkspaces } from '../../features/workspace/workspaceSlice';
import { stringToColor } from '../../utils/helpers';
import { FolderIcon } from '@heroicons/react/24/solid';


const WorkspaceSwitcher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workspaces, workspace } = useSelector((state) => state.workspace);

  useEffect(() => {
    dispatch(getUserWorkspaces());
  }, [dispatch]);

  const handleCreateWorkspace = () => {
    navigate('/workspaces/new');
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {workspace ? (
            <span className="flex items-center">
              <span
                className="h-6 w-6 rounded-full flex items-center justify-center text-white mr-2"
                style={{ backgroundColor: stringToColor(workspace.name) }}
              >
                {workspace.name.charAt(0).toUpperCase()}
              </span>
              <span className="truncate max-w-[120px]">{workspace.name}</span>
            </span>
          ) : (
            <span>Select Workspace</span>
          )}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-60 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {workspaces.length > 0 ? (
              workspaces.map((ws) => (
                <Menu.Item key={ws._id}>
                  {({ active }) => (
                    <Link
                      to={`/workspaces/${ws._id}`}
                      className={`
                        ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                        flex items-center px-4 py-2 text-sm
                      `}
                    >
                      <span
                        className="h-6 w-6 rounded-full flex items-center justify-center text-white mr-2"
                        style={{ backgroundColor: stringToColor(ws.name) }}
                      >
                        {ws.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate">{ws.name}</span>
                    </Link>
                  )}
                </Menu.Item>
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-gray-500">No workspaces found</p>
            )}
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleCreateWorkspace}
                  className={`
                    ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                    flex w-full items-center px-4 py-2 text-sm
                  `}
                >
                  <PlusIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Create New Workspace
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/workspaces"
                  className={`
                    ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                    flex items-center px-4 py-2 text-sm
                  `}
                >
                  <FolderIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Manage All Workspaces
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default WorkspaceSwitcher;