import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import workspaceReducer from '../features/workspace/workspaceSlice';
import teamReducer from '../features/team/teamSlice';
import contentReducer from '../features/content/contentSlice';
import templateReducer from '../features/template/templateSlice';
import apiKeyReducer from '../features/apiKey/apiKeySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    team: teamReducer,
    content: contentReducer,
    template: templateReducer,
    apiKey: apiKeyReducer,
  },
});