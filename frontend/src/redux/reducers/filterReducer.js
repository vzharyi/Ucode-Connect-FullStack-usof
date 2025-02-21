import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
    name: 'filters',
    initialState: {
        startDate: '',
        endDate: '',
        category: '',
        locked: '',
        sort: 'likes', 
    },
    reducers: {
        setFilters: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setFilters } = filterSlice.actions;
export default filterSlice.reducer;
