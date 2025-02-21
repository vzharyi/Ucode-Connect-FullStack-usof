import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        currentCategory: null,
        categoryPosts: [], 
        loading: false,
        error: null,
    },
    reducers: {
        fetchCategoriesStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCategoriesSuccess: (state, action) => {
            state.loading = false;
            state.categories = action.payload;
        },
        fetchCategoriesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchCategoryStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCategorySuccess: (state, action) => {
            state.loading = false;
            state.currentCategory = action.payload;
        },
        fetchCategoryFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchCategoryPostsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCategoryPostsSuccess: (state, action) => {
            state.loading = false;
            state.categoryPosts = action.payload;
        },
        fetchCategoryPostsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        createCategorySuccess: (state, action) => {
            state.categories.push(action.payload); 
        },
        createCategoryFailure: (state, action) => {
            state.error = action.payload;
        },
        updateCategorySuccess: (state, action) => {
            const updatedCategory = action.payload;
            state.categories = state.categories.map((category) =>
                category.id === updatedCategory.id ? updatedCategory : category
            );
            state.currentCategory = updatedCategory;
        },
        updateCategoryFailure: (state, action) => {
            state.error = action.payload;
        },
        deleteCategorySuccess: (state, action) => {
            const categoryId = action.payload;
            state.categories = state.categories.filter(category => category.id !== categoryId);
        },
        deleteCategoryFailure: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    fetchCategoryStart,
    fetchCategorySuccess,
    fetchCategoryFailure,
    fetchCategoryPostsStart,
    fetchCategoryPostsSuccess,
    fetchCategoryPostsFailure,
    createCategorySuccess,
    createCategoryFailure,
    updateCategorySuccess,
    updateCategoryFailure,
    deleteCategorySuccess,
    deleteCategoryFailure,
} = categorySlice.actions;

export default categorySlice.reducer;
