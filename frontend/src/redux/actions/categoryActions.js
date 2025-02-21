import axios from '../../services/api';
import {
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
    updateCategorySuccess, updateCategoryFailure, deleteCategorySuccess, deleteCategoryFailure,
} from '../reducers/categoryReducer';

export const fetchCategories = () => async (dispatch) => {
    dispatch(fetchCategoriesStart());
    try {
        const response = await axios.get('/api/categories');
        dispatch(fetchCategoriesSuccess(response.data));
    } catch (error) {
        dispatch(fetchCategoriesFailure(error.message));
    }
};

export const fetchCategory = (category_id) => async (dispatch) => {
    dispatch(fetchCategoryStart());
    try {
        const response = await axios.get(`/api/categories/${category_id}`);
        dispatch(fetchCategorySuccess(response.data));
    } catch (error) {
        console.error('Error fetching post:', error.message);
        dispatch(fetchCategoryFailure(error.message));
    }
};

export const fetchCategoryPosts = (category_id) => async (dispatch) => {
    dispatch(fetchCategoryPostsStart());
    try {
        const response = await axios.get(`/api/categories/${category_id}/posts`);
        dispatch(fetchCategoryPostsSuccess(response.data));
    } catch (error) {
        dispatch(fetchCategoryPostsFailure(error.message));
    }
};

export const createCategory = (categoryData) => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        const response = await axios.post('/api/categories', categoryData, {
            headers: {
                Authorization: `Bearer ${token}`, 
            }
        });
        dispatch(createCategorySuccess(response.data.category)); 
    } catch (error) {
        dispatch(createCategoryFailure(error.message)); 
    }
};

export const updateCategory = (categoryId, categoryData) => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        const response = await axios.patch(`/api/categories/${categoryId}`, categoryData, {
            headers: {
                Authorization: `Bearer ${token}`, 
            }
        });
        dispatch(updateCategorySuccess(response.data.category)); 
    } catch (error) {
        dispatch(updateCategoryFailure(error.message)); 
    }
};

export const deleteCategory = (categoryId) => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        await axios.delete(`/api/categories/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            }
        });
        dispatch(deleteCategorySuccess(categoryId)); 
    } catch (error) {
        dispatch(deleteCategoryFailure(error.message)); 
    }
};
