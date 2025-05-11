import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contentService from './contentService';

const initialState = {
  contents: [],
  content: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Generate content with AI
export const generateContent = createAsyncThunk(
  'content/generate',
  async (contentData, thunkAPI) => {
    try {
      return await contentService.generateContent(contentData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all content for a workspace
export const getWorkspaceContent = createAsyncThunk(
  'content/getWorkspaceContent',
  async (workspaceId, thunkAPI) => {
    try {
      return await contentService.getWorkspaceContent(workspaceId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get content by ID
export const getContent = createAsyncThunk(
  'content/getContent',
  async (id, thunkAPI) => {
    try {
      return await contentService.getContent(id);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update content
export const updateContent = createAsyncThunk(
  'content/updateContent',
  async ({ id, contentData }, thunkAPI) => {
    try {
      return await contentService.updateContent(id, contentData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete content
export const deleteContent = createAsyncThunk(
  'content/deleteContent',
  async (id, thunkAPI) => {
    try {
      await contentService.deleteContent(id);
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

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearContent: (state) => {
      state.content = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.content = action.payload;
        state.contents.push(action.payload);
      })
      .addCase(generateContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getWorkspaceContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWorkspaceContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contents = action.payload;
      })
      .addCase(getWorkspaceContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.content = action.payload;
      })
      .addCase(getContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.content = action.payload;
        state.contents = state.contents.map((content) =>
          content._id === action.payload._id ? action.payload : content
        );
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contents = state.contents.filter(
          (content) => content._id !== action.payload
        );
      })
            .addCase(deleteContent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearContent } = contentSlice.actions;
export default contentSlice.reducer;