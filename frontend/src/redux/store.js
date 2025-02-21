import { configureStore } from '@reduxjs/toolkit';
import postReducer from './reducers/postReducer';
import filterReducer from "./reducers/filterReducer";
import categoryReducer from "./reducers/categoryReducer";
import commentReducer from "./reducers/commentReducer";
import userReducer from "./reducers/userReducer";
import authReducer from "./reducers/authReducer";
import favoriteReducer from "./reducers/favoriteReducer";

export const store = configureStore({
    reducer: {
        posts: postReducer,
        filters: filterReducer,
        categories: categoryReducer,
        comments: commentReducer,
        user: userReducer,
        auth: authReducer,
        favorites: favoriteReducer,
    },
});

export default store;