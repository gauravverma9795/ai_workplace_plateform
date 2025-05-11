import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiKeyService from './apiKeyService';

const initialState = {
  apiKeys: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Create API key
export const createApiKey = createAsyncThunk(
  'apiKey/create',
  async (apiKeyData, thunkAPI) => {
    try {
      return await apiKeyService.createApiKey(apiKeyData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user API keys
export const getUserApiKeys = createAsyncThunk(
  'apiKey/getUserApiKeys',
  async (_, thunkAPI) => {
    try {
      return await apiKeyService.getUserApiKeys();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete API key
export const deleteApiKey = createAsyncThunk(
  'apiKey/deleteApiKey',
  async (id, thunkAPI) => {
    try {
      await apiKeyService.deleteApiKey(id);
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

export const apiKeySlice = createSlice({
  name: 'apiKey',
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
      .addCase(createApiKey.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createApiKey.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.apiKeys.push(action.payload);
      })
      .addCase(createApiKey.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserApiKeys.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserApiKeys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.apiKeys = action.payload;
      })
      .addCase(getUserApiKeys.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteApiKey.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteApiKey.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.apiKeys = state.apiKeys.filter(
          (apiKey) => apiKey._id !== action.payload
        );
      })
      .addCase(deleteApiKey.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = apiKeySlice.actions;
export default apiKeySlice.reducer;