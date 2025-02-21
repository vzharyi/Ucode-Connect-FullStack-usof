import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
import {useDispatch, useSelector} from "react-redux";
import {fetchCategories} from "../../redux/actions/categoryActions";

const buttonStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '6px 12px',
    borderRadius: '10px',
    color: '#46526a',
    border: '1px solid black', 
    '&:hover': {
        backgroundColor: '#e9ecf2',
        color: '#000',
        border: '1px solid #000', 
    },
};


const containedButtonStyle = {
    fontSize: '14px',
    background: 'linear-gradient(to bottom, #1a1a1a, #000)',
    fontWeight: 'bold',
    padding: '6px 12px',
    borderRadius: '10px',
    color: '#e3e3e3',
    '&:hover': {
        background: 'linear-gradient(to bottom, #2a2a2a, #333)',
        color: '#ffffff',
    },
};

const theme = createTheme({
    components: {
        MuiTextField: {
            defaultProps: {
                size: 'small', 
            },
            styleOverrides: {
                root: {
                    '& .MuiInputLabel-root': {
                        color: '#000', 
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#000', 
                    },
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px', 

                        '&:hover fieldset': {
                            borderColor: '#000', 
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#000', 
                        },
                    },
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: '10px',

                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#e9ecf2',
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#e9ecf2',
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: '#e9ecf2',
                    },
                    borderRadius: '4px',
                },
            },
        },
    },
});

const Filters = ({ initialFilters, onApplyFilters }) => {
    const dispatch = useDispatch();
    const { categories} = useSelector((state) => state.categories);
    const [filters, setFilters] = useState(initialFilters);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value, 
        }));
    };

    const handleApplyFilters = () => {
        
        console.log('Filters to apply:', filters);
        onApplyFilters(filters); 
    };

    const handleResetFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            category: '',
            locked: '',
            sort: '',
        });
        onApplyFilters({
            startDate: '',
            endDate: '',
            category: '',
            locked: '',
            sort: '',
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    width: '220px',
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: '8px', 
                        color: '#333', 
                    }}
                >
                    Options
                </Typography>

                <TextField
                    label="Start Date"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Status"
                    select
                    value={filters.locked}
                    onChange={(e) => handleChange('locked', e.target.value)} 
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Locked</MenuItem>
                    <MenuItem value="false">Unlocked</MenuItem>
                </TextField>
                <TextField
                    label="Categories"
                    select
                    value={filters.category}
                    onChange={(e) => handleChange('category', e.target.value)} 
                >
                    <MenuItem value="">All</MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.title}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Sort"
                    select
                    value={filters.sort}
                    onChange={(e) => handleChange('sort', e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="likesDesc">By Likes (DESC)</MenuItem>
                    <MenuItem value="likesAsc">By Likes (ASC)</MenuItem>
                    <MenuItem value="dateDesc">By Date (DESC)</MenuItem>
                    <MenuItem value="dateAsc">By Date (ASC)</MenuItem>
                </TextField>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Button variant="text" sx={buttonStyle} size="small" fullWidth onClick={handleResetFilters}>
                        Reset
                    </Button>
                    <Button variant="contained" sx={containedButtonStyle} size="small" fullWidth onClick={handleApplyFilters}>
                        Apply
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>
    );
};


export default Filters;
