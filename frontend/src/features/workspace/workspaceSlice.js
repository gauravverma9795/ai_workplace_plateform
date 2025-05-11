import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workspaceService from './workspaceService';

const initialState = {
  workspaces: [],
  workspace: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Create workspace
export const createWorkspace = createAsyncThunk(
  'workspace/create',
  async (workspaceData, thunkAPI) => {
    try {
      return await workspaceService.createWorkspace(workspaceData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user workspaces
export const getUserWorkspaces = createAsyncThunk(
  'workspace/getUserWorkspaces',
  async (_, thunkAPI) => {
    try {
      return await workspaceService.getUserWorkspaces();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get workspace by ID
export const getWorkspace = createAsyncThunk(
  'workspace/getWorkspace',
  async (id, thunkAPI) => {
    try {
      return await workspaceService.getWorkspace(id);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update workspace
export const updateWorkspace = createAsyncThunk(
  'workspace/updateWorkspace',
  async ({ id, workspaceData }, thunkAPI) => {
    try {
      return await workspaceService.updateWorkspace(id, workspaceData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete workspace
export const deleteWorkspace = createAsyncThunk(
  'workspace/deleteWorkspace',
  async (id, thunkAPI) => {
    try {
      await workspaceService.deleteWorkspace(id);
      return id;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearWorkspace: (state) => {
      state.workspace = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createWorkspace.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.workspaces.push(action.payload);
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserWorkspaces.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserWorkspaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.workspaces = action.payload;
      })
      .addCase(getUserWorkspaces.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getWorkspace.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.workspace = action.payload;
      })
      .addCase(getWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateWorkspace.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.workspace = action.payload;
        state.workspaces = state.workspaces.map((workspace) =>
          workspace._id === action.payload._id ? action.payload : workspace
        );
      })
      .addCase(updateWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteWorkspace.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.workspaces = state.workspaces.filter(
          (workspace) => workspace._id !== action.payload
        );
      })
      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;