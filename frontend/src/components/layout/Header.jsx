import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useClerk, UserButton } from '@clerk/clerk-react';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import WorkspaceSwitcher from './WorkspaceSwitcher';

const Header = () => {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    localStorage.removeItem('clerkToken');
    localStorage.removeItem('clerkUserId');
    signOut();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/dashboard">
                <img
                  className="h-8 w-auto"
                  src="/logo192.png"
                  alt="AI Workspace Platform"
                />
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                Dashboard
              </Link>
              <Link to="/workspaces" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                Workspaces
              </Link>
              <Link to="/api-keys" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                API Keys
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <WorkspaceSwitcher />
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;