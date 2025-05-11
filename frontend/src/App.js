import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useDispatch } from 'react-redux';
import { syncUser } from './features/auth/authSlice';

// Pages
import Dashboard from './pages/Dashboard';
import Workspaces from './pages/Workspaces';
import CreateWorkspacePage from './pages/CreateWorkspacePage';
import WorkspaceDetail from './pages/WorkspaceDetail';
import ContentGenerator from './pages/ContentGenerator';
import ContentDetail from './pages/ContentDetail';
import TeamManagement from './pages/TeamManagement';
import PromptTemplates from './pages/PromptTemplates';
import ApiKeySettings from './pages/ApiKeySettings';
import ProfileSettings from './pages/ProfileSettings';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';

// Components
import Layout from './components/layout/Layout';

const App = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const syncUserData = async () => {
        // Get token and save to localStorage for use in API calls
        const token = await getToken();
        localStorage.setItem('clerkToken', token);
        localStorage.setItem('clerkUserId', user.id);

        // Send user data to backend
        const userData = {
          id: user.id,
          email_addresses: user.emailAddresses,
          first_name: user.firstName,
          last_name: user.lastName,
          image_url: user.imageUrl,
        };

        dispatch(syncUser(userData));
      };

      syncUserData();
    }
  }, [isLoaded, isSignedIn, user, getToken, dispatch]);

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        
        {/* Protected routes inside Layout */}
        <Route element={<ProtectedRoute isSignedIn={isSignedIn} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workspaces" element={<Workspaces />} />
            {/* Important: Put specific route before dynamic one */}
            <Route path="/workspaces/create" element={<CreateWorkspacePage />} />
            <Route path="/workspaces/:id" element={<WorkspaceDetail />} />
            <Route path="/workspace/:workspaceId/generator" element={<ContentGenerator />} />
            <Route path="/workspace/:workspaceId/content/:contentId" element={<ContentDetail />} />
            <Route path="/workspace/:workspaceId/team" element={<TeamManagement />} />
            <Route path="/workspace/:workspaceId/templates" element={<PromptTemplates />} />
            <Route path="/api-keys" element={<ApiKeySettings />} />
            <Route path="/profile" element={<ProfileSettings />} />
          </Route>
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

// Protected route component
const ProtectedRoute = ({ isSignedIn }) => {
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return <Outlet />;
};

export default App;