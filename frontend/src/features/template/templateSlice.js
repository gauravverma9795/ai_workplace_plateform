import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import templateService from './templateService';

const initialState = {
  templates: [],
  template: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Create template
export const createTemplate = createAsyncThunk(
  'template/create',
  async (templateData, thunkAPI) => {
    try {
      return await templateService.createTemplate(templateData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all templates for a workspace
export const getWorkspaceTemplates = createAsyncThunk(
  'template/getWorkspaceTemplates',
  async (workspaceId, thunkAPI) => {
    try {
      return await templateService.getWorkspaceTemplates(workspaceId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get template by ID
export const getTemplate = createAsyncThunk(
  'template/getTemplate',
  async (id, thunkAPI) => {
    try {
      return await templateService.getTemplate(id);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update template
export const updateTemplate = createAsyncThunk(
  'template/updateTemplate',
  async ({ id, templateData }, thunkAPI) => {
    try {
      return await templateService.updateTemplate(id, templateData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete template
export const deleteTemplate = createAsyncThunk(
  'template/deleteTemplate',
  async (id, thunkAPI) => {
    try {
      await templateService.deleteTemplate(id);
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

export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearTemplate: (state) => {
      state.template = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.templates.push(action.payload);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getWorkspaceTemplates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWorkspaceTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.templates = action.payload;
      })
      .addCase(getWorkspaceTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.template = action.payload;
      })
      .addCase(getTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.template = action.payload;
        state.templates = state.templates.map((template) =>
          template._id === action.payload._id ? action.payload : template
        );
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteTemplate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.templates = state.templates.filter(
          (template) => template._id !== action.payload
        );
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearTemplate } = templateSlice.actions;
export default templateSlice.reducer;