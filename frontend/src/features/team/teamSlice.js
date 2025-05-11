import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import teamService from './teamService';

const initialState = {
  members: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Add team member
export const addTeamMember = createAsyncThunk(
  'team/addMember',
  async ({ workspaceId, memberData }, thunkAPI) => {
    try {
      return await teamService.addTeamMember(workspaceId, memberData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get team members
export const getTeamMembers = createAsyncThunk(
  'team/getMembers',
  async (workspaceId, thunkAPI) => {
    try {
      return await teamService.getTeamMembers(workspaceId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update team member role
export const updateTeamMember = createAsyncThunk(
  'team/updateMember',
  async ({ workspaceId, userId, roleData }, thunkAPI) => {
    try {
      return await teamService.updateTeamMember(workspaceId, userId, roleData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove team member
export const removeTeamMember = createAsyncThunk(
  'team/removeMember',
  async ({ workspaceId, userId }, thunkAPI) => {
    try {
      await teamService.removeTeamMember(workspaceId, userId);
      return userId;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTeamMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.members = action.payload.members;
      })
      .addCase(addTeamMember.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTeamMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTeamMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.members = action.payload;
      })
      .addCase(getTeamMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTeamMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.members = action.payload.members;
      })
      .addCase(updateTeamMember.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeTeamMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.members = state.members.filter(
          (member) => member.userId !== action.payload
        );
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = teamSlice.actions;
export default teamSlice.reducer;