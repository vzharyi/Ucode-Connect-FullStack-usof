const initialState = {
    favorites: [],
    loading: false,
    error: null,
};

const favoritesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'favorites/fetchFavoritesRequest':
            return { ...state, loading: true };
        case 'favorites/fetchFavoritesSuccess':
            return { ...state, loading: false, favorites: action.payload };
        case 'favorites/fetchFavoritesFailure':
            return { ...state, loading: false, error: action.payload };
        case 'favorites/addFavoriteSuccess':
            return {
                ...state,
                favorites: [...state.favorites, action.payload], 
            };
        case 'favorites/addFavoriteFailure':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export default favoritesReducer;
